import React from 'react'
import '@rainbow-me/rainbowkit/styles.css'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'

import { WagmiProvider } from 'wagmi'
import { arbitrum, base, localhost } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

export const localChain = {
    ...localhost,
    id: 31337,
}

const config = getDefaultConfig({
    appName: 'Web 3 Communties',
    chains: [base, arbitrum, localChain],
    projectId: 'ae835863ee28f9060bd789bb1f68f711',
})

const queryClient = new QueryClient()

type RainbowKitProps = {
    children: React.ReactNode
}

export default function RainbowKitUIProvider({ children }: RainbowKitProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
