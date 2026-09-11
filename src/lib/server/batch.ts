import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';

export interface BatchItem {
  id: string;
  serialNumber: string;
  serialIndex: number;
  leafHash: string;
}

export function sanitizePrefix(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'PROD';
}

export function sanitizeBatchNumber(batchNum: string): string {
  return batchNum.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'BATCH';
}

/**
 * Computes a standard Merkle Root from an array of leaf hashes.
 */
export function computeMerkleRoot(leaves: string[]): string {
  if (leaves.length === 0) {
    return ethers.keccak256(ethers.toUtf8Bytes('EMPTY_BATCH'));
  }

  let currentLevel: string[] = [...leaves];

  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        // Hash pairwise
        const combined = ethers.concat([
          ethers.getBytes(currentLevel[i]),
          ethers.getBytes(currentLevel[i + 1])
        ]);
        nextLevel.push(ethers.keccak256(combined));
      } else {
        // Odd leaf: pair with itself
        const combined = ethers.concat([
          ethers.getBytes(currentLevel[i]),
          ethers.getBytes(currentLevel[i])
        ]);
        nextLevel.push(ethers.keccak256(combined));
      }
    }
    currentLevel = nextLevel;
  }

  return currentLevel[0];
}

/**
 * Generates serialized product units and their Merkle cryptographic root.
 */
export function generateBatchItems(params: {
  productName: string;
  batchNumber: string;
  quantity: number;
  manufacturer: string;
}): { items: BatchItem[]; merkleRoot: string } {
  const { productName, batchNumber, quantity, manufacturer } = params;
  const prefix = sanitizePrefix(productName);
  const cleanBatch = sanitizeBatchNumber(batchNumber);
  const padLength = Math.max(4, String(quantity).length);

  const items: BatchItem[] = [];
  const leaves: string[] = [];

  for (let i = 0; i < quantity; i++) {
    const serialIndex = i + 1;
    const serialSuffix = String(serialIndex).padStart(padLength, '0');
    const serialNumber = `${prefix}-${cleanBatch}-${serialSuffix}`;
    const id = uuidv4();

    // Leaf hash combining id, serial, and manufacturer
    const leafHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${id}:${serialNumber}:${manufacturer}`)
    );

    items.push({
      id,
      serialNumber,
      serialIndex,
      leafHash
    });
    leaves.push(leafHash);
  }

  const merkleRoot = computeMerkleRoot(leaves);

  return { items, merkleRoot };
}

/**
 * Creates factory CSV manifest format for industrial inkjet / laser printers.
 */
export function generateManifestCsv(params: {
  productName: string;
  manufacturer: string;
  batchNumber: string;
  items: BatchItem[];
  origin?: string;
}): string {
  const { productName, manufacturer, batchNumber, items, origin = 'https://tearrubr.com' } = params;
  
  const headers = [
    'Serial Number',
    'Product ID',
    'Product Name',
    'Manufacturer',
    'Batch Number',
    'Unit Index',
    'Verification URL',
    'Tamper Seal Status'
  ];

  const rows = items.map(item => {
    const verifyUrl = `${origin}/verify/${item.id}`;
    return [
      `"${item.serialNumber}"`,
      `"${item.id}"`,
      `"${productName.replace(/"/g, '""')}"`,
      `"${manufacturer.replace(/"/g, '""')}"`,
      `"${batchNumber}"`,
      item.serialIndex,
      `"${verifyUrl}"`,
      `"Sealed (TearRubr)"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
