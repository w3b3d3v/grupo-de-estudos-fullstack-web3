import type { AppProps } from 'next/app'

import Api from '@/services/api'

import { ChakraProvider, RainbowKitUIProvider } from '@/providers'
import AuthProvider from '@/providers/AuthContext'
import Toast from '@/lib/toastify'

export const api = new Api()

export default function App({ Component, pageProps }: AppProps) {
    return (
        <RainbowKitUIProvider>
            <ChakraProvider>
                <AuthProvider>
                    <Toast />
                    <Component {...pageProps} />
                </AuthProvider>
            </ChakraProvider>
        </RainbowKitUIProvider>
    )
}
