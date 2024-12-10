import hre from 'hardhat'

const METAMASK_WALLET_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

async function main() {
    const [account] = await hre.viem.getWalletClients()

    const web3Token = await hre.viem.deployContract('Web3DevToken', [])

    const inviteTxnHash = await web3Token.write.invite([
        METAMASK_WALLET_ADDRESS,
    ])

    console.log('Web3Token address', web3Token.address)
}

main().catch(console.error)
