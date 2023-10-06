import axios, { AxiosResponse } from 'axios';

interface ContractInfo {
    address: string;
    chainIds?: number[];
    server?: string;
}

interface CheckParams {
    params: { addresses: string; chainIds: string };
    queryEndpoint: string;
}

interface ChainIdStatus {
    chainId: string;
    status: string;
}

interface ContractResponse {
    address: string;
    chainIds: ChainIdStatus[];
}

interface ContractResult {
    status: string;
    name: string;
    abi: JSON;
}

const SOURCIFY_API_BASE_URL = 'https://sourcify.dev/server';

const allChains = [1, 42170, 42161, 1313161554, 43114, 56, 4337, 42220, 25, 250, 100, 1284, 10, 137]

async function checkAndRetrieveABI(contractInfo: ContractInfo): Promise<ContractResult | undefined | null> {
    const { address, chainIds, server } = contractInfo;
    const queryEndpoint = server ? server : SOURCIFY_API_BASE_URL;

    const params = {
        addresses: address,
        chainIds: chainIds?.join(',') || allChains.join(','),
    };

    try {
        const matches = await checkIfIsVerified({ params, queryEndpoint });

        if (matches.status === 'perfect' && matches.matches.length > 0) {
            // Retrieve the metadata file for the first perfect match
            const metadataFileUrl = await retrieveMetadataFile(matches.matches[0].chainIds[0], address, queryEndpoint);

            if (metadataFileUrl) {
                const metadataResponse = await axios.get(metadataFileUrl);
                if (metadataResponse && metadataResponse.data) {
                    const abi = metadataResponse.data?.output.abi;
                    const compilationTarget = metadataResponse.data.settings?.compilationTarget;
                    const [nameWithQuotes,] = JSON.stringify(compilationTarget).split(':');
                    const name = nameWithQuotes.replace(/[{"]/g, '');
                    if (abi && compilationTarget) {
                        const result: ContractResult = { status: 'partial', name, abi }
                        return result;
                    }
                }
            }

        } else if (matches.status === 'partial' && matches.matches.length > 0) {
            // Retrieve the metadata file for the first partial match
            const metadataFileUrl = await retrieveMetadataFile(matches.matches[0].chainIds[0], address, queryEndpoint);

            if (metadataFileUrl) {
                const metadataResponse = await axios.get(metadataFileUrl);
                if (metadataResponse && metadataResponse.data) {
                    const abi = metadataResponse.data?.output.abi;
                    const compilationTarget = metadataResponse.data.settings?.compilationTarget;
                    const [nameWithQuotes,] = JSON.stringify(compilationTarget).split(':');
                    const name = nameWithQuotes.replace(/[{"]/g, '');
                    if (abi && compilationTarget) {
                        const result: ContractResult = { status: 'partial', name, abi }
                        return result;
                    }
                }
            }

            //return { status: 'partial', metadataFileUrl };
        } else {
            throw new Error('Contract ABI not found for the provided address and chain IDs.');
        }
    } catch (error) {
        throw new Error(`Failed to check and retrieve contract ABI: ${error}`);
    }
}

async function checkIfIsVerified(contractInfo: CheckParams) {
    const { params, queryEndpoint } = contractInfo;

    try {
        const response: AxiosResponse<ContractResponse[]> = await axios.get(
            `${queryEndpoint}/check-all-by-addresses`,
            {
                params,
            }
        );

        const perfectMatches: { address: string; chainIds: string[] }[] = [];
        const partialMatches: { address: string; chainIds: string[] }[] = [];

        for (const contract of response.data) {
            const verifiedChainIds = contract.chainIds
                .filter((chain: { status: string; }) => chain.status === 'perfect' || chain.status === 'partial')
                .map((chain: { chainId: any; }) => chain.chainId);

            if (verifiedChainIds.length > 0) {
                if (contract.chainIds.some((chain: { status: string; }) => chain.status === 'perfect')) {
                    perfectMatches.push({ address: contract.address, chainIds: verifiedChainIds });
                } else {
                    partialMatches.push({ address: contract.address, chainIds: verifiedChainIds });
                }
            }
        }

        if (perfectMatches.length > 0) {
            return { status: 'perfect', matches: perfectMatches };
        } else if (partialMatches.length > 0) {
            return { status: 'partial', matches: partialMatches };
        } else {
            throw new Error('Contract ABI not found for the provided address and chain IDs.');
        }
    } catch (error) {
        throw new Error(`Failed to check contract verification: ${error}`);
    }
}

async function retrieveMetadataFile(chainId: string, address: string, server: string): Promise<string | null> {
    try {
        const apiUrl = `${server}/files/tree/any/${chainId}/${address}`;

        const response: AxiosResponse<any> = await axios.get(apiUrl);
        const files = response.data.files;

        // We're only interested in the metadata file
        const metadataFile = files.find((file: string) => file.endsWith('metadata.json'));

        if (metadataFile) {
            return metadataFile;
        } else {
            throw new Error('Metadata file not found for the provided address and chain ID.');
        }
    } catch (error) {
        throw new Error(`Failed to retrieve metadata file: ${error}`);
    }
}

export { checkAndRetrieveABI, checkIfIsVerified, retrieveMetadataFile };
