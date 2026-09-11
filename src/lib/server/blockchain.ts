import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0xa34C7D37BB2bf41f73e562075878E86eFc7Ed05B';
export const EXPLORER_BASE_URL = 'https://sepolia.etherscan.io';

const TEARRUBR_ABI = [
  'function owner() external view returns (address)',
  'function authorizedManufacturers(address) external view returns (bool)',
  'function registerProduct(string memory productId, string memory manufacturer) external',
  'function updateProductStatus(string memory productId, bool isAuthentic) external',
  'function verifyProduct(string memory productId) external view returns (bool isRegistered, bool isAuthentic, string memory manufacturer)',
  'function products(string memory) external view returns (string memory manufacturer, bool isRegistered, bool isAuthentic)',
  'event ProductRegistered(string productId, string manufacturer)',
  'event ProductStatusUpdated(string productId, bool isAuthentic)'
];

let provider: ethers.JsonRpcProvider | null = null;
let wallet: ethers.Wallet | null = null;
let contract: ethers.Contract | null = null;
let readContract: ethers.Contract | null = null;

function getBlockchainInstance() {
  if (!provider && RPC_URL) {
    provider = new ethers.JsonRpcProvider(RPC_URL);
  }

  if (!readContract && provider && CONTRACT_ADDRESS) {
    readContract = new ethers.Contract(CONTRACT_ADDRESS, TEARRUBR_ABI, provider);
  }

  if (!wallet && provider && PRIVATE_KEY) {
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  }

  if (!contract && wallet && CONTRACT_ADDRESS) {
    contract = new ethers.Contract(CONTRACT_ADDRESS, TEARRUBR_ABI, wallet);
  }

  return { provider, wallet, contract, readContract };
}

export function isBlockchainConfigured(): boolean {
  return Boolean(RPC_URL && PRIVATE_KEY && CONTRACT_ADDRESS);
}

export async function registerProductOnChain(
  productId: string,
  manufacturer: string
): Promise<{ txHash: string; blockNumber?: number }> {
  const { contract } = getBlockchainInstance();

  if (!contract) {
    throw new Error('Blockchain contract is not configured. Check RPC_URL, PRIVATE_KEY, and CONTRACT_ADDRESS in .env.');
  }

  console.log(`[Blockchain] Registering product ${productId} on-chain for manufacturer "${manufacturer}"...`);
  
  // Submit transaction
  const tx = await contract.registerProduct(productId, manufacturer);
  console.log(`[Blockchain] Tx sent: ${tx.hash}. Waiting for 1 confirmation...`);
  
  const receipt = await tx.wait(1);
  console.log(`[Blockchain] Confirmed in block ${receipt?.blockNumber}: ${tx.hash}`);

  return {
    txHash: tx.hash,
    blockNumber: receipt?.blockNumber
  };
}

export async function verifyProductOnChain(productId: string): Promise<{
  isRegistered: boolean;
  isAuthentic: boolean;
  manufacturer: string;
  onChain: boolean;
}> {
  try {
    const { readContract } = getBlockchainInstance();
    if (!readContract) {
      return { isRegistered: false, isAuthentic: false, manufacturer: '', onChain: false };
    }

    const [isRegistered, isAuthentic, manufacturer] = await readContract.verifyProduct(productId);
    return {
      isRegistered: Boolean(isRegistered),
      isAuthentic: Boolean(isAuthentic),
      manufacturer: manufacturer || '',
      onChain: true
    };
  } catch (error) {
    console.warn(`[Blockchain] Error querying on-chain record for ${productId}:`, error);
    return {
      isRegistered: false,
      isAuthentic: false,
      manufacturer: '',
      onChain: false
    };
  }
}

export async function getLiveBlockchainStatus(): Promise<{
  isConfigured: boolean;
  network: string;
  chainId: number;
  blockNumber: number;
  contractAddress: string;
  contractOwner: string;
  explorerUrl: string;
}> {
  const { provider, readContract } = getBlockchainInstance();
  let blockNumber = 0;
  let contractOwner = '';

  if (provider) {
    try {
      blockNumber = await provider.getBlockNumber();
    } catch (e) {
      console.warn('[Blockchain] Failed to get block number:', e);
    }
  }

  if (readContract) {
    try {
      contractOwner = await readContract.owner();
    } catch (e) {
      console.warn('[Blockchain] Failed to get contract owner:', e);
    }
  }

  return {
    isConfigured: isBlockchainConfigured(),
    network: 'Ethereum Sepolia',
    chainId: 11155111,
    blockNumber,
    contractAddress: CONTRACT_ADDRESS,
    contractOwner,
    explorerUrl: EXPLORER_BASE_URL
  };
}

export async function checkAddressAuthorization(addressOrEns: string): Promise<{
  address: string;
  ensName: string | null;
  isOwner: boolean;
  isAuthorized: boolean;
  isVerifiedManufacturer: boolean;
}> {
  const { provider, readContract } = getBlockchainInstance();
  let resolvedAddress = addressOrEns.trim();
  let ensName: string | null = null;
  let isOwner = false;
  let isAuthorized = false;

  if (provider) {
    try {
      if (resolvedAddress.includes('.')) {
        const resolved = await provider.resolveName(resolvedAddress);
        if (resolved) {
          ensName = resolvedAddress;
          resolvedAddress = resolved;
        }
      } else if (ethers.isAddress(resolvedAddress)) {
        ensName = await provider.lookupAddress(resolvedAddress);
      }
    } catch (e) {
      // ENS lookup or resolution error
    }
  }

  if (readContract && ethers.isAddress(resolvedAddress)) {
    try {
      const owner = await readContract.owner();
      isOwner = owner.toLowerCase() === resolvedAddress.toLowerCase();
      isAuthorized = await readContract.authorizedManufacturers(resolvedAddress);
    } catch (e) {
      console.warn('[Blockchain] Error checking authorization on-chain:', e);
    }
  }

  return {
    address: resolvedAddress,
    ensName,
    isOwner,
    isAuthorized,
    isVerifiedManufacturer: isOwner || isAuthorized
  };
}

