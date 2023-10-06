# Sourcify ABI Retriever

![Sourcify ABI Retriever](./logo.png){ width=60px height=60px }

Retrieve Verifyied Smart Contract ABIs Effortlessly From Sourcify with @0xos/sourcify-abi-retriever

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

With NPM:

```bash
npm install @0xos/sourcify-abi-retriever
```

With Yarn:

```bash
npm install @0xos/sourcify-abi-retriever
```

## Usage

###  Import the Functions

Import the necessary functions from the package into your TypeScript file.

```typescript
import { checkAndRetrieveABI, checkIfIsVerified, retrieveMetadataFile } from 'your-package-name';
```

### Define Contract Information

Create an instance of the `ContractInfo` interface, specifying the contract address and optional chain IDs and server.

```typescript
const contractInfo: ContractInfo = {
  address: '0x1234567890ABCDEF',
  chainIds: [1, 56], 
  //if undefined, it will check for all most popular chains
  server: 'https://custom-sourcify-endpoint.com/api' 
  //if undefined, it will use the standard sourcify api
};
```

### Check and Retrieve ABI

Use the `checkAndRetrieveABI` function to check if the contract is verified and retrieve its ABI.

```typescript
async function getContractABI() {
  try {
    const contractResult = await checkAndRetrieveABI(contractInfo);

    if (contractResult) {
      console.log('Contract status:', contractResult.status);
      console.log('Contract name:', contractResult.name);
      console.log('Contract ABI:', contractResult.abi);
    } else {
      console.log('Contract not found or ABI not available.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getContractABI();
```

Replace `'0x1234567890ABCDEF'` with the actual contract address and modify the chain IDs and server as needed.

### Additional Notes
- The `checkAndRetrieveABI` function returns a `ContractResult` object, including the contract status, name, and ABI.
- The `checkIfIsVerified` and `retrieveMetadataFile` functions are also available for more specific use cases related to contract verification and metadata retrieval.

## Contributing

If you'd like to contribute to this project, please make a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

## Support

If you have any questions or need assistance, feel free to [open an issue](https://github.com/financesaucer/0xos-sourcify-abi-retriver/issues)

## Acknowledgements

Special thanks to Sourcify for their invaluable API that made smart contract ABI retrieval and verification possible. We also appreciate the capabilities provided by Axios for making HTTP requests seamlessly.

## Author

[financesaucer](https://github.com/financesaucer)

---

Feel free to add more sections or customize the content to match your package's specifics. The README should provide users with essential information about your package, how to install and use it, how to contribute, and how to reach out for support or questions.
