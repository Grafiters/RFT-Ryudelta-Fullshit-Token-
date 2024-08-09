namespace Nft.Contracts.NFT.ContractDefinition

open System
open System.Threading.Tasks
open System.Collections.Generic
open System.Numerics
open Nethereum.Hex.HexTypes
open Nethereum.ABI.FunctionEncoding.Attributes

    type Collection() =
            [<Parameter("uint256", "collectionId", 1)>]
            member val public CollectionId = Unchecked.defaultof<BigInteger> with get, set
            [<Parameter("string", "name", 2)>]
            member val public Name = Unchecked.defaultof<string> with get, set
            [<Parameter("string", "tokenURI", 3)>]
            member val public TokenURI = Unchecked.defaultof<string> with get, set
            [<Parameter("string", "symbol", 4)>]
            member val public Symbol = Unchecked.defaultof<string> with get, set
    

