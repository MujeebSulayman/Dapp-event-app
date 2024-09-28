const hre = require("hardhat");

async function main() {
  const servicePct = 5;

  const DappEventX = await hre.ethers.getContractFactory("DappEventX");
  const dappEventX = await DappEventX.deploy(servicePct);

  await dappEventX.waitForDeployment();

  console.log("DappEventX deployed to:", await dappEventX.getAddress());

  // Save the contract address
  const fs = require('fs');
  const contractAddresses = {
    dappEventXContract: await dappEventX.getAddress(),
  };

  fs.writeFileSync(
    './contracts/contractAddress.json',
    JSON.stringify(contractAddresses, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
