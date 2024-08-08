import { useEffect, useState } from 'react'
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
} from '../../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()
  const [nfts, setNfts] = useState({})
  const { tokenId } = router.query;

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

    setNfts(items[0])
  }

  return (
    <div className='row'>
      <div className="flex justify-center">
        <div className='image'>
            <img src={nfts.image} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className='test'>
            <p style={{ height: '64px' }} className="text-2xl font-semibold">{nfts.name} ({nfts.symbol})</p>
        </div>
      </div>
    </div>
  )
}
