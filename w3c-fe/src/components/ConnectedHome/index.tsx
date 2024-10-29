import { MESSAGE_TO_BE_SIGNED, W3CTOKEN_ADDRESS } from '@/constants'
import { Post } from '@/pages/api/posts'
import { queryClient } from '@/providers/RainbowKit'
import React, { useCallback, useEffect, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { useBlockNumber, useReadContract, useSignMessage } from 'wagmi'
import InvitePanel from '../InvitePanel'
import { WEB3DEV_TOKEN_ABI } from '@/ABI/Web3DevTokenABI'

type ConnectedHomeProps = {
    address: Address
}

export default function ConnectedHome({ address }: ConnectedHomeProps) {
    const { balanceOf, inviteCount } = useWeb3Token({ address })
    const { jwt, getSignature } = useLogin({ address })
    const { posts } = usePosts({ address, jwt })

    // const balance = formatUnits(balanceOf || BigInt(0), 18)

    return (
        <div>
            <h1>Web3Comunities</h1>
            <p>A Gated Web3 Community</p>
            <p>Endereço: {address}</p>
            <p>O seu balanço é: {formatUnits(balanceOf || BigInt(0), 18)} </p>
            <p>Você já convidou: {inviteCount?.toString() || 0} </p>

            {balanceOf && balanceOf > 0 ? (
                <div>
                    <button onClick={getSignature}>Assinar</button>
                    <InvitePanel address={address} />
                </div>
            ) : (
                <div>
                    <h3>Você precisa ser convidado do fórum</h3>
                </div>
            )}

            {!!jwt && (
                <div>
                    {posts.length === 0 ? (
                        <div>
                            <h2> Nenhum post disponivel</h2>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id}>
                                <h2>{post.title}</h2>
                                <p>{post.description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

function useLogin({ address }: { address: Address }) {
    const [jwt, setJwt] = useState<string | null>(null)
    const { signMessageAsync } = useSignMessage()

    async function getSignature() {
        try {
            const signedMessage = await signMessageAsync({
                message: MESSAGE_TO_BE_SIGNED,
            })

            // setJwt(signedMessage)

            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({
                    address: address,
                    signature: signedMessage,
                }),
            })

            const { token } = await response.json()

            setJwt(token)
            console.log('token', token)
        } catch (err) {
            console.error(err)
        }
    }

    return { jwt, getSignature }
}

function usePosts({ address, jwt }: { address: Address; jwt: string | null }) {
    const [posts, setPosts] = useState<Post[]>([])

    const signAndFetch = useCallback(async () => {
        try {
            if (!jwt) {
                console.error('Missing signed message')
                return
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: JSON.stringify({
                    address: address,
                    signature: jwt,
                }),
                headers: {
                    authorization: `Bearer ${jwt}`,
                },
            })

            const { posts, error } = await response.json()

            if (error) {
                console.error(error)
                return
            }

            console.log('posts', posts)
            setPosts(posts)
        } catch (err) {
            console.error(err)
            // @TODO: handle error
        }
    }, [address, jwt])

    useEffect(() => {
        if (!jwt) return
        signAndFetch()
    }, [jwt, signAndFetch])

    return { posts, signAndFetch }
}

function useWeb3Token({ address }: { address: Address }) {
    const { data: blockNumber } = useBlockNumber({ watch: true })

    // const web3TokenConfig = {
    //     abi: WEB3DEV_TOKEN_ABI,
    //     address: W3CTOKEN_ADDRESS,
    // } as const

    // const { data } = useReadContracts({
    //     contracts: [
    //         {
    //             ...web3TokenConfig,
    //             functionName: 'balanceOf',
    //             args: [address as Address],
    //         },
    //         {
    //             ...web3TokenConfig,
    //             functionName: 'getInviteCount',
    //             args: [address as Address],
    //         },
    //     ],
    // })

    // const [balanceOf, inviteCount] = data

    const {
        data: balanceOf,
        error,
        queryKey,
    } = useReadContract({
        abi: WEB3DEV_TOKEN_ABI,
        address: W3CTOKEN_ADDRESS,
        functionName: 'balanceOf',
        args: [address as Address],
    })

    const { data: inviteCount } = useReadContract({
        abi: WEB3DEV_TOKEN_ABI,
        address: W3CTOKEN_ADDRESS,
        functionName: 'getInviteCount',
        args: [address as Address],
    })

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey })
    }, [blockNumber, queryKey])

    // console.log('data read', data)

    return {
        balanceOf: balanceOf,
        inviteCount: inviteCount,
        error: error,
    }
}
