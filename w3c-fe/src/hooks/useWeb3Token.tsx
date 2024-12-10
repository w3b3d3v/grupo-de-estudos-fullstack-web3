import { useEffect } from 'react'
import { Address } from 'viem'
import { useBlockNumber, useReadContract } from 'wagmi'

import { WEB3DEV_TOKEN_ABI } from '@/ABI/Web3DevTokenABI'
import { W3CTOKEN_ADDRESS } from '@/constants'
import { queryClient } from '@/providers/RainbowKit'

export default function useWeb3Token({ address }: { address: Address }) {
    const { data: blockNumber } = useBlockNumber({ watch: true })

    // const web3TokenConfig = {
    //     abi: WEB3DEV_TOKEN_ABI,
    //     address: W3CTOKEN_ADDRESS,
    // } as const

    // const { data } = useReadContracts({
    //     contracts: [
    //         {
    //             ...web3TokenConfig,
    //             functionName: 'balanceOf',
    //             args: [address as Address],
    //         },
    //         {
    //             ...web3TokenConfig,
    //             functionName: 'getInviteCount',
    //             args: [address as Address],
    //         },
    //     ],
    // })

    // const [balanceOf, inviteCount] = data

    const {
        data: balanceOf,
        error,
        queryKey,
    } = useReadContract({
        abi: WEB3DEV_TOKEN_ABI,
        address: W3CTOKEN_ADDRESS,
        functionName: 'balanceOf',
        args: [address as Address],
    })

    const { data: inviteCount, queryKey: inviteCountQueryKey } =
        useReadContract({
            abi: WEB3DEV_TOKEN_ABI,
            address: W3CTOKEN_ADDRESS,
            functionName: 'getInviteCount',
            args: [address as Address],
        })

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey })
        queryClient.invalidateQueries({ queryKey: inviteCountQueryKey })
    }, [blockNumber, queryKey, inviteCountQueryKey])

    return {
        balanceOf: balanceOf,
        inviteCount: inviteCount,
        error: error,
    }
}
