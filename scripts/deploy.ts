import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const TearRubr = await ethers.getContractFactory("TearRubr");
  const tearRubr = await TearRubr.deploy();

  await tearRubr.waitForDeployment();
  const address = await tearRubr.getAddress();

  console.log("TearRubr deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
