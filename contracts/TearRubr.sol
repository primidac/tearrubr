// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TearRubr {
    struct Product {
        string manufacturer;
        bool isRegistered;
        bool isAuthentic;
    }

    // Mapping from Product ID (e.g., a hash or UUID string) to Product details
    mapping(string => Product) public products;
    
    // Mapping to restrict who can register products (simplified for MVP)
    mapping(address => bool) public authorizedManufacturers;

    event ProductRegistered(string productId, string manufacturer);
    event ProductStatusUpdated(string productId, bool isAuthentic);

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedManufacturers[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function authorizeManufacturer(address manufacturer) external onlyOwner {
        authorizedManufacturers[manufacturer] = true;
    }

    function registerProduct(string memory productId, string memory manufacturer) external onlyAuthorized {
        require(!products[productId].isRegistered, "Product already registered");
        
        products[productId] = Product({
            manufacturer: manufacturer,
            isRegistered: true,
            isAuthentic: true
        });

        emit ProductRegistered(productId, manufacturer);
    }

    function updateProductStatus(string memory productId, bool isAuthentic) external onlyAuthorized {
        require(products[productId].isRegistered, "Product not registered");
        products[productId].isAuthentic = isAuthentic;

        emit ProductStatusUpdated(productId, isAuthentic);
    }

    function verifyProduct(string memory productId) external view returns (bool isRegistered, bool isAuthentic, string memory manufacturer) {
        Product memory p = products[productId];
        return (p.isRegistered, p.isAuthentic, p.manufacturer);
    }
}
