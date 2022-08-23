use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{Token, MintTo, Mint, Transfer, TokenAccount};


declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod swap_token_solana {
    use super::*;

    pub fn mint_token(ctx: Context<MintToken>, amount_in: u64) -> Result<()> {
        // Create the MintTo struct for our context
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the CpiContext we need for the request
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Execute anchor's helper function to mint tokens
        token::mint_to(cpi_ctx, amount_in)?;
        
        Ok(())
    }

    pub fn transfer_token(ctx: Context<TransferToken>, amount_in: u64) -> Result<()> {
        // Create the Transfer struct for our context
        let transfer_instruction = Transfer{
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.from_authority.to_account_info(),
        };
         
        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the Context for our Transfer request
        let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction);

        // Execute anchor's helper function to transfer tokens
        anchor_spl::token::transfer(cpi_ctx, amount_in)?;
 
        Ok(())
    }

    pub fn swap_token(ctx: Context<SwapPool>, amount_in: u64, fee_pool: u64) -> Result<()>{
        let fixed_rate = 80;
        let amount_out = amount_in*fixed_rate/100;

        //Transfer token A to Mint Pool
        let transfer_instruction = Transfer{
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.mint_pool.to_account_info(),
            authority: ctx.accounts.from_authority.to_account_info(),
        };
        let cpi_program_a = ctx.accounts.source_info.to_account_info();
        // Create the Context for our Transfer request
        let cpi_ctx_a = CpiContext::new(cpi_program_a, transfer_instruction);

        // Execute anchor's helper function to transfer tokens
        anchor_spl::token::transfer(cpi_ctx_a, amount_in)?;

        //Transfer token B to Mint Pool
        let transfer_instruction = Transfer{
            from: ctx.accounts.mint_pool.to_account_info(),
            to: ctx.accounts.user.to_account_info(),
            authority: ctx.accounts.from_authority.to_account_info(),
        };
        let cpi_program_b = ctx.accounts.destination_info.to_account_info();
        // Create the Context for our Transfer request
        let cpi_ctx_b = CpiContext::new(cpi_program_b, transfer_instruction);

        // Execute anchor's helper function to transfer tokens
        anchor_spl::token::transfer(cpi_ctx_b, amount_out)?;
        

        Ok(())
    }    

}

#[derive(Accounts)]
pub struct MintToken<'info> {
    /// CHECK: This is the token that we want to mint
    #[account(mut)]
    pub mint: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    /// CHECK: This is the token account that we want to mint tokens to
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,
    /// CHECK: the authority of the mint account
    #[account(mut)]
    pub authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct TransferToken<'info> {
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

#[derive(Accounts)]
pub struct SwapPool<'info> {
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
    pub from_authority: Signer<'info>,
}


