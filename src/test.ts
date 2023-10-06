import { checkAndRetrieveABI, checkIfIsVerified, retrieveMetadataFile } from './index';

async function runTests() {
  const contractInfo = {
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    chainIds: [5, 1, 56],
  };

  const contractInfoNoChain = {
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  };

  try {
    const abiResult = await checkAndRetrieveABI(contractInfo);
    console.log('ABI Result:', JSON.stringify(abiResult));

    const abiResultNoChain = await checkAndRetrieveABI(contractInfoNoChain);

    const verificationResult = await checkIfIsVerified({
      params: { addresses: contractInfo.address, chainIds: contractInfo.chainIds.join(',') },
      queryEndpoint: 'https://sourcify.dev/server', // Update with the correct server endpoint
    });
    console.log('Verification Result:', verificationResult);

    const metadataFile = await retrieveMetadataFile(contractInfo.chainIds[0].toString(), contractInfo.address, 'https://sourcify.dev/server'); // Update with the correct server endpoint
    console.log('Metadata File:', metadataFile);
  } catch (error) {
    console.error('Error:', error);
  }
}

runTests();
