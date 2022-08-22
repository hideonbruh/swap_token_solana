import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SwapTokenSolana } from "../target/types/swap_token_solana";

describe("Swap_Token_Solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SwapTokenSolana as Program<SwapTokenSolana>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
