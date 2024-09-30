require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    sepolia: {
      url: process.env.SEPOLIA_URL, // Add this line
      accounts: [process.env.PRIVATE_KEY], // Add this line
    },
    bitfinity: {
      url: process.env.BITFINITY_URL,
      accounts: [process.env.BITFINITY_PRIVATE_KEY], // Ensure this key is 32 bytes (64 characters) long
    },
    // ... other networks ...
  },
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 40000,
  },
}
