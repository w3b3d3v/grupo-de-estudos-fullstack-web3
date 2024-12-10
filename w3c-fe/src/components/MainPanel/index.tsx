import React from 'react'

import { useAccount } from 'wagmi'

import ConnectedHome from '../ConnectedHome'

export default function MainPanel() {
    const { address, isConnecting, isReconnecting } = useAccount()

    const loading = isConnecting || isReconnecting

    if (!address) {
        return (
            <div>
                <h1>Conecte-se para acessar o forum</h1>
            </div>
        )
    }

    if (loading) {
        return <div>Conectando...</div>
    }

    return <ConnectedHome address={address} />
}
