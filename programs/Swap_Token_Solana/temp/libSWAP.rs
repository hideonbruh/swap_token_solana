use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, TokenAccount, Transfer};
use solana_program::{
  program::{invoke_signed, invoke}
};
pub mod utils;
use utils::*;


declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod swap_token_solana {
   use super::*;

   pub fn swap(ctx: Context<Swap>, amount_in: u64) -> Result<()> {
  
    Ok(())
  }
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
    /// Fees associated with swap
    pub fees: FeesInput,
    /// Curve associated with swap
    pub curve: CurveInput,
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct FeesInput {
    pub trade_fee_numerator: u64,
    pub trade_fee_denominator: u64,
    pub owner_trade_fee_numerator: u64,
    pub owner_trade_fee_denominator: u64,
    pub owner_withdraw_fee_numerator: u64,
    pub owner_withdraw_fee_denominator: u64,
    pub host_fee_numerator: u64,
    pub host_fee_denominator: u64,
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct CurveInput {
    pub curve_type: u8,
    pub curve_parameters: u64,
}

=================


use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, TokenAccount, Transfer};
pub mod utils;
use utils::*;


declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod swap_token_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}
// #[program]
// pub mod swap_token_solana {
//    use super::*;

//    pub fn swap(ctx: Context<Initialize>, amount_in: u64, _vault_account_bump: u8) -> Result<()> {
//     let rs = sol_transfer(
//         ctx.accounts.admin.to_account_info(),
//         ctx.accounts.vault_authority.to_account_info(),
//         ctx.accounts.system_program.to_account_info(),
//         amount_in
//     );
//     Ok(())
//   }
// }

// #[derive(Accounts)]
// pub struct Swap<'info> {
//     pub source: Signer<'info>,
//     pub destination: Account<'info, TokenAccount>,
//     pub system_program: Program<'info, System>,
//     pub amount: u64
// }

#[derive(Accounts)]
#[instruction( _vault_account_bump: u8)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account (
        init_if_needed,
        seeds= [b"vault-account".as_ref()],
        bump = _vault_account_bump,
        payer = admin,
        token::mint = token_mint,
        token::authority = admin
    )]
    pub vault_account: Account<'info, TokenAccount>,
    pub token_mint: Account<'info, Mint>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>
}