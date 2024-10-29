// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
    Address,
    createPublicClient,
    erc20Abi,
    http,
    verifyMessage,
} from 'viem'
import jwt from 'jsonwebtoken'

import { MESSAGE_TO_BE_SIGNED, W3CTOKEN_ADDRESS } from '@/constants'
import { localChain } from '@/providers/RainbowKit'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'POST') {
        // receber um assinatura e address
        const { address, signature } = JSON.parse(req.body)

        if (!address || !signature) {
            return res.status(400).json({ error: 'Request invalido' })
        }

        //verificar se a assinatura é valida
        const isSignedByAddress = await verifyMessage({
            message: MESSAGE_TO_BE_SIGNED,
            signature: signature,
            address: address,
        })

        // se nao for valida -> 401
        if (!isSignedByAddress) {
            return res.status(401).json({ error: 'Assinatura invalida' })
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

        // se nao tiver balance -> 401
        if (balanceOf === BigInt(0)) {
            return res.status(401).json({ error: 'Sem balance' })
        }

        //checar balance > 0

        const token = jwt.sign({ address }, process.env.SECRET || '', {
            expiresIn: '1h',
        })

        return res.status(200).json({ token })
    }
}
