import { createContext, useEffect, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { Address } from 'viem'

import { localStorageService } from '@/services/localStorage'
import { api } from '@/pages/_app'
import { MESSAGE_TO_BE_SIGNED } from '@/constants'
import { toast } from 'react-toastify'

type AuthContextType = {
    authenticated: boolean
    login: () => Promise<void>
}

type AuthProviderProps = {
    children: React.ReactNode
    // address: Address
}

let logoutCallback: (() => void) | null = null

const setLogoutCallback = (callback: () => void) => {
    logoutCallback = callback
}

export const handleLogout = () => {
    if (logoutCallback) {
        logoutCallback()
    }
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children }: AuthProviderProps) {
    const { address } = useAccount()
    const [authenticated, setAuthenticated] = useState(false)
    const { signMessageAsync } = useSignMessage()

    useEffect(() => {
        if (!address) {
            setAuthenticated(false)
            return
        }

        const token = localStorageService.getToken(address)
        console.log('token', token)
        if (!token) return
        api.setAuthToken(token)
        setAuthenticated(true)
    }, [address])

    useEffect(() => {
        // Register the logout callback when the provider mounts
        setLogoutCallback(() => {
            setAuthenticated(false)
            localStorageService.cleanToken(address as Address)
            api.setAuthToken('')
            toast('Autenticação expirada, logue novamente. ', {
                type: 'error',
            })
        })
    }, [address])

    async function login() {
        try {
            if (!address) {
                setAuthenticated(false)
                return
            }

            const signedMessage = await signMessageAsync({
                message: MESSAGE_TO_BE_SIGNED,
            })
            const token = await api.fetchJwtUsingSignature(
                address,
                signedMessage,
            )
            if (!token) throw Error('Token not found')
            localStorageService.setToken(address, token)
            api.setAuthToken(token)
            setAuthenticated(true)
            toast('Autenticado com sucesso', {
                type: 'success',
            })
            console.log('token', token)
        } catch (err) {
            setAuthenticated(false)
            console.error(err)
        }
    }

    return (
        <AuthContext.Provider value={{ authenticated, login }}>
            {children}
        </AuthContext.Provider>
    )
}
