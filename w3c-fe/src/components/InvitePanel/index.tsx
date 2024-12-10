import React, { useMemo } from 'react'
import { Address, isAddress } from 'viem'

import { useInvite } from '@/hooks'

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

    const buttonText = useMemo(() => {
        if (inviteTxnState === 'WAITING_SIGNATURE')
            return 'Confirme a transação na carteira'
        if (inviteTxnState === 'WAITING_TXN_RECEIPT')
            return 'Aguardando a confirmação da transação'

        return 'Convidar'
    }, [inviteTxnState])

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
                <p>loading.... Aguarde a confirmação da transação</p>
            )}
            <button
                onClick={handleInvite}
                disabled={
                    !isAddress(invitedAddress) ||
                    isTryingToInviteItself ||
                    DISABLED_STATES.includes(inviteTxnState)
                }
            >
                {buttonText}
            </button>
        </div>
    )
}
