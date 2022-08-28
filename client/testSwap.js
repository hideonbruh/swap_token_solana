var SolanaWeb3 = require("@solana/web3.js");
var SplTokenWeb3  = require("@solana/spl-token")
var anchor = require("@project-serum/anchor")
const programId = new SolanaWeb3.PublicKey("14XAbvD2vPJBFa1yMztS4SrVe1LKDKKpQ5X5KvSAbdtG")
const ownerKey = new SolanaWeb3.PublicKey("3x7ED1XULYeYNAmfYbVP8PvWZzfTFXvsrU9tQaLf8Czk")

async function main(){

    const url = "https://api.devnet.solana.com";
    const connection = new SolanaWeb3.Connection(url, 'recent');
    const version = await connection.getVersion();
    // anchor.set
    // const provider = await anchor.AnchorProvider.local(url);
    // console.log(provider)
  
    console.log('Connection to cluster established:', url, version);
    console.log(connection);
    const tokenAccount = await connection.getTokenAccountsByOwner(
        ownerKey,
        {
            programId: SplTokenWeb3.TOKEN_PROGRAM_ID
        }
    )
    console.log(tokenAccount);
    const keyTokenA = anchor.web3.Keypair.generate();
    const keyTokenB = anchor.web3.Keypair.generate();
    const poolWallet = anchor.web3.Keypair.generate();
    console.log(keyTokenA)

}
main()