/* pages/my-assets.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])

  let web3Modal, provider, signer, marketContract, tokenContract;
  async function initializeWeb3Modal() {
    web3Modal = new Web3Modal({
      network: "testnet",
      cacheProvider: false, // Set to true if you want to cache the provider
    });
  
    const connection = await web3Modal.connect();
    provider = new ethers.providers.Web3Provider(connection);
    signer = provider.getSigner();
    
    marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    console.log('market', marketContract.address);
  
    tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    console.log('token', tokenContract.address);
  }

  
  async function loadNFTs() {
    await initializeWeb3Modal();

    console.log("==========================");
    const data = await tokenContract.getTokensInCollection(1)
    console.log("data", data);

    // const items = await Promise.all(data.map(async i => {
    //   const tokenUri = await tokenContract.tokenURI(i.tokenId)
    //   const meta = await axios.get(tokenUri)
    //   let item = {
    //     tokenId: i.tokenId,
    //     ownership: i.ownership,
    //     owner: i.owner
    //   }

    //   console.log(item);
    //   return item
    // }))
    // setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
  return (
    <div className="flex justify-center mb-20 pb-20" >
    

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}