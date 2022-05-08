use anchor_lang::prelude::*;
use anchor_spl::token;
use std::mem::size_of;

declare_id!("2nWmfGZboX1TcUKcQwFLRrDSQf6XkSE1pMeGCF9Au83a");

const TEXT_LENGTH: usize = 1024;
const USER_NAME_LENGTH: usize = 100;
const USER_URL_LENGTH: usize = 255;

#[program]
pub mod face {
    use super::*;

    pub fn create_state(ctx: Context<CreateState>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        
        state.authority = ctx.accounts.authority.key();

        state.post_count = 0;
        Ok(())
    }

    pub fn create_post(
        ctx: Context<CreatePost>,
        text: String,
        poster_name: String,
        poster_url: String
    ) -> Result<()> {
        //not here we're giving each post access to the state account
        let state = &mut ctx.accounts.state;

        let post = &mut ctx.accounts.post;

        post.authority = ctx.accounts.authority.key();

        post.text = text;

        post.poster_name = poster_name;

        post.poster_url = poster_url;

        post.comment_count = 0;

        post.index = state.post_count;

        post.post_time = ctx.accounts.clock.unix_timestamp;

        state.post_count += 1;

        Ok(())
    }

    pub fn create_comment(
        ctx: Context<CreateComment>,
        text: String,
        commenter_name: String,
        commenter_url: String,
    ) -> Result <()> {
        let post = &mut ctx.accounts.post;

        let comment = &mut ctx.accounts.comment;

        comment.authority = ctx.accounts.authority.key();

        comment.index = post.comment_count;

        comment.text = text;

        comment.commenter_name = commenter_name;

        comment.commenter_url = commenter_url;

        comment.comment_time = ctx.accounts.clock.unix_timestamp;

        post.comment_count += 1;

        Ok(())


    }
}

#[derive(Accounts)]
pub struct CreateState<'info> {
    #[account(
        init,
        seeds = [b"state".as_ref()],
        bump,
        payer = authority,
    space = size_of::<StateAccount>() + 8
    )]
    pub state: Account<'info, StateAccount>,

    //The signer who has paid the transaction fee to create the state struct above
    // important for it to apply the 'mut' constrait to allow multiple addresses to create state.

    #[account(mut)]
    pub authority: Signer<'info>,

    //System Program

    // !!!!! this is unsecure! come back and change in production !!!!!

    pub system_program: UncheckedAccount<'info>,

    //Token program

    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, token::Token>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {

    // NOTICE this has NO 'init' constraint. It's not an initialized account
    //no need for 'payer' | 'space' as we want this variable to act as a reference to
    // the state account we'll create.
    #[account(mut, seeds = [b"state".as_ref()], bump)]
    pub state: Account<'info, StateAccount>,
   
    // Authenticate Post Account

    #[account(
        init,
        seeds = [b"post".as_ref(), state.post_count.to_be_bytes().as_ref()],
        bump,
        payer = authority,
        space = size_of::<PostAccount>() + USER_URL_LENGTH + TEXT_LENGTH + USER_NAME_LENGTH,
    )]
    pub post: Account<'info, PostAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: UncheckedAccount<'info>,


    //constraint means -- if this smart contract is init'd with USDC, any user that wants to create a post
    // has to do so with USDC. Therefore use this to create exclusivity or not.
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, token::Token>,

    pub clock: Sysvar<'info, Clock>
}

#[derive(Accounts)]
pub struct CreateComment<'info> {

    #[account(mut, seeds= [b"post".as_ref(), post.index.to_be_bytes().as_ref()], bump)]
    pub post: Account<'info, PostAccount>,

    #[account(init, seeds= [
        b"comment".as_ref(),
        post.index.to_be_bytes().as_ref(), 
        post.comment_count.to_be_bytes().as_ref()
        ],
        bump,
        payer = authority,
        space= size_of::<CommentAccount>() + TEXT_LENGTH + USER_NAME_LENGTH + USER_URL_LENGTH,
    )]

    pub comment: Account<'info, CommentAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: UncheckedAccount<'info>,


    //constraint means -- if this smart contract is init'd with USDC, any user that wants to create a post
    // has to do so with USDC. Therefore use this to create exclusivity or not.
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, token::Token>,

    pub clock: Sysvar<'info, Clock>

}

// StateAccount
#[account]
pub struct StateAccount {
    pub authority: Pubkey,
    pub post_count: u64
}

//Post Account
#[account]
pub struct PostAccount {
    pub authority: Pubkey,
    pub text: String,
    pub poster_name: String,
    pub poster_url: String,
    pub comment_count: u64,
    pub index: u64,
    pub post_time: i64,
}

#[account]
pub struct CommentAccount {
    pub authority: Pubkey,
    pub index: u64,
    pub text: String,
    pub commenter_name: String,
    pub commenter_url: String,
    pub comment_time: i64,

}

