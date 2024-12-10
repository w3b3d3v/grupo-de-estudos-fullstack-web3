import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'
import { useAccount } from 'wagmi'

import ConnectedHome from '../ConnectedHome'

export default function MainPanel() {
    const { address, isConnecting, isReconnecting } = useAccount()

    const loading = isConnecting || isReconnecting

    if (!address) {
        return (
            <Flex justifyContent='center' p='8'>
                <Heading as='h3' size='lg'>
                    Conecte-se sua carteira para acessar a Web3 Communities
                </Heading>
            </Flex>
        )
    }

    if (loading) {
        return (
            <Flex justifyContent='center' p='8'>
                Conectando...
            </Flex>
        )
    }

    return <ConnectedHome address={address} />
}
