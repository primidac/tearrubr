import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error("Missing BLOCKCHAIN_RPC_URL or PRIVATE_KEY in .env");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Deploying TearRubr with account:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const artifactPath = path.resolve("./artifacts/contracts/TearRubr.sol/TearRubr.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log("Broadcasting deployment transaction to Sepolia...");
  const contract = await factory.deploy();
  console.log("Deployment tx hash:", contract.deploymentTransaction()?.hash);

  console.log("Waiting for block confirmation...");
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("==================================================");
  console.log("TearRubr deployed successfully to:", address);
  console.log("==================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
