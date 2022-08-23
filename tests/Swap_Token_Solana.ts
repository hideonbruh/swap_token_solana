import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SwapTokenSolana } from "../target/types/swap_token_solana";
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
} from "@solana/spl-token";
import { assert } from "chai";
const BN = anchor.BN

describe("Test Mint Token Solana", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  console.log("Provider: "+ provider.wallet.publicKey)
  anchor.setProvider(anchor.AnchorProvider.env());
  // Retrieve the TokenContract struct from our smart contract
  const program = anchor.workspace.SwapTokenSolana as Program<SwapTokenSolana>;
  // Generate a random keypair that will represent our token
  let arrTokenKey = []
  const mintPool: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const tokenKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const tokenKey2: anchor.web3.Keypair = anchor.web3.Keypair.generate();

  // AssociatedTokenAccount for anchor's workspace wallet
  let associatedTokenAccount = undefined;
  let associatedTokenAccountToMintPool = undefined;
  it("Mint a token", async () => {
    // Get anchor's wallet's public key
    const ownerKey = anchor.AnchorProvider.env().wallet.publicKey;
    console.log("Onwer public key:" + ownerKey)
    
    // Get the amount of SOL needed to pay rent for our Token Mint
    const lamports: number = await program.provider.connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );
    
    console.log("MINT_SIZE: " + MINT_SIZE)

    // Get the ATA for a token and the account that we want to own the ATA (but it might not existing on the SOL network yet)
    associatedTokenAccount = await getAssociatedTokenAddress(
      tokenKey.publicKey,
      ownerKey
    );
    associatedTokenAccountToMintPool = await getAssociatedTokenAddress(
      tokenKey.publicKey,
      mintPool.publicKey
    );
    console.log("Token KEY 1: " + tokenKey.publicKey);
    // Fires a list of instructions
    const mint_tx = new anchor.web3.Transaction().add(
      // Use anchor to create an account from the mint key that we created
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: ownerKey,
        newAccountPubkey: tokenKey.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      // Fire a transaction to create our mint account that is controlled by our anchor wallet
      createInitializeMintInstruction(
        tokenKey.publicKey, 0, ownerKey, ownerKey
      ),
      // Create the ATA account that is associated with our mint on our anchor wallet
      createAssociatedTokenAccountInstruction(
        ownerKey, associatedTokenAccount, ownerKey, tokenKey.publicKey
      )
    );
    console.log("TOKEN_PROGRAM_ID: " + TOKEN_PROGRAM_ID)

    // sends and create the transaction
    const res = await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [tokenKey]);

    console.log("Account: ", res);
    console.log("Token key: ", tokenKey.publicKey.toString());
    console.log("User: ", ownerKey.toString());

    // Executes our code to mint our token into our specified ATA
    await program.methods.mintToken(new BN(1000)).accounts({
      mint: tokenKey.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenAccount: associatedTokenAccount,
      authority: ownerKey,
    }).rpc();
    // Get minted token amount on the ATA for our anchor wallet

    // const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccount)).value.data.parsed.info.tokenAmount.amount;
    const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccount)).value.data['parsed']['info']['tokenAmount']['amount'];
    assert.equal(minted, 1000);
  });

  it("Transfer token", async () => {
    // Get anchor's wallet's public key
    const myWallet = anchor.AnchorProvider.env().wallet.publicKey;
    // Wallet that will receive the token 
    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    // The ATA for a token on the to wallet (but might not exist yet)
    const toATA = await getAssociatedTokenAddress(
      tokenKey.publicKey,
      toWallet.publicKey
    );
    const toATASwapPool = await getAssociatedTokenAddress(
      tokenKey.publicKey,
      mintPool.publicKey
    );

    // Fires a list of instructions
    const mint_tx = new anchor.web3.Transaction().add(
      // Create the ATA account that is associated with our To wallet
      createAssociatedTokenAccountInstruction(
        myWallet, toATA, toWallet.publicKey, tokenKey.publicKey
      )
    );



    // Sends and create the transaction
    await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, []);
    await anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
      // Create the ATA account that is associated with our To wallet
      createAssociatedTokenAccountInstruction(
        myWallet, toATASwapPool, mintPool.publicKey, tokenKey.publicKey
      )
    ), []);
    // Executes our transfer smart contract 
    let accountObject = {
      tokenProgram: TOKEN_PROGRAM_ID,
      from: associatedTokenAccount,
      fromAuthority: myWallet,
      to: toATA,
    }
    // console.log(accountObject)
    await program.methods.transferToken(new BN(10)).accounts(accountObject).rpc();
    console.log("getAssociatedTokenAddress: " + associatedTokenAccountToMintPool)
    await program.methods.transferToken(new BN(50)).accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      from: associatedTokenAccount,
      fromAuthority: myWallet,
      to: associatedTokenAccountToMintPool,
    }).rpc();



    // let blTokenFromMintPool = await program.provider.connection.getBalance(tokenKey.publicKey)
    // console.log("Balance token from mint pool: " + blTokenFromMintPool);

    // Get minted token amount on the ATA for our anchor wallet

    const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccount)).value.data;
    // console.log(minted)
    assert.equal(minted['parsed']['info']['tokenAmount']['amount'], 940);
  });
  it("Swap Token Solana", async () => {
    // Get anchor's wallet's public key
    const myWallet = anchor.AnchorProvider.env().wallet;
    // Wallet that will receive the token 
    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    console.log("Admin public key:" + myWallet.publicKey)
    // Get the amount of SOL needed to pay rent for our Token Mint
    const lamports: number = await program.provider.connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );
  })
});
