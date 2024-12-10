import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'POST') {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is not valid' })
        }

        //@TODO: Implement proper check de malformand and expired token
        const decodedToken = jwt.verify(
            refreshToken,
            process.env.SECRET || '',
        ) as {
            address: string
            type: string
        }

        if (decodedToken.type !== 'refresh') {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const token = jwt.sign(
            { address: decodedToken.address },
            process.env.SECRET || '',
            {
                expiresIn: '30s',
            },
        )

        const newRefreshToken = jwt.sign(
            { address: decodedToken.address, type: 'refresh' },
            process.env.SECRET || '',
            {
                expiresIn: '3h',
            },
        )

        return res.status(200).json({ token, refreshToken: newRefreshToken })
    }
}
