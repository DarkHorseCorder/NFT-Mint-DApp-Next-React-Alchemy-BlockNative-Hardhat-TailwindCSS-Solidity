require('@nomiclabs/hardhat-etherscan')
const hre = require('hardhat')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('./whitelist.js')

const BASE_URI = 'ipfs://Qmb5A1fFECM2iFHgUioii2khT814nCi6VU9aHXHHqNxHCK/'
const proxyRegistryAddressRinkeby = '0xf57b2c51ded3a29e6891aba85459d600256cf317'
const proxyRegistryAddressMainnet = '0xa5409ec958c83c3f309868babaca7c86dcb077c1'

async function main() {
  // Calculate merkle root from the whitelist array
  const leafNodes = whitelist.map((addr) => keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  const root = merkleTree.getRoot()

  await hre.run('verify:verify', {
    address: '0x923130181b7F075cBebFc9743D6e923646FD9148', // Deployed contract address
    constructorArguments: [BASE_URI, root, proxyRegistryAddressRinkeby]
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
