"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveMetadataFile = exports.checkIfIsVerified = exports.checkAndRetrieveABI = void 0;
const axios_1 = __importDefault(require("axios"));
const SOURCIFY_API_BASE_URL = 'https://sourcify.dev/server';
const allChains = [1, 42170, 42161, 1313161554, 43114, 56, 4337, 42220, 25, 250, 100, 1284, 10, 137];
function checkAndRetrieveABI(contractInfo) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const { address, chainIds, server } = contractInfo;
        const queryEndpoint = server ? server : SOURCIFY_API_BASE_URL;
        const params = {
            addresses: address,
            chainIds: (chainIds === null || chainIds === void 0 ? void 0 : chainIds.join(',')) || allChains.join(','),
        };
        try {
            const matches = yield checkIfIsVerified({ params, queryEndpoint });
            if (matches.status === 'perfect' && matches.matches.length > 0) {
                const metadataFileUrl = yield retrieveMetadataFile(matches.matches[0].chainIds[0], address, queryEndpoint);
                if (metadataFileUrl) {
                    const metadataResponse = yield axios_1.default.get(metadataFileUrl);
                    if (metadataResponse && metadataResponse.data) {
                        const abi = (_a = metadataResponse.data) === null || _a === void 0 ? void 0 : _a.output.abi;
                        const compilationTarget = (_b = metadataResponse.data.settings) === null || _b === void 0 ? void 0 : _b.compilationTarget;
                        const [nameWithQuotes,] = JSON.stringify(compilationTarget).split(':');
                        const name = nameWithQuotes.replace(/[{"]/g, '');
                        if (abi && compilationTarget) {
                            const result = { status: 'partial', name, abi };
                            return result;
                        }
                    }
                }
            }
            else if (matches.status === 'partial' && matches.matches.length > 0) {
                const metadataFileUrl = yield retrieveMetadataFile(matches.matches[0].chainIds[0], address, queryEndpoint);
                if (metadataFileUrl) {
                    const metadataResponse = yield axios_1.default.get(metadataFileUrl);
                    if (metadataResponse && metadataResponse.data) {
                        const abi = (_c = metadataResponse.data) === null || _c === void 0 ? void 0 : _c.output.abi;
                        const compilationTarget = (_d = metadataResponse.data.settings) === null || _d === void 0 ? void 0 : _d.compilationTarget;
                        const [nameWithQuotes,] = JSON.stringify(compilationTarget).split(':');
                        const name = nameWithQuotes.replace(/[{"]/g, '');
                        if (abi && compilationTarget) {
                            const result = { status: 'partial', name, abi };
                            return result;
                        }
                    }
                }
            }
            else {
                throw new Error('Contract ABI not found for the provided address and chain IDs.');
            }
        }
        catch (error) {
            throw new Error(`Failed to check and retrieve contract ABI: ${error}`);
        }
    });
}
exports.checkAndRetrieveABI = checkAndRetrieveABI;
function checkIfIsVerified(contractInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const { params, queryEndpoint } = contractInfo;
        try {
            const response = yield axios_1.default.get(`${queryEndpoint}/check-all-by-addresses`, {
                params,
            });
            const perfectMatches = [];
            const partialMatches = [];
            for (const contract of response.data) {
                const verifiedChainIds = contract.chainIds
                    .filter((chain) => chain.status === 'perfect' || chain.status === 'partial')
                    .map((chain) => chain.chainId);
                if (verifiedChainIds.length > 0) {
                    if (contract.chainIds.some((chain) => chain.status === 'perfect')) {
                        perfectMatches.push({ address: contract.address, chainIds: verifiedChainIds });
                    }
                    else {
                        partialMatches.push({ address: contract.address, chainIds: verifiedChainIds });
                    }
                }
            }
            if (perfectMatches.length > 0) {
                return { status: 'perfect', matches: perfectMatches };
            }
            else if (partialMatches.length > 0) {
                return { status: 'partial', matches: partialMatches };
            }
            else {
                throw new Error('Contract ABI not found for the provided address and chain IDs.');
            }
        }
        catch (error) {
            throw new Error(`Failed to check contract verification: ${error}`);
        }
    });
}
exports.checkIfIsVerified = checkIfIsVerified;
function retrieveMetadataFile(chainId, address, server) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiUrl = `${server}/files/tree/any/${chainId}/${address}`;
            const response = yield axios_1.default.get(apiUrl);
            const files = response.data.files;
            const metadataFile = files.find((file) => file.endsWith('metadata.json'));
            if (metadataFile) {
                return metadataFile;
            }
            else {
                throw new Error('Metadata file not found for the provided address and chain ID.');
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.retrieveMetadataFile = retrieveMetadataFile;
