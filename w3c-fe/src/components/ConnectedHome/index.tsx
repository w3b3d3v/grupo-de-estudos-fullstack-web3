import React from 'react'
import { Address, formatUnits } from 'viem'

import InvitePanel from '../InvitePanel'
import { useAuth, usePosts, useWeb3Token } from '@/hooks'

type ConnectedHomeProps = {
    address: Address
}

export default function ConnectedHome({ address }: ConnectedHomeProps) {
    const { authenticated, login } = useAuth()
    const { balanceOf, inviteCount } = useWeb3Token({ address })
    const { posts } = usePosts({ address, authenticated })

    return (
        <div>
            <h1>Web3Comunities</h1>
            <p>A Gated Web3 Community</p>
            <p>Endereço: {address}</p>
            <p>O seu balanço é: {formatUnits(balanceOf || BigInt(0), 18)} </p>
            <p>Você já convidou: {inviteCount?.toString() || 0} </p>

            {balanceOf && balanceOf > 0 ? (
                <div>
                    {!authenticated ? (
                        <div>
                            <h2>
                                Faça sua autenticação para ver seus posts
                                exclusivos e convidar novos usários
                            </h2>
                            <button onClick={login}>Autenticar</button>
                        </div>
                    ) : (
                        <div>
                            <div>Olá, {address}</div>
                            <InvitePanel address={address} />

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
            ) : (
                <div>
                    <h3>Você precisa ser convidado do fórum</h3>
                </div>
            )}
        </div>
    )
}
