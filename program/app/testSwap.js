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

import {
    Account,
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction
} from '@solana/web3.js';

let connection;
async function getConnection(){
  if (connection) return connection;

  const url = "https://api.devnet.solana.com";
  connection = new Connection(url, 'recent');
  const version = await connection.getVersion();

  console.log('Connection to cluster established:', url, version);
  return connection;
}

async function main(){
    connection = await getConnection();
    console.log(connection)
}
main()