// Get private stuff from my .env file

var my_privkey = new Buffer('569e69d654f56f3a7db19c04ca1c71c89eacedebfd3f2ac13dbd96b5806e4d87', 'hex')
// Need access to my path and file system
// import path from 'path'
const path = require("path");
var fs = require('fs');

// Ethereum javascript libraries needed
// import Web3 from 'Web3'
var Web3 = require('Web3');
var Tx = require('ethereumjs-tx');

// Rather than using a local copy of geth, interact with the ethereum blockchain via infura.io
const  web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.0.110:8545"));

// Create an async function so I can use the "await" keyword to wait for things to finish
const main = async (add,val) => {
  // console.log(add,val)
  // This code was written and tested using web3 version 1.0.0-beta.26
  // console.log(`web3 版本: ${web3.version}`)
  var destAddress = '';
  if(add){
    destAddress = add
  }else{
    throw '打币地址为空';
    destAddress = "0xFdE0B71a0FB3325f5242E2E7e056F9Df6B3cdAcA"
  }
  // Who holds the token now?
  var myAddress = "0xc681398566305c3cd7d10e24e6e72Ec76e0Eb7EF";
  

  // If your token is divisible to 8 decimal places, 42 = 0.00000042 of your token
  
  var transferAmount = 0
  if(val){
    transferAmount = val
  }else{
    throw '输出值为0';
  }

  // Determine the nonce
  var count = await web3.eth.getTransactionCount(myAddress);
  console.log(`到目前为止的交易: ${count}`);

  // This file is just JSON stolen from the contract page on etherscan.io under "Contract ABI"
  var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './tt3.json'), 'utf-8'));

  // This is the address of the contract which created the ERC20 token
  var contractAddress = "0x2e9bb7b8eBfDEcC27B891A01c6eb3a6E917Bbc15";
  var contract = new web3.eth.Contract(abiArray, contractAddress, { from: myAddress });

  // How many tokens do I have before sending?
  var balance = await contract.methods.balanceOf(myAddress).call();

  console.log(`发送之前的token余额: ${balance/Math.pow(10,18)}`);
  console.log(`发送的token数量: ${transferAmount/Math.pow(10,18)}`);
  // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
  var rawTransaction = {
      "from": myAddress,
      "nonce": "0x" + count.toString(16),
      "gasPrice": "0x003B9ACA00",
      "gasLimit": "0x250CA",
      "to": contractAddress,
      "value": "0x0",
      "data": contract.methods.transfer(destAddress, transferAmount).encodeABI()
  };

  // Example private key (do not use): 'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'
  // The private key must be for myAddress
  var privKey = new Buffer(my_privkey, 'hex');
  var tx = new Tx(rawTransaction);
  tx.sign(privKey);
  var serializedTx = tx.serialize();

  // Comment out these three lines if you don't really want to send the TX right now
  console.log(`发送的签名:  ${serializedTx.toString('hex')}`);
  var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  console.log(`交易打包成功！`)
  console.log(`交易信息:  ${JSON.stringify(receipt, null, '\t')}`);

  // The balance may not be updated yet, but let's check
  balance = await contract.methods.balanceOf(myAddress).call();
  console.log(`发送之后Token的余额: ${balance/Math.pow(10,18)}`);
}

exports = module.exports = main;

