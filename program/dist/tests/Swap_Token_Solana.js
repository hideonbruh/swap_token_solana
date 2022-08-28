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
var lamports = 0;
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
    var userTransferAuthority = anchor.web3.Keypair.generate();
    var addTokenA = anchor.web3.Keypair.generate();
    var addTokenB = anchor.web3.Keypair.generate();
    var poolWallet = anchor.web3.Keypair.generate();
    // AssociatedTokenAccount for anchor's workspace wallet
    var associatedTokenAccountTokenA = undefined;
    var associatedTokenAccountTokenB = undefined;
    var associatedTokenAccountTokenAToMintPool = undefined;
    it("Mint a token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var owner, ownerKey, mint_tx, mint_tx2, res, res2, minted, minted2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    owner = anchor.AnchorProvider.env().wallet;
                    ownerKey = owner.publicKey;
                    console.log("Onwer public key:" + ownerKey);
                    return [4 /*yield*/, program.provider.connection.getMinimumBalanceForRentExemption(spl_token_1.MINT_SIZE)];
                case 1:
                    // Get the amount of SOL needed to pay rent for our Token Mint
                    lamports = _a.sent();
                    console.log("MINT_SIZE: " + spl_token_1.MINT_SIZE);
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(addTokenA.publicKey, ownerKey)];
                case 2:
                    // Get the ATA for a token and the account that we want to own the ATA (but it might not existing on the SOL network yet)
                    associatedTokenAccountTokenA = _a.sent();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(addTokenB.publicKey, ownerKey)];
                case 3:
                    // associatedTokenAccountTokenA = await createAssociatedTokenAccountI(owner, owner, addTokenA)
                    // associatedTokenAccountTokenB = await createAssociatedTokenAccountI(owner, owner, addTokenA)
                    associatedTokenAccountTokenB = _a.sent();
                    mint_tx = new anchor.web3.Transaction().add(
                    // Use anchor to create an account from the mint key that we created
                    anchor.web3.SystemProgram.createAccount({
                        fromPubkey: ownerKey,
                        newAccountPubkey: addTokenA.publicKey,
                        space: spl_token_1.MINT_SIZE,
                        programId: spl_token_1.TOKEN_PROGRAM_ID,
                        lamports: lamports,
                    }), 
                    // Fire a transaction to create our mint account that is controlled by our anchor wallet
                    (0, spl_token_1.createInitializeMintInstruction)(addTokenA.publicKey, 0, ownerKey, ownerKey), 
                    // Create the ATA account that is associated with our mint on our anchor wallet
                    (0, spl_token_1.createAssociatedTokenAccountInstruction)(ownerKey, associatedTokenAccountTokenA, ownerKey, addTokenA.publicKey));
                    mint_tx2 = new anchor.web3.Transaction().add(
                    // Use anchor to create an account from the mint key that we created
                    anchor.web3.SystemProgram.createAccount({
                        fromPubkey: ownerKey,
                        newAccountPubkey: addTokenB.publicKey,
                        space: spl_token_1.MINT_SIZE,
                        programId: spl_token_1.TOKEN_PROGRAM_ID,
                        lamports: lamports,
                    }), 
                    // Fire a transaction to create our mint account that is controlled by our anchor wallet
                    (0, spl_token_1.createInitializeMintInstruction)(addTokenB.publicKey, 0, ownerKey, ownerKey), 
                    // Create the ATA account that is associated with our mint on our anchor wallet
                    (0, spl_token_1.createAssociatedTokenAccountInstruction)(ownerKey, associatedTokenAccountTokenB, ownerKey, addTokenB.publicKey));
                    console.log("TOKEN_PROGRAM_ID: " + spl_token_1.TOKEN_PROGRAM_ID);
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [addTokenA])];
                case 4:
                    res = _a.sent();
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(mint_tx2, [addTokenB])];
                case 5:
                    res2 = _a.sent();
                    // console.log("Account: ", res);
                    // console.log("Token key: ", addTokenA.publicKey.toString());
                    // console.log("User: ", ownerKey.toString());
                    // Executes our code to mint our token into our specified ATA
                    return [4 /*yield*/, program.methods.mintToken(new BN(1500)).accounts({
                            mint: addTokenA.publicKey,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            tokenAccount: associatedTokenAccountTokenA,
                            authority: ownerKey,
                        }).rpc()];
                case 6:
                    // console.log("Account: ", res);
                    // console.log("Token key: ", addTokenA.publicKey.toString());
                    // console.log("User: ", ownerKey.toString());
                    // Executes our code to mint our token into our specified ATA
                    _a.sent();
                    return [4 /*yield*/, program.methods.mintToken(new BN(1500)).accounts({
                            mint: addTokenB.publicKey,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            tokenAccount: associatedTokenAccountTokenB,
                            authority: ownerKey,
                        }).rpc()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(associatedTokenAccountTokenA)];
                case 8:
                    minted = (_a.sent()).value.data['parsed']['info']['tokenAmount']['amount'];
                    chai_1.assert.equal(minted, 1500);
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(associatedTokenAccountTokenA)];
                case 9:
                    minted2 = (_a.sent()).value.data['parsed']['info']['tokenAmount']['amount'];
                    chai_1.assert.equal(minted2, 1500);
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
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(addTokenA.publicKey, toWallet.publicKey)];
                case 1:
                    toATA = _a.sent();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(addTokenA.publicKey, otherUser.publicKey)];
                case 2:
                    toATAOtherUser = _a.sent();
                    mint_tx = new anchor.web3.Transaction().add(
                    // Create the ATA account that is associated with our To wallet
                    (0, spl_token_1.createAssociatedTokenAccountInstruction)(myWallet, toATA, toWallet.publicKey, addTokenA.publicKey));
                    // Sends and create the transaction
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [])];
                case 3:
                    // Sends and create the transaction
                    _a.sent();
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add(
                        // Create the ATA account that is associated with our To wallet
                        (0, spl_token_1.createAssociatedTokenAccountInstruction)(myWallet, toATAOtherUser, otherUser.publicKey, addTokenA.publicKey)), [])];
                case 4:
                    _a.sent();
                    accountObject = {
                        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                        from: associatedTokenAccountTokenA,
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
                            from: associatedTokenAccountTokenA,
                            fromAuthority: myWallet,
                            to: toATAOtherUser,
                        }).rpc()];
                case 6:
                    // console.log("getAssociatedTokenAddress: " + toATAOtherUser)
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(associatedTokenAccountTokenA)];
                case 7:
                    minted = (_a.sent()).value.data;
                    // console.log(minted)
                    chai_1.assert.equal(minted['parsed']['info']['tokenAmount']['amount'], 1440);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Swap Token Solana", function () { return __awaiter(void 0, void 0, void 0, function () {
        var myWallet, ownerKey, otherWallet, connection, payer, lamports, rqAirdrop, balanceOtherWallet, rqAirdropPool, balancePool, tokenATAPoolTokenA, tokenATAPoolTokenB, _bf_minted, otherUserATATokenA, otherUserATATokenB, mintedOtherA, minted, minted2, minted3, minted4, rsOtherWalletTokenA, rsOtherWalletTokenB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myWallet = anchor.AnchorProvider.env().wallet;
                    ownerKey = myWallet.publicKey;
                    otherWallet = anchor.web3.Keypair.generate();
                    connection = program.provider.connection;
                    payer = anchor.web3.Keypair.generate();
                    // Wallet that will receive the token 
                    console.log("Admin public key:" + myWallet.publicKey);
                    return [4 /*yield*/, program.provider.connection.getMinimumBalanceForRentExemption(spl_token_1.MINT_SIZE)];
                case 1:
                    lamports = _a.sent();
                    return [4 /*yield*/, program.provider.connection.requestAirdrop(otherWallet.publicKey, 100000000)
                        // await anchor.AnchorProvider.env().sendAndConfirm(rqAirdrop)
                    ];
                case 2:
                    rqAirdrop = _a.sent();
                    // await anchor.AnchorProvider.env().sendAndConfirm(rqAirdrop)
                    return [4 /*yield*/, program.provider.connection.confirmTransaction(rqAirdrop)];
                case 3:
                    // await anchor.AnchorProvider.env().sendAndConfirm(rqAirdrop)
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getBalance(otherWallet.publicKey)];
                case 4:
                    balanceOtherWallet = _a.sent();
                    console.log("balanceOtherWallet: " + balanceOtherWallet);
                    return [4 /*yield*/, program.provider.connection.requestAirdrop(poolWallet.publicKey, 100000000)];
                case 5:
                    rqAirdropPool = _a.sent();
                    return [4 /*yield*/, program.provider.connection.confirmTransaction(rqAirdropPool)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getBalance(poolWallet.publicKey)];
                case 7:
                    balancePool = _a.sent();
                    console.log("balancePool: " + balancePool);
                    return [4 /*yield*/, createAssociatedTokenAccountInstr(myWallet, poolWallet, addTokenA)];
                case 8:
                    tokenATAPoolTokenA = _a.sent();
                    return [4 /*yield*/, createAssociatedTokenAccountInstr(myWallet, poolWallet, addTokenB)];
                case 9:
                    tokenATAPoolTokenB = _a.sent();
                    return [4 /*yield*/, program.methods.transferToken(new BN(1000)).accounts({
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            from: associatedTokenAccountTokenA,
                            fromAuthority: myWallet.publicKey,
                            to: tokenATAPoolTokenA,
                        }).rpc()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(tokenATAPoolTokenA)];
                case 11:
                    _bf_minted = (_a.sent()).value.data;
                    console.log("Before Pool Token A: " + _bf_minted['parsed']['info']['tokenAmount']['amount']);
                    return [4 /*yield*/, program.methods.transferToken(new BN(1000)).accounts({
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            from: associatedTokenAccountTokenB,
                            fromAuthority: myWallet.publicKey,
                            to: tokenATAPoolTokenB,
                        }).rpc()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, createAssociatedTokenAccountInstr(myWallet, otherWallet, addTokenA)];
                case 13:
                    otherUserATATokenA = _a.sent();
                    return [4 /*yield*/, createAssociatedTokenAccountInstr(myWallet, otherWallet, addTokenB)];
                case 14:
                    otherUserATATokenB = _a.sent();
                    return [4 /*yield*/, program.methods.transferToken(new BN(50)).accounts({
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            from: associatedTokenAccountTokenA,
                            fromAuthority: myWallet.publicKey,
                            to: otherUserATATokenA,
                        }).rpc()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, program.methods.transferToken(new BN(5)).accounts({
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            from: tokenATAPoolTokenA,
                            fromAuthority: poolWallet.publicKey,
                            to: associatedTokenAccountTokenA,
                        }).signers([poolWallet]).rpc()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(tokenATAPoolTokenA)];
                case 17:
                    mintedOtherA = (_a.sent()).value.data;
                    console.log("otherUserToken Token A: " + mintedOtherA['parsed']['info']['tokenAmount']['amount']);
                    console.log("After transfer from pool A to otherUser");
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(tokenATAPoolTokenA)];
                case 18:
                    minted = (_a.sent()).value.data;
                    console.log("Pool Token A: " + minted['parsed']['info']['tokenAmount']['amount']);
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(tokenATAPoolTokenB)];
                case 19:
                    minted2 = (_a.sent()).value.data;
                    console.log("Pool Token B: " + minted2['parsed']['info']['tokenAmount']['amount']);
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(otherUserATATokenA)];
                case 20:
                    minted3 = (_a.sent()).value.data;
                    console.log("Balance Token A of otherWallet: " + minted3['parsed']['info']['tokenAmount']['amount']);
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(otherUserATATokenB)];
                case 21:
                    minted4 = (_a.sent()).value.data;
                    console.log("Balance Token B of otherWallet: " + minted4['parsed']['info']['tokenAmount']['amount']);
                    return [4 /*yield*/, program.methods.swapToken(new BN(5)).accounts({
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            ataPoolTokenA: tokenATAPoolTokenA,
                            ataPoolTokenB: tokenATAPoolTokenB,
                            ataSourceUserA: otherUserATATokenA,
                            ataSourceUserB: otherUserATATokenB,
                            fromAuthority: otherWallet.publicKey,
                            authority: poolWallet.publicKey
                        }).signers([otherWallet, poolWallet]).rpc()];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(otherUserATATokenA)];
                case 23:
                    rsOtherWalletTokenA = (_a.sent()).value.data;
                    console.log("otherUserToken Token A: " + rsOtherWalletTokenA['parsed']['info']['tokenAmount']['amount']);
                    return [4 /*yield*/, program.provider.connection.getParsedAccountInfo(otherUserATATokenB)];
                case 24:
                    rsOtherWalletTokenB = (_a.sent()).value.data;
                    console.log("otherUserToken Token B: " + rsOtherWalletTokenB['parsed']['info']['tokenAmount']['amount']);
                    return [2 /*return*/];
            }
        });
    }); });
});
function createAssociatedTokenAccountInstr(owner, user, token) {
    return __awaiter(this, void 0, void 0, function () {
        var associatedToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(token.publicKey, user.publicKey)];
                case 1:
                    associatedToken = _a.sent();
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(new anchor.web3.Transaction().add((0, spl_token_1.createAssociatedTokenAccountInstruction)(owner.publicKey, associatedToken, user.publicKey, token.publicKey)), [])];
                case 2:
                    _a.sent();
                    return [2 /*return*/, associatedToken];
            }
        });
    });
}
function mintInstruction(owner, token, lamports) {
    return __awaiter(this, void 0, void 0, function () {
        var associatedTokenAccount, mint_tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(token.publicKey, owner.publicKey)];
                case 1:
                    associatedTokenAccount = _a.sent();
                    mint_tx = new anchor.web3.Transaction().add(anchor.web3.SystemProgram.createAccount({
                        fromPubkey: owner.publicKey,
                        newAccountPubkey: token.publicKey,
                        space: spl_token_1.MINT_SIZE,
                        programId: spl_token_1.TOKEN_PROGRAM_ID,
                        lamports: lamports,
                    }), (0, spl_token_1.createInitializeMintInstruction)(token.publicKey, 0, owner.publicKey, owner.publicKey), (0, spl_token_1.createAssociatedTokenAccountInstruction)(owner.publicKey, associatedTokenAccount, owner.publicKey, token.publicKey));
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [token.publicKey])];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
