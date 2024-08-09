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
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

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
    const { name, symbol } = formInput
    if (!name || !symbol || !fileUrl) return
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name, symbol, image: fileUrl
    })
    try {
      const ipfsHash = await pinJSONToIPFS(data)
      const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`

      createSale(url, name, symbol)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createSale(url, name, symbol) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    console.log("========================");

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createCollection(url, name, symbol)
    console.log(transaction);
    await transaction.wait();

    // router.push('/collection')
  }

  async function loadCollection() {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.testnet.fantom.network")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await tokenContract.fetchCollections()

    console.log(data);
    const items = await Promise.all(data.map(async i => {
      if (i.collectionId.toNumber() > 0) {
        const meta = await axios.get(i.tokenURI)
        let item = {
          tokenId: i.collectionId.toNumber(),
          name: i.name,
          symbol: i.symbol,
          image: meta.data.image
        }
        return item
      }
    }))

    const datas = items.filter(item => item !== undefined)
    setNfts(datas)
  }

  function tokenInCollection(id) {
    router.push(`/nft/${id}`)
  }

  return (
    <div className='row'>
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-20 mb-16 text-black">
          <div className="text-white mt-4 mb-4 text-4xl">NFT Minter</div>
          <input 
            placeholder="Collection Name"
            className="mt-8 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <textarea
            placeholder="Collection Symbol"
            className="mt-2 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, symbol: e.target.value })}
          />
          <input
            type="file"
            name="Collection"
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
      <div className='flex justify-center'>
        <div className="px-4" style={{ maxWidth: '1600px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              nfts.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  <img src={nft.image} />
                  <div className="p-4">
                    <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name} ( {nft.symbol} )</p>
                  </div>
                  <div className="p-4 bg-black">
                    <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => tokenInCollection(nft.tokenId)}>Detail</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
