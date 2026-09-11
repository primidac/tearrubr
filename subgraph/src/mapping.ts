import {
  ProductRegistered,
  ProductStatusUpdated
} from "../generated/TearRubr/TearRubr";
import { Product } from "../generated/schema";

export function handleProductRegistered(event: ProductRegistered): void {
  let product = new Product(event.params.productId);
  product.productId = event.params.productId;
  product.manufacturer = event.params.manufacturer;
  product.isAuthentic = true;
  product.blockNumber = event.block.number;
  product.blockTimestamp = event.block.timestamp;
  product.transactionHash = event.transaction.hash;
  product.save();
}

export function handleProductStatusUpdated(event: ProductStatusUpdated): void {
  let product = Product.load(event.params.productId);
  if (product != null) {
    product.isAuthentic = event.params.isAuthentic;
    product.save();
  }
}
