namespace Nft.Contracts.NFT

open System
open System.Threading.Tasks
open System.Collections.Generic
open System.Numerics
open Nethereum.Hex.HexTypes
open Nethereum.ABI.FunctionEncoding.Attributes
open Nethereum.Web3
open Nethereum.RPC.Eth.DTOs
open Nethereum.Contracts.CQS
open Nethereum.Contracts.ContractHandlers
open Nethereum.Contracts
open System.Threading
open Nft.Contracts.NFT.ContractDefinition


    type NftService (web3: Web3, contractAddress: string) =
    
        member val Web3 = web3 with get
        member val ContractHandler = web3.Eth.GetContractHandler(contractAddress) with get
    
        static member DeployContractAndWaitForReceiptAsync(web3: Web3, nftDeployment: NftDeployment, ?cancellationTokenSource : CancellationTokenSource): Task<TransactionReceipt> = 
            let cancellationTokenSourceVal = defaultArg cancellationTokenSource null
            web3.Eth.GetContractDeploymentHandler<NftDeployment>().SendRequestAndWaitForReceiptAsync(nftDeployment, cancellationTokenSourceVal)
        
        static member DeployContractAsync(web3: Web3, nftDeployment: NftDeployment): Task<string> =
            web3.Eth.GetContractDeploymentHandler<NftDeployment>().SendRequestAsync(nftDeployment)
        
        static member DeployContractAndGetServiceAsync(web3: Web3, nftDeployment: NftDeployment, ?cancellationTokenSource : CancellationTokenSource) = async {
            let cancellationTokenSourceVal = defaultArg cancellationTokenSource null
            let! receipt = NftService.DeployContractAndWaitForReceiptAsync(web3, nftDeployment, cancellationTokenSourceVal) |> Async.AwaitTask
            return new NftService(web3, receipt.ContractAddress);
            }
    
        member this.ApproveRequestAsync(approveFunction: ApproveFunction): Task<string> =
            this.ContractHandler.SendRequestAsync(approveFunction);
        
        member this.ApproveRequestAndWaitForReceiptAsync(approveFunction: ApproveFunction, ?cancellationTokenSource : CancellationTokenSource): Task<TransactionReceipt> =
            let cancellationTokenSourceVal = defaultArg cancellationTokenSource null
            this.ContractHandler.SendRequestAndWaitForReceiptAsync(approveFunction, cancellationTokenSourceVal);
        
        member this.BalanceOfQueryAsync(balanceOfFunction: BalanceOfFunction, ?blockParameter: BlockParameter): Task<BigInteger> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryAsync<BalanceOfFunction, BigInteger>(balanceOfFunction, blockParameterVal)
            
        member this.CreateCollectionRequestAsync(createCollectionFunction: CreateCollectionFunction): Task<string> =
            this.ContractHandler.SendRequestAsync(createCollectionFunction);
        
        member this.CreateCollectionRequestAndWaitForReceiptAsync(createCollectionFunction: CreateCollectionFunction, ?cancellationTokenSource : CancellationTokenSource): Task<TransactionReceipt> =
            let cancellationTokenSourceVal = defaultArg cancellationTokenSource null
            this.ContractHandler.SendRequestAndWaitForReceiptAsync(createCollectionFunction, cancellationTokenSourceVal);
        
        member this.CreateTokenRequestAsync(createTokenFunction: CreateTokenFunction): Task<string> =
            this.ContractHandler.SendRequestAsync(createTokenFunction);
        
        member this.CreateTokenRequestAndWaitForReceiptAsync(createTokenFunction: CreateTokenFunction, ?cancellationTokenSource : CancellationTokenSource): Task<TransactionReceipt> =
            let cancellationTokenSourceVal = defaultArg cancellationTokenSource null
            this.ContractHandler.SendRequestAndWaitForReceiptAsync(createTokenFunction, cancellationTokenSourceVal);
        
        member this.FetchCollectionIDQueryAsync(fetchCollectionIDFunction: FetchCollectionIDFunction, ?blockParameter: BlockParameter): Task<FetchCollectionIDOutputDTO> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryDeserializingToObjectAsync<FetchCollectionIDFunction, FetchCollectionIDOutputDTO>(fetchCollectionIDFunction, blockParameterVal)
            
        member this.FetchCollectionsQueryAsync(fetchCollectionsFunction: FetchCollectionsFunction, ?blockParameter: BlockParameter): Task<FetchCollectionsOutputDTO> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryDeserializingToObjectAsync<FetchCollectionsFunction, FetchCollectionsOutputDTO>(fetchCollectionsFunction, blockParameterVal)
            
        member this.GetApprovedQueryAsync(getApprovedFunction: GetApprovedFunction, ?blockParameter: BlockParameter): Task<string> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryAsync<GetApprovedFunction, string>(getApprovedFunction, blockParameterVal)
            
        member this.GetOwnerOfTokenQueryAsync(getOwnerOfTokenFunction: GetOwnerOfTokenFunction, ?blockParameter: BlockParameter): Task<string> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryAsync<GetOwnerOfTokenFunction, string>(getOwnerOfTokenFunction, blockParameterVal)
            
        member this.GetTokensInCollectionQueryAsync(getTokensInCollectionFunction: GetTokensInCollectionFunction, ?blockParameter: BlockParameter): Task<GetTokensInCollectionOutputDTO> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryDeserializingToObjectAsync<GetTokensInCollectionFunction, GetTokensInCollectionOutputDTO>(getTokensInCollectionFunction, blockParameterVal)
            
        member this.GetTokensOfOwnerQueryAsync(getTokensOfOwnerFunction: GetTokensOfOwnerFunction, ?blockParameter: BlockParameter): Task<GetTokensOfOwnerOutputDTO> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryDeserializingToObjectAsync<GetTokensOfOwnerFunction, GetTokensOfOwnerOutputDTO>(getTokensOfOwnerFunction, blockParameterVal)
            
        member this.IsApprovedForAllQueryAsync(isApprovedForAllFunction: IsApprovedForAllFunction, ?blockParameter: BlockParameter): Task<bool> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryAsync<IsApprovedForAllFunction, bool>(isApprovedForAllFunction, blockParameterVal)
            
        member this.NameQueryAsync(nameFunction: NameFunction, ?blockParameter: BlockParameter): Task<string> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryAsync<NameFunction, string>(nameFunction, blockParameterVal)
            
        member this.OwnerOfQueryAsync(ownerOfFunction: OwnerOfFunction, ?blockParameter: BlockParameter): Task<string> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryAsync<OwnerOfFunction, string>(ownerOfFunction, blockParameterVal)
            
        member this.SafeTransferFromRequestAsync(safeTransferFromFunction: SafeTransferFromFunction): Task<string> =
            this.ContractHandler.SendRequestAsync(safeTransferFromFunction);
        
        member this.SafeTransferFromRequestAndWaitForReceiptAsync(safeTransferFromFunction: SafeTransferFromFunction, ?cancellationTokenSource : CancellationTokenSource): Task<TransactionReceipt> =
            let cancellationTokenSourceVal = defaultArg cancellationTokenSource null
            this.ContractHandler.SendRequestAndWaitForReceiptAsync(safeTransferFromFunction, cancellationTokenSourceVal);
        
        member this.SafeTransferFromRequestAsync(safeTransferFrom1Function: SafeTransferFrom1Function): Task<string> =
            this.ContractHandler.SendRequestAsync(safeTransferFrom1Function);
        
        member this.SafeTransferFromRequestAndWaitForReceiptAsync(safeTransferFrom1Function: SafeTransferFrom1Function, ?cancellationTokenSource : CancellationTokenSource): Task<TransactionReceipt> =
            let cancellationTokenSourceVal = defaultArg cancellationTokenSource null
            this.ContractHandler.SendRequestAndWaitForReceiptAsync(safeTransferFrom1Function, cancellationTokenSourceVal);
        
        member this.SetApprovalForAllRequestAsync(setApprovalForAllFunction: SetApprovalForAllFunction): Task<string> =
            this.ContractHandler.SendRequestAsync(setApprovalForAllFunction);
        
        member this.SetApprovalForAllRequestAndWaitForReceiptAsync(setApprovalForAllFunction: SetApprovalForAllFunction, ?cancellationTokenSource : CancellationTokenSource): Task<TransactionReceipt> =
            let cancellationTokenSourceVal = defaultArg cancellationTokenSource null
            this.ContractHandler.SendRequestAndWaitForReceiptAsync(setApprovalForAllFunction, cancellationTokenSourceVal);
        
        member this.SupportsInterfaceQueryAsync(supportsInterfaceFunction: SupportsInterfaceFunction, ?blockParameter: BlockParameter): Task<bool> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryAsync<SupportsInterfaceFunction, bool>(supportsInterfaceFunction, blockParameterVal)
            
        member this.SymbolQueryAsync(symbolFunction: SymbolFunction, ?blockParameter: BlockParameter): Task<string> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryAsync<SymbolFunction, string>(symbolFunction, blockParameterVal)
            
        member this.TokenURIQueryAsync(tokenURIFunction: TokenURIFunction, ?blockParameter: BlockParameter): Task<string> =
            let blockParameterVal = defaultArg blockParameter null
            this.ContractHandler.QueryAsync<TokenURIFunction, string>(tokenURIFunction, blockParameterVal)
            
        member this.TransferFromRequestAsync(transferFromFunction: TransferFromFunction): Task<string> =
            this.ContractHandler.SendRequestAsync(transferFromFunction);
        
        member this.TransferFromRequestAndWaitForReceiptAsync(transferFromFunction: TransferFromFunction, ?cancellationTokenSource : CancellationTokenSource): Task<TransactionReceipt> =
            let cancellationTokenSourceVal = defaultArg cancellationTokenSource null
            this.ContractHandler.SendRequestAndWaitForReceiptAsync(transferFromFunction, cancellationTokenSourceVal);
        
    

