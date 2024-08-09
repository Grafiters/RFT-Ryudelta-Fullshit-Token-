namespace Nft.Contracts.NFT.ContractDefinition

open System
open System.Threading.Tasks
open System.Collections.Generic
open System.Numerics
open Nethereum.Hex.HexTypes
open Nethereum.ABI.FunctionEncoding.Attributes

    type CollectionData() =
            [<Parameter("uint256", "tokenId", 1)>]
            member val public TokenId = Unchecked.defaultof<BigInteger> with get, set
            [<Parameter("string", "tokenURI", 2)>]
            member val public TokenURI = Unchecked.defaultof<string> with get, set
            [<Parameter("address", "owner", 3)>]
            member val public Owner = Unchecked.defaultof<string> with get, set
            [<Parameter("string", "collectionName", 4)>]
            member val public CollectionName = Unchecked.defaultof<string> with get, set
            [<Parameter("string", "collectionSymbol", 5)>]
            member val public CollectionSymbol = Unchecked.defaultof<string> with get, set
    

