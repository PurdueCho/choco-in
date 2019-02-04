const CryptoJS = require("crypto-js");

class Block {
    constructor(index, hash, previousHash, timestamp, data) { 
        this.index = index;
        this.hash = hash;   // SHA256
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}
/* Genesis Block */
const genesisBlock = new Block(
    0,
    'C56DFBDF936F2F0D6B028D1F644CAC1CB3C23E371805F584627F22339A15F0FA',
    null,
    1549230247982,
    "ChoChoco-in!!",
);
let blockchain = [genesisBlock];

/* helper function */
const getLastBlock = () => blockchain[blockchain.length -1];
const getTimestamp = () => new Date().getTime() / 1000;
const createHash = (index, previousHash, timestamp, data) => 
    CryptoJS.SHA256(
        index + previousHash + timestamp + JSON.stringify(data)
    ).toString();
const getBlockHash = (block) => createHash(block.index, block.previousHash, block.timestamp, block.data);

/* Create new block */
const createNewBlock = data => {
    const previousBlock = getLastBlock();
    const newBlockIndex = previousBlock.index + 1;
    const newTimestamp = getTimestamp();
    const newHash = createHash(         // New Hash generating
        newBlockIndex,
        previousBlock.hash,
        newTimestamp,
        data
    );
    const newBlock = new Block (
        newBlockIndex,
        newHash,
        previousBlock.hash,
        newTimestamp,
        data
    );
    return newBlock;
}
/* Block validation check */
/* Block Hash and Index check */
const isNewBlockValid = (candidateBlock, latestBlock) => {
    if (!isNewStructureValid(candidateBlock)) {
        console.log("The candidate block structure is not valid");
        return false;
    } else if(latestBlock.index + 1 !== candidateBlock.index) {
        console.log("The candidate block doesn't have a valid index.");
        return false;
    } else if (latestBlock.hash !== candidateBlock.previousHash) {
        console.log("The previousHash of the candidate block is not the hash of the latest block.");
        return false;
    } else if (getBlockHash(candidateBlock) !== candidateBlock.hash) {
        console.log("The hash of this block is invalid");
        return false;
    }
    return true;
}
/* Block structure check */
const isNewStructureValid = (block) => {
    return (
        typeof block.index === "number" &&
         typeof block.hash === "string" &&
         typeof block.previousHash === "string" &&
         typeof block.timestamp === "number" &&
         typeof block.data === "string"
    )
}
/* Chain validation check */
const isChainValid = (candidateChain) => {
    const isGenesisValid = block => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isGenesisValid(candidateChain[0])) {
        console.log("The candidate chain's genesis block is not the same as our genesis block.");
        return false;
    }
    for (let i=1; i<candidateChain.length; i++) {
        if (!isNewBlockValid(candidateChain[i], candidateChain[i-1])) {
            return false;
        }
    }
    return true;
}
/* replacing chain to longer chain */
const replaceChain = newChain => {
    if (isChainValid(newChain) && newChain.length > blockchain.length) {
        blockchain = newChain;
    }
}
console.log(blockchain);