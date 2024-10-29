import { WEB3DEV_TOKEN_ABI } from '@/ABI/Web3DevTokenABI'
import { W3CTOKEN_ADDRESS } from '@/constants'
import React, { useState } from 'react'
import { Address, isAddress } from 'viem'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { config } from '@/providers/RainbowKit'

const MAX_ETH_ADDRESS_LENGTH = 42

type InvitePanelProps = {
    address: Address
}

const DISABLED_STATES = ['WAITING_SIGNATURE', 'WAITING_TXN_RECEIPT']

export default function InvitePanel({ address }: InvitePanelProps) {
    const {
        invitedAddress,
        inviteTxnState,
        handleInvitedAddressChange,
        handleInvite,
    } = useInvite()

    const isTryingToInviteItself =
        invitedAddress.toLowerCase() === address.toLowerCase()

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: '1rem',
                maxWidth: '30rem',
                paddingTop: '1rem',
            }}
        >
            <input
                value={invitedAddress}
                maxLength={MAX_ETH_ADDRESS_LENGTH}
                onChange={(e: any) =>
                    handleInvitedAddressChange(e.target.value)
                }
            />
            {isTryingToInviteItself && (
                <p>Você não pode convidar o seu endereço</p>
            )}
            {inviteTxnState === 'WAITING_TXN_RECEIPT' && (
                <p>Aguarde a confirmação da transação</p>
            )}
            <button
                onClick={handleInvite}
                disabled={
                    !isAddress(invitedAddress) ||
                    isTryingToInviteItself ||
                    DISABLED_STATES.includes(inviteTxnState)
                }
            >
                Convidar
            </button>
        </div>
    )
}

// STATES: IDLE | WAITING_SIGNATURE | ERROR | WAITING_TXN_RECEIPT  | TXN_SUCCESFULL

type InviteTxnState =
    | 'IDLE'
    | 'WAITING_SIGNATURE'
    | 'ERROR'
    | 'WAITING_TXN_RECEIPT'
// | 'TXN_SUCCESFULL'

function useInvite() {
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
            alert('Convite enviado com sucesso')

            console.log('txnHash', txnHash)
        } catch (err: any) {
            setInviteTxnState('ERROR')
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
