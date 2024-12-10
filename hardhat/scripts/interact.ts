import hre from 'hardhat'

const WEB3DEVTOKEN_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const METAMASK_WALLET_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

async function main() {
    const [account] = await hre.viem.getWalletClients()

    const web3devToken = await hre.viem.getContractAt(
        'Web3DevToken',
        WEB3DEVTOKEN_ADDRESS,
    )

    const inviteTxnHash = await web3devToken.write.invite([
        METAMASK_WALLET_ADDRESS,
    ])

    console.log('hash', inviteTxnHash)
}

main().catch(console.error)
