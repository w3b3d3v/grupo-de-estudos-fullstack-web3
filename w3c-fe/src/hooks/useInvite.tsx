/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'

import { WEB3DEV_TOKEN_ABI } from '@/ABI/Web3DevTokenABI'
import { W3CTOKEN_ADDRESS } from '@/constants'
import { config } from '@/providers/RainbowKit'

type InviteTxnState =
    | 'IDLE'
    | 'WAITING_SIGNATURE'
    | 'ERROR'
    | 'WAITING_TXN_RECEIPT'

export default function useInvite() {
    const [inviteTxnState, setInviteTxnState] = useState<InviteTxnState>('IDLE')
    const [invitedAddress, setInvitedAddress] = useState('')
    const { writeContractAsync } = useWriteContract()

    const handleInvitedAddressChange = (value: string) => {
        const regex = new RegExp(/^[a-zA-Z0-9]*$/)
        const isNextValueValid = regex.test(value)

        if (!isNextValueValid) return

        setInvitedAddress(value)
    }

    const handleInvite = async () => {
        try {
            setInviteTxnState('WAITING_SIGNATURE')
            const txnHash = await writeContractAsync({
                address: W3CTOKEN_ADDRESS,
                abi: WEB3DEV_TOKEN_ABI,
                functionName: 'invite',
                args: [invitedAddress as Address],
            })

            setInviteTxnState('WAITING_TXN_RECEIPT')

            await new Promise((resolve) => setTimeout(resolve, 5000))

            const txnReceipt = await waitForTransactionReceipt(config, {
                hash: txnHash,
            })

            if (txnReceipt.status === 'reverted') {
                console.log('logs', txnReceipt.logs)
                throw Error('Transaction reverted')
            }

            setInvitedAddress('')
            setInviteTxnState('IDLE')
            toast('Convite enviado com sucesso', { type: 'success' })

            console.log('txnHash', txnHash)
        } catch (err: any) {
            setInviteTxnState('ERROR')
            toast(`Erro ao enviar convite ${err?.message}`, { type: 'error' })
            console.error('err', err)
        }
    }

    return {
        inviteTxnState,
        invitedAddress,
        handleInvitedAddressChange,
        handleInvite,
    }
}
