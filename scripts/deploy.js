require('dotenv').config()
const { ethers } = require('hardhat')

async function main() {
  console.log('Starting deployment process...')

  try {
    const [deployer] = await ethers.getSigners()
    console.log('Deploying contracts with the account:', deployer.address)

    console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString())

    const DappEventX = await ethers.getContractFactory('DappEventX')
    console.log('Deploying DappEventX...')
    const dappEventX = await DappEventX.deploy(5) // Assuming 5 is the servicePct

    await dappEventX.waitForDeployment()

    console.log('DappEventX deployed to:', await dappEventX.getAddress())

    // Save the contract address
    const fs = require('fs')
    const contractsDir = __dirname + '/../contracts'

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir)
    }

    fs.writeFileSync(
      contractsDir + '/contractAddress.json',
      JSON.stringify({ DappEventX: await dappEventX.getAddress() }, undefined, 2)
    )

    console.log('Contract address saved to contractAddress.json')
  } catch (error) {
    console.error('Error in deployment process:', error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
