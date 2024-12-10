import { useCallback, useEffect, useState } from 'react'
import { Address } from 'viem'

import { api } from '@/pages/_app'
import { Post } from '@/pages/api/posts'

export default function usePosts({
    address,
    authenticated,
}: {
    address: Address
    authenticated: boolean
}) {
    const [posts, setPosts] = useState<Post[]>([])

    const fetchPosts = useCallback(async () => {
        try {
            if (!authenticated) {
                console.error('Not authed')
                return
            }

            const response = await api.fetchPosts(address)

            const { posts, error } = response

            if (error) {
                console.error(error)
                return
            }

            console.log('posts', posts)
            setPosts(posts)
        } catch (err) {
            console.error(err)
            // @TODO: handle error
        }
    }, [address, authenticated])

    useEffect(() => {
        if (!authenticated) return
        fetchPosts()

        return () => setPosts([])
    }, [authenticated, fetchPosts])

    // useEffect(() => {
    //     setPosts([])
    // }, [address])

    return { posts, fetchPosts }
}
