import hre from 'hardhat'

// quero um script para convidar o endereço 0xA9BC6d9681Ca08a90fe9b79c79D7660A6936F4c3

const WEB3DEVTOKEN_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const METAMASK_WALLET_ADDRESS = '0xA9BC6d9681Ca08a90fe9b79c79D7660A6936F4c3'

async function main() {
    const [account] = await hre.viem.getWalletClients()

    const web3devToken = await hre.viem.getContractAt(
        'Web3DevToken',
        WEB3DEVTOKEN_ADDRESS,
    )

    // const balance = await web3devToken.read.balanceOf([METAMASK_WALLET_ADDRESS])
    // console.log('Balance of 1', balance.toString())

    const inviteCount = await web3devToken.read.getInviteCount([
        account.account.address,
    ])

    console.log('Invite count', inviteCount.toString())

    // const inviteTxnHash = await web3devToken.write.invite([
    //     METAMASK_WALLET_ADDRESS,
    // ])

    // const inviteTxnHash2 = await web3devToken.write.invite([
    //     METAMASK_WALLET_ADDRESS,
    // ])

    // const inviteTxnHash3 = await web3devToken.write.invite([
    //     METAMASK_WALLET_ADDRESS,
    // ])

    // const inviteTxnHash5 = await web3devToken.write.invite([
    //     METAMASK_WALLET_ADDRESS,
    // ])

    // const balance2 = await web3devToken.read.balanceOf([
    //     METAMASK_WALLET_ADDRESS,
    // ])

    // const web3Token = await hre.viem.deployContract('Web3DevToken', [])
    // console.log('Web3Token address', web3Token.address)
}

main().catch(console.error)
