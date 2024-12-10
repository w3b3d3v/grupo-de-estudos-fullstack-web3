/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { Address, isAddress } from 'viem'

import { useInvite } from '@/hooks'
import {
    Button,
    Flex,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
} from '@chakra-ui/react'

const MAX_ETH_ADDRESS_LENGTH = 42

type InvitePanelProps = {
    address: Address
}

const DISABLED_STATES = ['WAITING_SIGNATURE', 'WAITING_TXN_RECEIPT']

export default function InvitePanel({ address }: InvitePanelProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()

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
        <>
            <Button onClick={onOpen} bgColor='teal.300'>
                Convidar
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalContent bgColor='gray.800' color='white'>
                    <ModalHeader color='white'>Convidar endereço</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {inviteTxnState === 'WAITING_TXN_RECEIPT' ? (
                            <Flex
                                align='center'
                                p={8}
                                flexDirection='column'
                                gap={8}
                            >
                                <Spinner size='xl' />
                                <Heading as='p' size='xs'>
                                    Processando transação
                                </Heading>
                            </Flex>
                        ) : (
                            <Flex
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    rowGap: '1rem',
                                    maxWidth: '30rem',
                                    paddingTop: '1rem',
                                }}
                            >
                                <Heading as='p' size='xs'>
                                    Endereço
                                </Heading>
                                <Input
                                    placeholder='Endereço a ser convidado'
                                    value={invitedAddress}
                                    maxLength={MAX_ETH_ADDRESS_LENGTH}
                                    onChange={handleInvitedAddressChange}
                                    isInvalid={
                                        !!invitedAddress &&
                                        !isAddress(invitedAddress)
                                    }
                                />
                                {isTryingToInviteItself && (
                                    <p>Você não pode convidar o seu endereço</p>
                                )}
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter justifyContent='space-between'>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Fechar
                        </Button>
                        <Button
                            colorScheme='teal'
                            onClick={handleInvite}
                            disabled={
                                !isAddress(invitedAddress) ||
                                isTryingToInviteItself ||
                                DISABLED_STATES.includes(inviteTxnState)
                            }
                        >
                            {buttonText}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
