import type { AppProps } from 'next/app'

import RainbowKitProvider from '@/providers/RainbowKit'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <RainbowKitProvider>
            <Component {...pageProps} />
        </RainbowKitProvider>
    )
}
