use anchor_lang::prelude::*;
use solana_program::{
  program::{invoke_signed, invoke}
};

// transfer sol
pub fn sol_transfer<'a>(
  source: AccountInfo<'a>,
  destination: AccountInfo<'a>,
  system_program: AccountInfo<'a>,
  amount: u64,
) -> Result<()> {
  let ix = solana_program::system_instruction::transfer(source.key, destination.key, amount);
  invoke(&ix, &[source, destination, system_program]);
  Ok(())
}
pub fn sol_transfer_with_signer<'a>(
  source: AccountInfo<'a>,
  destination: AccountInfo<'a>, 
  system_program: AccountInfo<'a>,
  signers: &[&[&[u8]]; 1],
  amount: u64,
) -> Result<()> {
  let ix = solana_program::system_instruction::transfer(source.key, destination.key, amount);
  invoke_signed(&ix, &[source, destination, system_program], signers);
  Ok(())
}

#[account]
pub struct Amm {
    pub initializer_key: Pubkey,
    pub initializer_deposit_token_account: Pubkey,
    pub initializer_receive_token_account: Pubkey,
    pub initializer_amount: u64,
    pub taker_amount: u64,
    /// Is the swap initialized, with data written to it
    pub is_initialized: bool,
    /// Bump seed used to generate the program address / authority
    pub bump_seed: u8,
    /// Token program ID associated with the swap
    pub token_program_id: Pubkey,
    /// Address of token A liquidity account
    pub token_a_account: Pubkey,
    /// Address of token B liquidity account
    pub token_b_account: Pubkey,
    /// Address of pool token mint
    pub pool_mint: Pubkey,
    /// Address of token A mint
    pub token_a_mint: Pubkey,
    /// Address of token B mint
    pub token_b_mint: Pubkey,
    /// Address of pool fee account
    pub pool_fee_account: Pubkey,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    /// CHECK: Safe
    pub authority: AccountInfo<'info>,
    pub amm: Box<Account<'info, Amm>>,
    /// CHECK: Safe
    #[account(signer)]
    pub user_transfer_authority: AccountInfo<'info>,
    /// CHECK: Safe
    #[account(mut)]
    pub source_info: AccountInfo<'info>,
    /// CHECK: Safe
    #[account(mut)]
    pub destination_info: AccountInfo<'info>,
    #[account(mut)]
    pub swap_source: Account<'info, TokenAccount>,
    #[account(mut)]
    pub swap_destination: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_mint: Account<'info, Mint>,
    #[account(mut)]
    pub fee_account: Account<'info, TokenAccount>,
    /// CHECK: Safe
    pub token_program: AccountInfo<'info>,
    /// CHECK: Safe
    pub host_fee_account: AccountInfo<'info>,
}