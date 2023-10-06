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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
function runTests() {
    return __awaiter(this, void 0, void 0, function* () {
        const contractInfo = {
            address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
            chainIds: [5, 1, 56],
        };
        const contractInfoNoChain = {
            address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        };
        try {
            const abiResult = yield (0, index_1.checkAndRetrieveABI)(contractInfo);
            console.log('ABI Result:', JSON.stringify(abiResult));
            const abiResultNoChain = yield (0, index_1.checkAndRetrieveABI)(contractInfoNoChain);
            const verificationResult = yield (0, index_1.checkIfIsVerified)({
                params: { addresses: contractInfo.address, chainIds: contractInfo.chainIds.join(',') },
                queryEndpoint: 'https://sourcify.dev/server',
            });
            console.log('Verification Result:', verificationResult);
            const metadataFile = yield (0, index_1.retrieveMetadataFile)(contractInfo.chainIds[0].toString(), contractInfo.address, 'https://sourcify.dev/server');
            console.log('Metadata File:', metadataFile);
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
runTests();
