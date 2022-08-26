import * as anchor from "@project-serum/anchor";
import { AccountClient, Program } from "@project-serum/anchor";
import { SwapTokenSolana } from "../target/types/swap_token_solana";
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  setAuthorityInstructionData,
  createSetAuthorityInstruction,
  createAccount
} from "@solana/spl-token";
import { assert, use } from "chai";
import { token } from "@project-serum/anchor/dist/cjs/utils";
const BN = anchor.BN
var lamports: number = 0

describe("Test Mint Token Solana", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  console.log("Provider: " + provider.wallet.publicKey)
  anchor.setProvider(anchor.AnchorProvider.env());
  // Retrieve the TokenContract struct from our smart contract
  const program = anchor.workspace.SwapTokenSolana as Program<SwapTokenSolana>;
  // Generate a random keypair that will represent our token
  let arrTokenKey = []
  const otherUser: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const userTransferAuthority: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const addTokenA: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const addTokenB: anchor.web3.Keypair = anchor.web3.Keypair.generate();    
  const poolWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();

  // AssociatedTokenAccount for anchor's workspace wallet
  let associatedTokenAccountTokenA = undefined;
  let associatedTokenAccountTokenB = undefined;
  let associatedTokenAccountTokenAToMintPool = undefined;
  it("Mint a token", async () => {
    // Get anchor's wallet's public key
    const owner = anchor.AnchorProvider.env().wallet;
    const ownerKey = owner.publicKey;
    console.log("Onwer public key:" + ownerKey)

    // Get the amount of SOL needed to pay rent for our Token Mint
    lamports = await program.provider.connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );

    console.log("MINT_SIZE: " + MINT_SIZE)

    // Get the ATA for a token and the account that we want to own the ATA (but it might not existing on the SOL network yet)
    associatedTokenAccountTokenA = await getAssociatedTokenAddress(
      addTokenA.publicKey,
      ownerKey
    );
    // associatedTokenAccountTokenA = await createAssociatedTokenAccountI(owner, owner, addTokenA)
    // associatedTokenAccountTokenB = await createAssociatedTokenAccountI(owner, owner, addTokenA)
    associatedTokenAccountTokenB = await getAssociatedTokenAddress(
      addTokenB.publicKey,
      ownerKey
    );

    // console.log("Token KEY 1: " + addTokenA.publicKey);
    // Fires a list of instructions
    const mint_tx = new anchor.web3.Transaction().add(
      // Use anchor to create an account from the mint key that we created
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: ownerKey,
        newAccountPubkey: addTokenA.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      // Fire a transaction to create our mint account that is controlled by our anchor wallet
      createInitializeMintInstruction(
        addTokenA.publicKey, 0, ownerKey, ownerKey
      ),
      // Create the ATA account that is associated with our mint on our anchor wallet
      createAssociatedTokenAccountInstruction(
        ownerKey, associatedTokenAccountTokenA, ownerKey, addTokenA.publicKey
      )
    );
    // await mintInstruction(owner, addTokenA, lamports)

    const mint_tx2 = new anchor.web3.Transaction().add(
      // Use anchor to create an account from the mint key that we created
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: ownerKey,
        newAccountPubkey: addTokenB.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      // Fire a transaction to create our mint account that is controlled by our anchor wallet
      createInitializeMintInstruction(
        addTokenB.publicKey, 0, ownerKey, ownerKey
      ),
      // Create the ATA account that is associated with our mint on our anchor wallet
      createAssociatedTokenAccountInstruction(
        ownerKey, associatedTokenAccountTokenB, ownerKey, addTokenB.publicKey
      )
    );
    console.log("TOKEN_PROGRAM_ID: " + TOKEN_PROGRAM_ID)

    // sends and create the transaction
    const res = await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [addTokenA]);
    const res2 = await anchor.AnchorProvider.env().sendAndConfirm(mint_tx2, [addTokenB]);

    // console.log("Account: ", res);
    // console.log("Token key: ", addTokenA.publicKey.toString());
    // console.log("User: ", ownerKey.toString());

    // Executes our code to mint our token into our specified ATA
    await program.methods.mintToken(new BN(1500)).accounts({
      mint: addTokenA.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenAccount: associatedTokenAccountTokenA,
      authority: ownerKey,
    }).rpc();

    await program.methods.mintToken(new BN(1500)).accounts({
      mint: addTokenB.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenAccount: associatedTokenAccountTokenB,
      authority: ownerKey,
    }).rpc();
    // Get minted token amount on the ATA for our anchor wallet

    // const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccountTokenA)).value.data.parsed.info.tokenAmount.amount;
    const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccountTokenA)).value.data['parsed']['info']['tokenAmount']['amount'];
    assert.equal(minted, 1500);
    const minted2 = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccountTokenA)).value.data['parsed']['info']['tokenAmount']['amount'];
    assert.equal(minted2, 1500);
  });

  it("Transfer token", async () => {
    // Get anchor's wallet's public key
    const myWallet = anchor.AnchorProvider.env().wallet.publicKey;
    // Wallet that will receive the token 
    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    // The ATA for a token on the to wallet (but might not exist yet)
    const toATA = await getAssociatedTokenAddress(
      addTokenA.publicKey,
      toWallet.publicKey
    );
    const toATAOtherUser = await getAssociatedTokenAddress(
      addTokenA.publicKey,
      otherUser.publicKey
    );

    // Fires a list of instructions
    const mint_tx = new anchor.web3.Transaction().add(
      // Create the ATA account that is associated with our To wallet
      createAssociatedTokenAccountInstruction(
        myWallet, toATA, toWallet.publicKey, addTokenA.publicKey
      )
    );



    // Sends and create the transaction
    await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, []);
    await anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
      // Create the ATA account that is associated with our To wallet
      createAssociatedTokenAccountInstruction(
        myWallet, toATAOtherUser, otherUser.publicKey, addTokenA.publicKey
      )
    ), []);
    // Executes our transfer smart contract 
    let accountObject = {
      tokenProgram: TOKEN_PROGRAM_ID,
      from: associatedTokenAccountTokenA,
      fromAuthority: myWallet,
      to: toATA,
    }
    // console.log(accountObject)
    await program.methods.transferToken(new BN(10)).accounts(accountObject).rpc();
    // console.log("getAssociatedTokenAddress: " + toATAOtherUser)
    await program.methods.transferToken(new BN(50)).accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      from: associatedTokenAccountTokenA,
      fromAuthority: myWallet,
      to: toATAOtherUser,
    }).rpc();



    // let blTokenFromMintPool = await program.provider.connection.getBalance(addTokenA.publicKey)
    // console.log("Balance token from mint pool: " + blTokenFromMintPool);

    // Get minted token amount on the ATA for our anchor wallet

    const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccountTokenA)).value.data;
    // console.log(minted)
    assert.equal(minted['parsed']['info']['tokenAmount']['amount'], 1440);
  });
  it("Swap Token Solana", async () => {
    // Get anchor's wallet's public key
    const myWallet = anchor.AnchorProvider.env().wallet;
    const ownerKey = myWallet.publicKey;
    const otherWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const connection = program.provider.connection;
    let payer: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    // Wallet that will receive the token 
    console.log("Admin public key:" + myWallet.publicKey);
    // Get the amount of SOL needed to pay rent for our Token Mint
    const lamports: number = await program.provider.connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );
    let rqAirdrop = await program.provider.connection.requestAirdrop(
      otherWallet.publicKey,
      100000000
    )
    // await anchor.AnchorProvider.env().sendAndConfirm(rqAirdrop)
    await program.provider.connection.confirmTransaction(rqAirdrop)

    let balanceOtherWallet = await program.provider.connection.getBalance(otherWallet.publicKey)
    console.log("balanceOtherWallet: " + balanceOtherWallet)

    let rqAirdropPool = await program.provider.connection.requestAirdrop(
      poolWallet.publicKey,
      100000000
    )
    await program.provider.connection.confirmTransaction(rqAirdropPool)

    let balancePool = await program.provider.connection.getBalance(poolWallet.publicKey)
    console.log("balancePool: " + balancePool)
    
    //Create ATA token pool A
    let tokenATAPoolTokenA = await createAssociatedTokenAccountInstr(myWallet, poolWallet, addTokenA)
    let tokenATAPoolTokenB = await createAssociatedTokenAccountInstr(myWallet, poolWallet, addTokenB)

    await program.methods.transferToken(new BN(1000)).accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      from: associatedTokenAccountTokenA,
      fromAuthority: myWallet.publicKey,
      to: tokenATAPoolTokenA,
    }).rpc();

    const _bf_minted = (await program.provider.connection.getParsedAccountInfo(tokenATAPoolTokenA)).value.data;
    console.log("Before Pool Token A: " + _bf_minted['parsed']['info']['tokenAmount']['amount']);


    await program.methods.transferToken(new BN(1000)).accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      from: associatedTokenAccountTokenB,
      fromAuthority: myWallet.publicKey,
      to: tokenATAPoolTokenB,
    }).rpc();
  

    const otherUserATATokenA = await createAssociatedTokenAccountInstr(myWallet, otherWallet, addTokenA);
    const otherUserATATokenB = await createAssociatedTokenAccountInstr(myWallet, otherWallet, addTokenB);


    await program.methods.transferToken(new BN(50)).accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      from: associatedTokenAccountTokenA,
      fromAuthority: myWallet.publicKey,
      to: otherUserATATokenA,
    }).rpc();

    await program.methods.transferToken(new BN(5)).accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      from: tokenATAPoolTokenA,
      fromAuthority: poolWallet.publicKey,
      to: associatedTokenAccountTokenA,
    }).signers([poolWallet]).rpc();

    
    const mintedOtherA = (await program.provider.connection.getParsedAccountInfo(tokenATAPoolTokenA)).value.data;
    console.log("otherUserToken Token A: " + mintedOtherA['parsed']['info']['tokenAmount']['amount']);
    console.log("After transfer from pool A to otherUser")
    const minted = (await program.provider.connection.getParsedAccountInfo(tokenATAPoolTokenA)).value.data;
    console.log("Pool Token A: " + minted['parsed']['info']['tokenAmount']['amount']);
    const minted2 = (await program.provider.connection.getParsedAccountInfo(tokenATAPoolTokenB)).value.data;
    console.log("Pool Token B: " + minted2['parsed']['info']['tokenAmount']['amount']);
    const minted3 = (await program.provider.connection.getParsedAccountInfo(otherUserATATokenA)).value.data;
    console.log("Balance Token A of otherWallet: " + minted3['parsed']['info']['tokenAmount']['amount']);
    const minted4 = (await program.provider.connection.getParsedAccountInfo(otherUserATATokenB)).value.data;
    console.log("Balance Token B of otherWallet: " + minted4['parsed']['info']['tokenAmount']['amount']);

    await program.methods.swapToken(new BN(5)).accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      ataPoolTokenA: tokenATAPoolTokenA,
      ataPoolTokenB: tokenATAPoolTokenB,
      ataSourceUserA: otherUserATATokenA,
      ataSourceUserB: otherUserATATokenB,
      fromAuthority: otherWallet.publicKey,
      authority: poolWallet.publicKey
    }).signers([otherWallet, poolWallet]).rpc();


    const rsOtherWalletTokenA = (await program.provider.connection.getParsedAccountInfo(otherUserATATokenA)).value.data;
    console.log("otherUserToken Token A: " + rsOtherWalletTokenA['parsed']['info']['tokenAmount']['amount']);
    const rsOtherWalletTokenB = (await program.provider.connection.getParsedAccountInfo(otherUserATATokenB)).value.data;
    console.log("otherUserToken Token B: " + rsOtherWalletTokenB['parsed']['info']['tokenAmount']['amount']);
  })
});

async function createAssociatedTokenAccountInstr(owner, user, token) {
  const associatedToken = await getAssociatedTokenAddress(
    token.publicKey,
    user.publicKey
  );

  await anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
    createAssociatedTokenAccountInstruction(
      owner.publicKey, associatedToken, user.publicKey, token.publicKey
    )
  ), []);
  return associatedToken
}

async function mintInstruction(owner, token, lamports){
  
  let associatedTokenAccount = await getAssociatedTokenAddress(
    token.publicKey,
    owner.publicKey
  );

  

  const mint_tx = new anchor.web3.Transaction().add(
    
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: owner.publicKey,
      newAccountPubkey: token.publicKey,
      space: MINT_SIZE,
      programId: TOKEN_PROGRAM_ID,
      lamports,
    }),
    
    createInitializeMintInstruction(
      token.publicKey, 0, owner.publicKey, owner.publicKey
    ),
    
    createAssociatedTokenAccountInstruction(
      owner.publicKey, associatedTokenAccount, owner.publicKey, token.publicKey
    )
  );

  await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [token.publicKey]);
}