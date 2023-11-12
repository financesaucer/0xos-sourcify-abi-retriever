interface ContractInfo {
    address: string;
    chainIds?: number[];
    server?: string;
}
interface CheckParams {
    params: {
        addresses: string;
        chainIds: string;
    };
    queryEndpoint: string;
}
interface ContractResult {
    status: string;
    name: string;
    abi: JSON;
}
declare function checkAndRetrieveABI(contractInfo: ContractInfo): Promise<ContractResult | undefined | null>;
declare function checkIfIsVerified(contractInfo: CheckParams): Promise<{
    status: string;
    matches: {
        address: string;
        chainIds: string[];
    }[];
}>;
declare function retrieveMetadataFile(chainId: string, address: string, server: string): Promise<string | null | undefined>;
export { checkAndRetrieveABI, checkIfIsVerified, retrieveMetadataFile };
