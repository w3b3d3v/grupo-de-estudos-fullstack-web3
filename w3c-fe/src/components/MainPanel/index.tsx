import React from 'react'

import { useAccount } from 'wagmi'

import CustomConnectButton from '../CustomConnectButton'
import ConnectedHome from '../ConnectedHome'

// localhost/api/posts/0x123 -> returna posts do 0x123
// assinar msg -> decoficaiar msg pra pegar endereço (0x456)

// localhost/api/posts -> return 0x456

export default function MainPanel() {
    const { address, isConnecting, isReconnecting } = useAccount() // address -> conectado | !address -> nao conectado | loading->

    const loading = isConnecting || isReconnecting

    if (!address) {
        return (
            <div>
                <h1>Conecte-se para acessar o forum</h1>
                <CustomConnectButton />
            </div>
        )
    }

    if (loading) {
        return <div>Conectando...</div>
    }

    return <ConnectedHome address={address} />
}
