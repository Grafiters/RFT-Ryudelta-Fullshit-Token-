// contracts/NFT.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "./@openzeppelin/contracts/utils/Counters.sol";
import "./@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _collectionIds;
    address contractAddress;

    struct Collection {
        uint256 collectionId;
        string name;
        string tokenURI;
        string symbol;
    }

    struct CollectionData {
        uint256 tokenId;
        string tokenURI;
        address owner;
        string collectionName;
        string collectionSymbol;
        address[] ownerShip;
    }

    mapping(uint256 => address[]) private _ownerShip;
    mapping(uint256 => Collection) private _collections;

    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
        contractAddress = marketplaceAddress;
    }

    function createCollection(string memory tokenURI, string memory name, string memory symbol ) public returns (uint) {
        _collectionIds.increment();
        uint256 newCollectionId = _collectionIds.current();

        _mint(msg.sender, newCollectionId);
        _setTokenURI(newCollectionId, tokenURI);

        _collections[newCollectionId] = Collection({
            collectionId: newCollectionId,
            name: name,
            symbol: symbol,
            tokenURI: tokenURI
        });

        return newCollectionId;
    }

    function createToken(string memory tokenURI, uint256 collectionId) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);

        _collections[newItemId] = collectionId;
        _ownerShip[newItemId].push(msg.sender);
        
        return newItemId;
    }

    function fetchCollections() public view returns (Collection[] memory) {
        Collection[] memory collections = new Collection[](_collectionIds.current());
        for (uint256 i = 0; i < _collectionIds.current(); i++) {
            collections[i] = _collections[i + 1];
        }
        return collections;
    }

    function fetchCollectionID(uint256 collectionId) public view returns (Collection memory) {
        require(bytes(_collections[collectionId].name).length > 0, "Collection does not exist");
        return _collections[collectionId];
    }

    function _transfer(address to, uint256 tokenId) internal {
        super._transfer(msg.sender, to, tokenId);
        _ownerShip[tokenId].push(to);
    }

    // Get all token IDs owned by a specific address
    function getTokensOfOwner(address owner) public view returns (CollectionData[] memory) {
        uint256 tokenCount = balanceOf(owner);
        CollectionData[] memory tokens = new CollectionData[](tokenCount);
        uint256 index = 0;

        for (uint256 i = 0; i < _tokenIds.current(); i++) {
            if (ownerOf(i) == owner) {
                index++;
            }
        }

        return tokens;
    }

    function getOwnerOfToken(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    // Fetch NFTs created by a specific address
    function fetchItemsCreated() public view returns (CollectionData[] memory) {
        uint256 totalTokenCount = _tokenIds.current();
        uint256 CollectionDataCount = 0;

        for (uint256 i = 0; i < totalTokenCount; i++) {
            if (ownerOf(i) == msg.sender) {
                CollectionDataCount++;
            }
        }

        CollectionData[] memory tokens = new CollectionData[](CollectionDataCount);
        uint256 index = 0;

        for (uint256 i = 0; i < totalTokenCount; i++) {
            if (ownerOf(i) == msg.sender) {
                index++;
            }
        }

        return tokens;
    }
}