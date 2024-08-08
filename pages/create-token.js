import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

// Pinata API configuration
const PINATA_API_KEY = '44d96723f9d3f83158e6';
const PINATA_SECRET_KEY = '51a3f7459f120070d10997d0be1051a09a353ffaed6872ee11626535850768cb';
const PINATA_BASE_URL = 'https://api.pinata.cloud';

const pinFileToIPFS = async (file) => {
  const url = `${PINATA_BASE_URL}/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      }
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw error;
  }
};

const pinJSONToIPFS = async (json) => {
  const url = `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`;
  try {
    const response = await axios.post(url, json, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      }
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error);
    throw error;
  }
};

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()
  const [nfts, setNfts] = useState([])

  useEffect(() => {
    loadCollection()
  }, [])

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const ipfsHash = await pinFileToIPFS(file)
      const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const ipfsHash = await pinJSONToIPFS(data)
      const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function loadCollection() {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.testnet.fantom.network")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await tokenContract.fetchCollections()

    const items = await Promise.all(data.map(async i => {
      const meta = await axios.get(i.tokenURI)
      let item = {
        tokenId: i.collectionId.toNumber(),
        name: i.name,
        symbol: i.symbol,
        image: meta.data.image
      }
      return item
    }))

    setNfts(items)
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    await transaction.wait()

    router.push('/my-assets')
  }

  return (
    <div className="flex justify-center">
        
      <div className="w-1/2 flex flex-col pb-20 mb-16 text-black">
        <div className="text-white mt-4 mb-4 text-4xl">NFT Minter</div>
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <select
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ collectionId: e.target.value })}
          value={formInput.collectionId}
        >
          {
            nfts.map((nft, i) => (
              <option key={nft.tokenId} value={nft.tokenId}>
              {nft.name} ({nft.symbol})
            </option>
            ))
          }
        </select>
        <input
          type="file"
          name="Asset"
          className="my-4 text-white"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}
