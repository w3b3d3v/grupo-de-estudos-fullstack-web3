import { Address } from 'viem'

export const localStorageService = {
    setToken: (address: Address, token: string) => {
        if (typeof window !== undefined) {
            localStorage.setItem(`jwt-${address}`, token)
        }
    },

    getToken: (address: Address) => {
        if (typeof window !== undefined) {
            return localStorage.getItem(`jwt-${address}`)
        }
        return null
    },

    cleanToken: (address: Address) => {
        if (typeof window !== undefined) {
            localStorage.removeItem(`jwt-${address}`)
        }
    },

    // clearToken: (address: Address) => {}
}
