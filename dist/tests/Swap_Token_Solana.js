"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var anchor = __importStar(require("@project-serum/anchor"));
var spl_token_1 = require("@solana/spl-token");
var chai_1 = require("chai");
var BN = anchor.BN;
describe("Test Mint Token Solana", function () {
    // Configure the client to use the local cluster.
    var provider = anchor.AnchorProvider.env();
    console.log("Provider: " + provider.wallet.publicKey);
    anchor.setProvider(anchor.AnchorProvider.env());
    // Retrieve the TokenContract struct from our smart contract
    var program = anchor.workspace.SwapTokenSolana;
    // Generate a random keypair that will represent our token
    var arrTokenKey = [];
    var otherUser = anchor.web3.Keypair.generate();
    var mintPool = anchor.web3.Keypair.generate();
    var tokenKey = anchor.web3.Keypair.generate();
    var tokenKey2 = anchor.web3.Keypair.generate();
    // AssociatedTokenAccount for anchor's workspace wallet
    var associatedTokenAccount = undefined;
    var associatedTokenAccount2 = undefined;
    var associatedTokenAccountToMintPool = undefined;
    it("Mint a token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var owner, ownerKey, lamports, mint_tx, mint_tx2, res, res2, minted, minted2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    owner = anchor.AnchorProvider.env().wallet;
                    ownerKey = owner.publicKey;
                    console.log("Onwer public key:" + ownerKey);
                    return [4 /*yield*/, program.provider.connection.getMinimumBalanceForRentExemption(spl_token_1.MINT_SIZE)];
                case 1:
                    lamports = _a.sent();
                    console.log("MINT_SIZE: " + spl_token_1.MINT_SIZE);
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(tokenKey.publicKey, ownerKey)];
                case 2:
                    // Get the ATA for a token and the account that we want to own the ATA (but it might not existing on the SOL network yet)
                    associatedTokenAccount = _a.sent();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(tokenKey2.publicKey, ownerKey)];
                case 3:
                    // associatedTokenAccount = await createATATokenAndSign(owner, owner, tokenKey)
                    // associatedTokenAccount2 = await createATATokenAndSign(owner, owner, tokenKey)
                    associatedTokenAccount2 = _a.sent();
                    console.log("Token KEY 1: " + tokenKey.publicKey);
                    mint_tx = new anchor.web3.Transaction().add(
                    // Use anchor to create an account from the mint key that we created
                    anchor.web3.SystemProgram.createAccount({
                        fromPubkey: ownerKey,
                        newAccountPubkey: tokenKey.publicKey,
                        space: spl_token_1.MINT_SIZE,
                        programId: spl_token_1.TOKEN_PROGRAM_ID,
                        lamports: lamports,
                    }), 
                    // Fire a transaction to create our mint account that is controlled by our anchor wallet
                    (0, spl_token_1.createInitializeMintInstruction)(tokenKey.publicKey, 0, ownerKey, ownerKey), 
                    // Create the ATA account that is associated with our mint on our anchor wallet
                    (0, spl_token_1.createAssociatedTokenAccountInstruction)(ownerKey, associatedTokenAccount, ownerKey, tokenKey.publicKey));
                    mint_tx2 = new anchor.web3.Transaction().add(
                    // Use anchor to create an account from the mint key that we created
                    anchor.web3.SystemProgram.createAccount({
                        fromPubkey: ownerKey,
                        newAccountPubkey: tokenKey2.publicKey,
                        space: spl_token_1.MINT_SIZE,
                        programId: spl_token_1.TOKEN_PROGRAM_ID,
                        lamports: lamports,
                    }), 
                    // Fire a transaction to create our mint account that is controlled by our anchor wallet
                    (0, spl_token_1.createInitializeMintInstruction)(tokenKey2.publicKey, 0, ownerKey, ownerKey), 
                    // Create the ATA account that is associated with our mint on our anchor wallet
                    (0, spl_token_1.createAssociatedTokenAccountInstruction)(ownerKey, associatedTokenAccount2, ownerKey, tokenKey2.publicKey));
                    console.log("TOKEN_PROGRAM_ID: " + spl_token_1.TOKEN_PROGRAM_ID);
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [tokenKey])];
                case 4:
                    res = _a.sent();
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(mint_tx2, [tokenKey2])];
                case 5:
                    res2 = _a.sent();
                    // console.log("Account: ", res);
                    // console.log("Token key: ", tokenKey.publicKey.toString());
                    // console.log("User: ", ownerKey.toString());
                    // Executes our code to mint our token into our specified ATA
                    return [4 /*yield*/, program.methods.mintToken(new BN(1000)).accounts({
                            mint: tokenKey.publicKey,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            tokenAccount: associatedTokenAccount,
                            authority: ownerKey,
                        }).rpc()];
                case 6:
                    // console.log("Account: ", res);
                    // console.log("Token key: ", tokenKey.publicKey.toString());
                    // console.log("User: ", ownerKey.toString());
                    // Executes our code to mint our token into our specified ATA
                    _a.sent();
                    return [4 /*yield*/, program.methods.mintToken(new BN(1000)).accounts({
                            mint: tokenKey2.publicKey,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            tokenAccount: associatedTokenAccount2,
                            authority: ownerKey,
                        }).rpc()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(associatedTokenAccount)];
                case 8:
                    minted = (_a.sent()).value.data['parsed']['info']['tokenAmount']['amount'];
                    chai_1.assert.equal(minted, 1000);
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(associatedTokenAccount)];
                case 9:
                    minted2 = (_a.sent()).value.data['parsed']['info']['tokenAmount']['amount'];
                    chai_1.assert.equal(minted2, 1000);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Transfer token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var myWallet, toWallet, toATA, toATAOtherUser, mint_tx, accountObject, minted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myWallet = anchor.AnchorProvider.env().wallet.publicKey;
                    toWallet = anchor.web3.Keypair.generate();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(tokenKey.publicKey, toWallet.publicKey)];
                case 1:
                    toATA = _a.sent();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(tokenKey.publicKey, otherUser.publicKey)];
                case 2:
                    toATAOtherUser = _a.sent();
                    mint_tx = new anchor.web3.Transaction().add(
                    // Create the ATA account that is associated with our To wallet
                    (0, spl_token_1.createAssociatedTokenAccountInstruction)(myWallet, toATA, toWallet.publicKey, tokenKey.publicKey));
                    // Sends and create the transaction
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [])];
                case 3:
                    // Sends and create the transaction
                    _a.sent();
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
                        // Create the ATA account that is associated with our To wallet
                        (0, spl_token_1.createAssociatedTokenAccountInstruction)(myWallet, toATAOtherUser, otherUser.publicKey, tokenKey.publicKey)), [])];
                case 4:
                    _a.sent();
                    accountObject = {
                        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                        from: associatedTokenAccount,
                        fromAuthority: myWallet,
                        to: toATA,
                    };
                    // console.log(accountObject)
                    return [4 /*yield*/, program.methods.transferToken(new BN(10)).accounts(accountObject).rpc()];
                case 5:
                    // console.log(accountObject)
                    _a.sent();
                    // console.log("getAssociatedTokenAddress: " + toATAOtherUser)
                    return [4 /*yield*/, program.methods.transferToken(new BN(50)).accounts({
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            from: associatedTokenAccount,
                            fromAuthority: myWallet,
                            to: toATAOtherUser,
                        }).rpc()];
                case 6:
                    // console.log("getAssociatedTokenAddress: " + toATAOtherUser)
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(associatedTokenAccount)];
                case 7:
                    minted = (_a.sent()).value.data;
                    // console.log(minted)
                    chai_1.assert.equal(minted['parsed']['info']['tokenAmount']['amount'], 940);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Swap Token Solana", function () { return __awaiter(void 0, void 0, void 0, function () {
        var myWallet, ownerKey, poolWallet, otherWallet, lamports, tokenPoolToken1, tokenPoolToken2, _bf_minted, otherUserATATokenA, mintedOtherA, minted, minted2, minted3, toATAOtherUser1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myWallet = anchor.AnchorProvider.env().wallet;
                    ownerKey = myWallet.publicKey;
                    poolWallet = anchor.web3.Keypair.generate();
                    otherWallet = anchor.web3.Keypair.generate();
                    console.log("Admin public key:" + myWallet.publicKey);
                    return [4 /*yield*/, program.provider.connection.getMinimumBalanceForRentExemption(spl_token_1.MINT_SIZE)];
                case 1:
                    lamports = _a.sent();
                    return [4 /*yield*/, createATATokenAndSign(myWallet, poolWallet, tokenKey)];
                case 2:
                    tokenPoolToken1 = _a.sent();
                    return [4 /*yield*/, createATATokenAndSign(myWallet, poolWallet, tokenKey2)];
                case 3:
                    tokenPoolToken2 = _a.sent();
                    return [4 /*yield*/, program.methods.transferToken(new BN(150)).accounts({
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            from: associatedTokenAccount,
                            fromAuthority: myWallet.publicKey,
                            to: tokenPoolToken1,
                        }).rpc()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(tokenPoolToken1)];
                case 5:
                    _bf_minted = (_a.sent()).value.data;
                    console.log("Pool Token A: " + _bf_minted['parsed']['info']['tokenAmount']['amount']);
                    return [4 /*yield*/, program.methods.transferToken(new BN(100)).accounts({
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            from: associatedTokenAccount2,
                            fromAuthority: myWallet.publicKey,
                            to: tokenPoolToken2,
                        }).rpc()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, createATATokenAndSign(myWallet, otherWallet, tokenKey)
                        // let a = await anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
                        // createApproveInstruction(tokenKey.publicKey, poolWallet.publicKey, ownerKey, 1000, [], TOKEN_PROGRAM_ID)
                        // ), []);
                        // await myWallet.signTransaction(new anchor.web3.Transaction().add(
                        //   createApproveInstruction(tokenKey.publicKey, poolWallet.publicKey, ownerKey, 1000, [], TOKEN_PROGRAM_ID)
                        // ))
                        // let approve =await anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
                        //   createApproveInstruction(tokenPoolToken1, associatedTokenAccount, ownerKey, 1000, [], TOKEN_PROGRAM_ID)
                        // ), []);
                        // console.log(approve)
                        // let a = await program.methods.approveToken(new BN(10)).accounts(
                        //   {
                        //     tokenProgram: TOKEN_PROGRAM_ID,
                        //     to: tokenPoolToken1,
                        //     delegate: associatedTokenAccount,
                        //     authority: ownerKey,
                        //   }
                        // ).rpc();
                        // console.log(a)
                        // console.log("Approve !")
                    ];
                case 7:
                    otherUserATATokenA = _a.sent();
                    // let a = await anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
                    // createApproveInstruction(tokenKey.publicKey, poolWallet.publicKey, ownerKey, 1000, [], TOKEN_PROGRAM_ID)
                    // ), []);
                    // await myWallet.signTransaction(new anchor.web3.Transaction().add(
                    //   createApproveInstruction(tokenKey.publicKey, poolWallet.publicKey, ownerKey, 1000, [], TOKEN_PROGRAM_ID)
                    // ))
                    // let approve =await anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
                    //   createApproveInstruction(tokenPoolToken1, associatedTokenAccount, ownerKey, 1000, [], TOKEN_PROGRAM_ID)
                    // ), []);
                    // console.log(approve)
                    // let a = await program.methods.approveToken(new BN(10)).accounts(
                    //   {
                    //     tokenProgram: TOKEN_PROGRAM_ID,
                    //     to: tokenPoolToken1,
                    //     delegate: associatedTokenAccount,
                    //     authority: ownerKey,
                    //   }
                    // ).rpc();
                    // console.log(a)
                    // console.log("Approve !")
                    return [4 /*yield*/, program.methods.transferToken(new BN(50)).accounts({
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            from: tokenPoolToken1,
                            fromAuthority: myWallet.publicKey,
                            to: otherUserATATokenA,
                        }).rpc()];
                case 8:
                    // let a = await anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
                    // createApproveInstruction(tokenKey.publicKey, poolWallet.publicKey, ownerKey, 1000, [], TOKEN_PROGRAM_ID)
                    // ), []);
                    // await myWallet.signTransaction(new anchor.web3.Transaction().add(
                    //   createApproveInstruction(tokenKey.publicKey, poolWallet.publicKey, ownerKey, 1000, [], TOKEN_PROGRAM_ID)
                    // ))
                    // let approve =await anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
                    //   createApproveInstruction(tokenPoolToken1, associatedTokenAccount, ownerKey, 1000, [], TOKEN_PROGRAM_ID)
                    // ), []);
                    // console.log(approve)
                    // let a = await program.methods.approveToken(new BN(10)).accounts(
                    //   {
                    //     tokenProgram: TOKEN_PROGRAM_ID,
                    //     to: tokenPoolToken1,
                    //     delegate: associatedTokenAccount,
                    //     authority: ownerKey,
                    //   }
                    // ).rpc();
                    // console.log(a)
                    // console.log("Approve !")
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(tokenPoolToken1)];
                case 9:
                    mintedOtherA = (_a.sent()).value.data;
                    console.log("otherUserToken Token A: " + mintedOtherA['parsed']['info']['tokenAmount']['amount']);
                    console.log("After transfer from pool A to otherUser");
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(tokenPoolToken1)];
                case 10:
                    minted = (_a.sent()).value.data;
                    console.log("Pool Token A: " + minted['parsed']['info']['tokenAmount']['amount']);
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(tokenPoolToken2)];
                case 11:
                    minted2 = (_a.sent()).value.data;
                    console.log("Pool Token B: " + minted2['parsed']['info']['tokenAmount']['amount']);
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(otherUserATATokenA)];
                case 12:
                    minted3 = (_a.sent()).value.data;
                    console.log("Balance Token A of otherWallet: " + minted3['parsed']['info']['tokenAmount']['amount']);
                    return [4 /*yield*/, createATATokenAndSign(myWallet, otherWallet, tokenKey)
                        // const toATAOtherUser2 = await createATATokenAndSign(myWallet, otherWallet, tokenKey2)
                        // await program.methods.swapToken(new BN(5)).accounts({
                        //   tokenProgram: TOKEN_PROGRAM_ID,
                        //   ataPoolTokenA: tokenPoolToken1,
                        //   ataPoolTokenB: tokenPoolToken2,
                        //   ataSourceUserA: toATAOtherUser1,
                        //   ataSourceUserB: toATAOtherUser2,
                        //   fromAuthority: myWallet.publicKey,
                        // }).rpc();
                        // const minted4 = (await program.provider.connection.getParsedAccountInfo(tokenPoolToken1)).value.data;
                        // console.log("Pool Token A: " + minted4['parsed']['info']['tokenAmount']['amount']);
                    ];
                case 13:
                    toATAOtherUser1 = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
function createATATokenAndSign(owner, user, token) {
    return __awaiter(this, void 0, void 0, function () {
        var associatedToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(token.publicKey, user.publicKey)];
                case 1:
                    associatedToken = _a.sent();
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
                        // Create the ATA account that is associated with our To wallet
                        (0, spl_token_1.createAssociatedTokenAccountInstruction)(owner.publicKey, associatedToken, user.publicKey, token.publicKey)), [])];
                case 2:
                    _a.sent();
                    return [2 /*return*/, associatedToken];
            }
        });
    });
}
