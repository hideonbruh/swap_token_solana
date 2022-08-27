use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{Token, MintTo, Transfer, Approve};

// declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); //local
declare_id!("14XAbvD2vPJBFa1yMztS4SrVe1LKDKKpQ5X5KvSAbdtG"); //dev

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

    pub fn approve_token(ctx: Context<ApproveToken>, amount_in: u64) -> Result<()>{
        let approve_instruction = Approve{
            to: ctx.accounts.to.to_account_info(),
            delegate: ctx.accounts.delegate.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
         
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, approve_instruction);

        anchor_spl::token::approve(cpi_ctx, amount_in)?;
        Ok(())
    }

    pub fn swap_token(ctx: Context<PoolToken>, amount_in: u64) -> Result<()>{
        let fixed_rate = 80;
        let amount_out = amount_in*fixed_rate/100;

        let transfer_instruction = Transfer{
            from: ctx.accounts.ata_source_user_a.to_account_info(),
            to: ctx.accounts.ata_pool_token_a.to_account_info(),
            authority: ctx.accounts.from_authority.to_account_info(),
        };
         
        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the Context for our Transfer request
        let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction);

        // Execute anchor's helper function to transfer tokens
        anchor_spl::token::transfer(cpi_ctx, amount_in)?;

        let transfer_instruction2 = Transfer{
            from: ctx.accounts.ata_pool_token_b.to_account_info(),
            to: ctx.accounts.ata_source_user_b.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
         
        let cpi_program2 = ctx.accounts.token_program.to_account_info();
        // Create the Context for our Transfer request
        let cpi_ctx2 = CpiContext::new(cpi_program2, transfer_instruction2);

        // Execute anchor's helper function to transfer tokens
        anchor_spl::token::transfer(cpi_ctx2, amount_out)?;
 
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
pub struct ApproveToken<'info> {
    pub token_program: Program<'info, Token>,
    /// CHECK: This is the token that we want to mint
    #[account(mut)]
    pub to: AccountInfo<'info>,
    /// CHECK: This is the token that we want to mint
    #[account(mut)]
    pub delegate: AccountInfo<'info>,
    /// CHECK: This is the token that we want to mint
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
pub struct PoolToken<'info> {
    pub token_program: Program<'info, Token>,
    /// CHECK: The associated token account that we are transferring the token 
    #[account(mut)]
    pub ata_pool_token_a: AccountInfo<'info>,
    /// CHECK: The associated token account that we are transferring the token 
    #[account(mut)]
    pub ata_pool_token_b: AccountInfo<'info>,
    /// CHECK: The associated token account that we are transferring the token 
    #[account(mut)]
    pub ata_source_user_a: AccountInfo<'info>,
    /// CHECK: The associated token account that we are transferring the token 
    #[account(mut)]
    pub ata_source_user_b: AccountInfo<'info>,
    // the authority of the from account 
    pub from_authority: Signer<'info>, 
    pub authority: Signer<'info>,
}


