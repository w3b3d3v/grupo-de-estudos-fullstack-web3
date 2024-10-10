import hre from 'hardhat'

async function main() {
    const [account] = await hre.viem.getWalletClients()

    const web3Token = await hre.viem.deployContract('Web3DevToken', [])

    console.log('Web3Token address', web3Token.address)
}

main().catch(console.error)
