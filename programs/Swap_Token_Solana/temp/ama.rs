use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, TokenAccount, Transfer};
use solana_program::{
  program::{invoke_signed, invoke}
};


declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod swap_token_solana {
   use super::*;

   pub fn swap(ctx: Context<Swap>, amount_in: u64, minimum_amount_out: u64) -> Result<()> {
    
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

// pub fn swap_token(ctx: Context<SwapToken>) -> Result<()> {
    //     let transfer_instruction_tokenA = Transfer{
    //         from: ctx.accounts.token_program_A.from.to_account_info(),
    //         to: ctx.accounts.token_program_A.to.to_account_info(),
    //         authority: ctx.accounts.token_program_A.from_authority.to_account_info(),
    //     };
    //     let cpi_program = ctx.accounts.token_program.to_account_info();
    //     // Create the Context for our Transfer request
    //     let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction_tokenA);

    //     // Execute anchor's helper function to transfer tokens
    //     anchor_spl::token::transfer(cpi_ctx, 5)?;

    //     let transfer_instruction_tokenB = Transfer{
    //         from: ctx.accounts.token_program_B.from.to_account_info(),
    //         to: ctx.accounts.token_program_B.to.to_account_info(),
    //         authority: ctx.accounts.token_program_B.from_authority.to_account_info(),
    //     };
    //     let cpi_program = ctx.accounts.token_program.to_account_info();
    //     // Create the Context for our Transfer request
    //     let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction_tokenB);

    //     // Execute anchor's helper function to transfer tokens
    //     anchor_spl::token::transfer(cpi_ctx, 5)?;
    // }

    #[derive(Accounts)]
pub struct SwapPool<'info> {
    pub token_program: Program<'info, Token>,
    /// CHECK: This is the token that we want to mint
    #[account(mut)]
    pub mint_pool: AccountInfo<'info>,
    /// CHECK: Safe
    #[account(mut)]
    pub source_info: AccountInfo<'info>,
    /// CHECK: Safe
    #[account(mut)]
    pub destination_info: AccountInfo<'info>,
    /// CHECK: The associated token account that we are transferring the token to
    #[account(mut)]
    pub user: AccountInfo<'info>,
    // the authority of the from account 
    pub from_authority: Signer<'info>,
}


#[derive(Accounts)]
pub struct SwapToken<'info> {
    pub token_program: Program<'info, Token>,
    /// CHECK: The associated token account that we are transferring the token from
    #[account(mut)]
    pub from: UncheckedAccount<'info>,
    /// CHECK: The associated token account that we are transferring the token to
    #[account(mut)]
    pub to: AccountInfo<'info>,
    // the authority of the from account 
    pub from_authority: Signer<'info>,
}