/* eslint-disable @typescript-eslint/no-explicit-any */
import { Post } from '@/pages/api/posts'
import axios, { AxiosInstance } from 'axios'
import { Address } from 'viem'
import { getAccount } from 'wagmi/actions'
import { config } from '@/providers/RainbowKit'
import { handleLogout } from '@/providers/AuthContext'

const localUrl = 'http://localhost:3000/api'

const apiInstance = axios.create({
    baseURL: localUrl,
})

apiInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error: any) => {
        console.log('hioo')
        if (!error?.response) {
            return Promise.reject(error)
        }

        if (error.response.status === 401) {
            const { address } = getAccount(config)
            if (!address) return
            handleLogout()
        }
        return Promise.reject(error)
    },
)

export default class Api {
    api: AxiosInstance

    constructor() {
        this.api = apiInstance
    }

    setAuthToken(jwt: string) {
        this.api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
    }

    fetchJwtUsingSignature = async (
        address: Address,
        signature: string,
    ): Promise<string | null> => {
        try {
            const response = await this.api.post<{ token: string }>('/login', {
                address,
                signature,
            })

            const { token } = response.data

            return token
        } catch (err) {
            console.error(err)
            return null
        }
    }

    fetchPosts = async (
        address: Address,
    ): Promise<{
        posts: Post[]
        error: string | null
    }> => {
        try {
            const response = await this.api.post<{
                posts: Post[]
                error: string | null
            }>('/posts', {
                address,
            })

            const { posts, error } = response.data

            if (error) throw Error(error)

            return { posts, error }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err)
            return { posts: [], error: err?.message || 'Error fetching posts' }
        }
    }
}
