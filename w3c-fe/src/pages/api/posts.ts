// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export type Post = {
    id: string
    title: string
    description: string
}

type Data = {
    posts: Post[]
    error: string | null
}

const MOCK_POSTS = [
    {
        id: '1',
        title: 'Understanding Smart Contracts',
        description:
            'A comprehensive guide on what smart contracts are, how they work, and their importance in decentralized applications.',
    },
    {
        id: '2',
        title: 'Intro to Solidity Programming',
        description:
            'Learn the basics of Solidity, the programming language used to develop smart contracts on Ethereum.',
    },
    {
        id: '3',
        title: 'Deploying an ERC20 Token',
        description:
            'Step-by-step instructions to deploy your own ERC20 token using OpenZeppelin and Hardhat.',
    },
    {
        id: '4',
        title: 'Web3 Frontend with React and Wagmi',
        description:
            'Explore how to build Web3 applications using React and Wagmi, and interact with Ethereum-based smart contracts.',
    },
]

// http://localhost:3000/api/hello

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    if (req.method === 'POST') {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                posts: [],
                error: 'Missing token',
            })
        }

        try {
            const decodedToken = jwt.verify(
                token,
                process.env.SECRET || '',
            ) as jwt.JwtPayload
            console.log('decodedToken', decodedToken)

            const { address } = decodedToken

            if (!address) {
                res.status(400).json({
                    posts: [],
                    error: 'Missing address',
                })
            }

            res.status(200).json({ posts: MOCK_POSTS, error: null })
        } catch (error: unknown) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    posts: [],
                    error: 'Token expired',
                })
            } else if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    posts: [],
                    error: 'Invalid token',
                })
            }

            // Handle any other unexpected errors
            return res.status(500).json({
                posts: [],
                error: 'Internal server error',
            })
        }
    }
}
