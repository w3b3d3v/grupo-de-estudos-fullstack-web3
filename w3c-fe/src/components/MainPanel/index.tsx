import React from 'react'
import { MESSAGE_TO_BE_SIGNED, W3CTOKEN_ADDRESS } from '@/constants'
import { Address, erc20Abi, formatUnits, verifyMessage } from 'viem'

import { useAccount, useReadContract, useSignMessage } from 'wagmi'

// localhost/api/posts/0x123 -> returna posts do 0x123
// assinar msg -> decoficaiar msg pra pegar endereço (0x456)

// localhost/api/posts -> return 0x456

export default function MainPanel() {
    const { address } = useAccount()
    const { signMessageAsync } = useSignMessage()

    async function signMessage() {
        try {
            if (!address) return

            const signedMessage = await signMessageAsync({
                message: MESSAGE_TO_BE_SIGNED,
            })

            console.log('signedMessage', signedMessage)

            const isSignedByAddress = await verifyMessage({
                message: MESSAGE_TO_BE_SIGNED,
                signature: signedMessage,
                address,
            })

            const posts = await fetch('/api/posts', {
                method: 'POST',
                body: JSON.stringify({
                    address: address,
                    signature: signedMessage,
                }),
            })

            console.log('posts', posts)

            console.log('isSignedByAddress', isSignedByAddress)
        } catch (err) {
            console.error(err)
            // @TODO: handle error
        }
    }

    const { data } = useReadContract({
        abi: erc20Abi,
        address: W3CTOKEN_ADDRESS,
        functionName: 'balanceOf',
        args: [address as Address],
    })

    // console.log('blockNumber', blockNumber)

    return (
        <div>
            <h1>Web3Comunities</h1>
            <p>A Gated Web3 Community</p>
            <p>O seu balanço é: {formatUnits(data || BigInt(0), 18)} </p>

            <button onClick={signMessage}>Assinar</button>
        </div>
    )
}
