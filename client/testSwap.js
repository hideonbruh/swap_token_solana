var SolanaWeb3 = require("@solana/web3.js");
var SplTokenWeb3 = require("@solana/spl-token")
var anchor = require("@project-serum/anchor")
const programId = new SolanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
// const ownerKey = new SolanaWeb3.PublicKey("3x7ED1XULYeYNAmfYbVP8PvWZzfTFXvsrU9tQaLf8Czk")
const fs = require('fs');
const path = require("path");
const idl = JSON.parse(fs.readFileSync(
    path.resolve(__dirname + "/lib/idl", "swap_token_solana.json"),
    "utf-8"
))
console.log(idl)
const secretKeyOwner = Uint8Array.from(JSON.parse(fs.readFileSync(path.resolve(__dirname + "/lib/secretKey", "ownerKeypair.json"), "utf-8")));
let ownerKeypair = SolanaWeb3.Keypair.fromSecretKey(secretKeyOwner);
const ownerKey = ownerKeypair.publicKey;
console.log("ownerKeypair public key: " + ownerKeypair.publicKey)


// const keyTokenA = anchor.web3.Keypair.generate();
let keyTokenA = SolanaWeb3.Keypair.fromSecretKey(getSecretKey("tokenAKeypair.json"))
let keyTokenB = SolanaWeb3.Keypair.fromSecretKey(getSecretKey("tokenBKeypair.json"))
let poolWallet = SolanaWeb3.Keypair.fromSecretKey(getSecretKey("poolKeypair.json"))
const MINT_SIZE = SplTokenWeb3.MINT_SIZE;
const BN = anchor.BN

let lamports
const url = "http://localhost:8899";
let connection

async function main() {
    connection = new SolanaWeb3.Connection(url, 'confirmed');
    const version = await connection.getVersion();

    const provider = new anchor.AnchorProvider(
        connection,
        ownerKeypair,
        anchor.AnchorProvider.defaultOptions()
    );

    const program = new anchor.Program(idl, programId, provider);
    lamports = await program.provider.connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
    );

    console.log('Connection to cluster established:', url, version);
    console.log(connection);
    let associatedTokenAccountTokenA = await SplTokenWeb3.getAssociatedTokenAddress(
        keyTokenA.publicKey,
        ownerKey
    )
    await addContractAndSend(associatedTokenAccountTokenA, keyTokenA, program)

    let associatedTokenAccountTokenB = await SplTokenWeb3.getAssociatedTokenAddress(
        keyTokenB.publicKey,
        ownerKey
    )
    await addContractAndSend(associatedTokenAccountTokenB, keyTokenB, program)

    let signers = [
        {
            publicKey: ownerKeypair.publicKey,
            secretKey: ownerKeypair.secretKey
        }
    ]
    await program.methods.mintToken(new BN(1500)).accounts({
        mint: keyTokenA.publicKey,
        tokenProgram: programId,
        tokenAccount: associatedTokenAccountTokenA,
        authority: ownerKey
    }).signers(signers).rpc();
    const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccountTokenA)).value.data['parsed']['info']['tokenAmount']['amount'];
    console.log(keyTokenA)

}

async function addContractAndSend(toATA, token) {
    const min_tx = new SolanaWeb3.Transaction().add(
        anchor.web3.SystemProgram.createAccount({
            fromPubkey: ownerKey,
            newAccountPubkey: token.publicKey,
            space: SplTokenWeb3.MINT_SIZE,
            programId: programId,
            lamports: lamports
        }),
        SplTokenWeb3.createInitializeMintInstruction(
            token.publicKey, 0, ownerKey, ownerKey
        ),
        SplTokenWeb3.createAssociatedTokenAccountInstruction(
            ownerKey, toATA, ownerKey, token.publicKey
        )
    )
    let signers = [
        {
            publicKey: ownerKeypair.publicKey,
            secretKey: ownerKeypair.secretKey
        },
        {
            publicKey: token.publicKey,
            secretKey: token.secretKey
        }
    ]

    let hash = await SolanaWeb3.sendAndConfirmTransaction(
        connection,
        min_tx,
        signers
    )
    console.log(hash)
    // return hash
}

async function createAssociatedTokenAccount(user, token){
    const associatedToken = await SplTokenWeb3.getAssociatedTokenAddress(
        token.publicKey,
        user.publicKey
    )
    await SolanaWeb3.sendAndConfirmTransaction(
        new SolanaWeb3.Transaction().add(
            ownerKey, associatedToken, user.publicKey, token.publicKey
        )
    )
}

function getSecretKey(fileName){
   let t = Uint8Array.from(JSON.parse(fs.readFileSync(path.resolve(__dirname + "/lib/secretKey", fileName), "utf-8")));
   return t
}
main()