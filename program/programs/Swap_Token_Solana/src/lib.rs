use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{Token, MintTo, Mint, Transfer, Approve, TokenAccount, CloseAccount, SetAuthority};
use anchor_lang::solana_program::entrypoint::ProgramResult;

use spl_token::instruction::AuthorityType;

declare_id!("Cqvte55GwzjWgRiwjvNVRD5kPBUpkV3YFuGwQmPAcd6z"); //local
// declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); //local
// declare_id!("14XAbvD2vPJBFa1yMztS4SrVe1LKDKKpQ5X5KvSAbdtG"); //dev


#[program]
pub mod swap_token_solana {
    use super::*;
    const ESCROW_PDA_SEED: &[u8] = b"testSwap";

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

    pub fn transfer_token(ctx: Context<TransferToken>, amount_in: u64) -> ProgramResult {
        
        if !ctx.accounts.from_authority.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
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

    pub fn exchange_token(ctx: Context<Exchange>) -> Result<()>{
        let (_vault_authority, vault_authority_bump) = Pubkey::find_program_address(&[ESCROW_PDA_SEED], ctx.program_id);
        let authority_seeds = &[&ESCROW_PDA_SEED[..], &[vault_authority_bump]];

        token::transfer(
            ctx.accounts.into_transfer_to_initializer_context(), 
            ctx.accounts.escrow_account.taker_amount
        )?;
        
        token::transfer(
            ctx.accounts.into_transfer_to_taker_context().with_signer(&[&authority_seeds[..]]), 
            ctx.accounts.escrow_account.initializer_amount
        )?;

        token::close_account(
            ctx.accounts
            .into_close_context()
            .with_signer(&[&authority_seeds[..]])
        )?;

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




#[derive(Accounts)]
pub struct Exchange<'info> {
    /// CHECK: The associated token account that we are transferring the token 
    pub taker: AccountInfo<'info>,
    pub taker_deposit_token_account: Account<'info, TokenAccount>,
    pub taker_receive_token_account: Account<'info, TokenAccount>,
    pub initializer_deposit_token_account: Account<'info, TokenAccount>,
    pub initializer_receive_token_account: Account<'info, TokenAccount>,
    /// CHECK: The associated token account that we are transferring the token 
    pub initializer: AccountInfo<'info>,
    pub escrow_account: Box<Account<'info, EscrowAccount>>,
    pub vault_account: Account<'info, TokenAccount>,
    /// CHECK: The associated token account that we are transferring the token 
    pub vault_authority: AccountInfo<'info>,
    /// CHECK: The associated token account that we are transferring the token 
    pub token_program: AccountInfo<'info>,
}

#[account]
pub struct EscrowAccount {
    pub initializer_key: Pubkey,
    pub initializer_deposit_token_account: Pubkey,
    pub initializer_receive_token_account: Pubkey,
    pub initializer_amount: u64,
    pub taker_amount: u64,
}

#[derive(Accounts)]
#[instruction(vault_account_bump: u8, initializer_amount: u64)]
pub struct Initialize<'info> {
    #[account(mut, signer)]
    /// CHECK: The associated token account that we are transferring the token 
    pub initializer: AccountInfo<'info>,
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        seeds = [b"token-seed".as_ref()],
        bump,
        payer = initializer,
        token::mint = mint,
        token::authority = initializer,
    )]
    pub vault_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = initializer_deposit_token_account.amount >= initializer_amount
    )]
    pub initializer_deposit_token_account: Account<'info, TokenAccount>,
    pub initializer_receive_token_account: Account<'info, TokenAccount>,
    pub escrow_account: Box<Account<'info, EscrowAccount>>,
    /// CHECK: The associated token account that we are transferring the token 
    pub system_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
    /// CHECK: The associated token account that we are transferring the token 
    pub token_program: AccountInfo<'info>,
}

impl<'info> Initialize<'info> {
    fn into_transfer_to_pda_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self
                .initializer_deposit_token_account
                .to_account_info()
                .clone(),
            to: self.vault_account.to_account_info().clone(),
            authority: self.initializer.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }

    fn into_set_authority_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.vault_account.to_account_info().clone(),
            current_authority: self.initializer.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }
}


impl<'info> Exchange<'info> {
    fn into_transfer_to_initializer_context(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.taker_deposit_token_account.to_account_info().clone(),
            to: self
                .initializer_receive_token_account
                .to_account_info()
                .clone(),
            authority: self.taker.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }

    fn into_transfer_to_taker_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.vault_account.to_account_info().clone(),
            to: self.taker_receive_token_account.to_account_info().clone(),
            authority: self.vault_authority.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }

    fn into_close_context(&self) -> CpiContext<'_, '_, '_, 'info, CloseAccount<'info>> {
        let cpi_accounts = CloseAccount {
            account: self.vault_account.to_account_info().clone(),
            destination: self.initializer.clone(),
            authority: self.vault_authority.clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }
}