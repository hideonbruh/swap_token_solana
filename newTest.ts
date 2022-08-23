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
  const tokenPool: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const tokenA: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const tokenB: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const connection = program.provider.connection;
  // AssociatedTokenAccount for anchor's workspace wallet
  let associatedTokenAccount = undefined;
  let associatedTokenAccountToMintPool = undefined;
  it("Mint a token", async () => {
    // Get anchor's wallet's public key
    const ownerKey = anchor.AnchorProvider.env().wallet.publicKey;
    console.log("Onwer public key:" + ownerKey)
    console.log("TOKEN_PROGRAM_ID: " + TOKEN_PROGRAM_ID)
    const lamports: number = await program.provider.connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );
    console.log("MINT_SIZE: " + MINT_SIZE)
    associatedTokenAccount = await getAssociatedTokenAddress(
      tokenPool.publicKey,
      ownerKey
    );
    console.log("Token Pool: " + tokenPool.publicKey);
    const mint_tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: ownerKey,
        newAccountPubkey: tokenPool.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      createInitializeMintInstruction(
        tokenPool.publicKey, 0, ownerKey, ownerKey
      ),
      createAssociatedTokenAccountInstruction(
        ownerKey, associatedTokenAccount, ownerKey, tokenPool.publicKey
      )
    );
    await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [tokenPool]);

    await program.methods.mintToken(new BN(1000)).accounts({
      mint: tokenPool.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenAccount: associatedTokenAccount,
      authority: ownerKey,
    }).rpc();

    let associatedTokenAccount2 = await getAssociatedTokenAddress(
      tokenA.publicKey,
      ownerKey
    );
    console.log("Token A: " + tokenA.publicKey);
    const mint_tx2 = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: ownerKey,
        newAccountPubkey: tokenA.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      createInitializeMintInstruction(
        tokenA.publicKey, 0, ownerKey, ownerKey
      ),
      createAssociatedTokenAccountInstruction(
        ownerKey, associatedTokenAccount2, ownerKey, tokenA.publicKey
      )
    );
    await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [tokenA]);

    await program.methods.mintToken(new BN(1000)).accounts({
      mint: tokenA.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenAccount: associatedTokenAccount2,
      authority: ownerKey,
    }).rpc();
        
    const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccount)).value.data['parsed']['info']['tokenAmount']['amount'];
    assert.equal(minted, 1000);
  });

  
});
