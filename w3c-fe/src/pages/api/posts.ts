// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MESSAGE_TO_BE_SIGNED, W3CTOKEN_ADDRESS } from '@/constants'
import { localChain } from '@/providers/RainbowKit'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
    Address,
    createPublicClient,
    erc20Abi,
    http,
    verifyMessage,
} from 'viem'

type Post = {
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
        const { address, signature } = JSON.parse(req.body)

        console.log('p', req.body, address, signature)

        if (!address || !signature) {
            res.status(400).json({
                posts: [],
                error: 'Missing address or signature',
            })
        }

        const isSignedByAddress = await verifyMessage({
            message: MESSAGE_TO_BE_SIGNED,
            signature: signature,
            address: address,
        })

        if (!isSignedByAddress) {
            res.status(400).json({
                posts: [],
                error: 'Invalid signature',
            })
        }

        const publicClient = createPublicClient({
            chain: localChain,
            transport: http(),
        })

        const balanceOf = await publicClient.readContract({
            abi: erc20Abi,
            address: W3CTOKEN_ADDRESS,
            functionName: 'balanceOf',
            args: [address as Address],
        })

        console.log('balanceOf', balanceOf)

        if (balanceOf === BigInt(0)) {
            res.status(400).json({
                posts: [],
                error: 'No balance',
            })
        }

        res.status(200).json({ posts: MOCK_POSTS, error: null })
    }
}
