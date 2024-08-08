/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
const fs = require('fs')
// const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789"

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 97
    },
    mumbai: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      accounts: ["371d8f22b9a617c04eef587602c3ddb268e1fbfebe7601e79665d7e5011cf117"]
    },
    ftm: {
      url: "https://rpc.testnet.fantom.network",
      accounts: ["371d8f22b9a617c04eef587602c3ddb268e1fbfebe7601e79665d7e5011cf117"]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}