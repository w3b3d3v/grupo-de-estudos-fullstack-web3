import React from 'react'
import { Address, formatUnits } from 'viem'

import InvitePanel from '../InvitePanel'
import { useAuth, usePosts, useWeb3Token } from '@/hooks'
import { Box, Button, Flex, Heading } from '@chakra-ui/react'

type ConnectedHomeProps = {
    address: Address
}

export default function ConnectedHome({ address }: ConnectedHomeProps) {
    const { authenticated, login } = useAuth()
    const { balanceOf, inviteCount, name } = useWeb3Token({ address })
    const { posts } = usePosts({ address, authenticated })

    return (
        <Flex p='8' align='center' flexDirection='column' gap={8}>
            <Heading as='h3' size='lg' color='teal.300'>
                Bem vindo
            </Heading>
            <Flex
                border='1px solid'
                borderColor={'teal.300'}
                flexDirection='column'
                p={5}
                borderRadius={4}
                gap={2}
            >
                <p>
                    <strong>Endereço</strong> {address}
                </p>
                <p>
                    <strong>Balanço</strong>{' '}
                    {formatUnits(balanceOf || BigInt(0), 18)} {name}
                </p>
                <p>
                    <strong>Convites</strong> {inviteCount?.toString() || 0}{' '}
                </p>
                {authenticated && (
                    <Flex justify='center' p={4}>
                        <InvitePanel address={address} />
                    </Flex>
                )}
            </Flex>

            {balanceOf && balanceOf > 0 ? (
                <Box>
                    {!authenticated ? (
                        <Flex flexDirection='column' gap={5} align='center'>
                            <Heading as='h2' size='md' textAlign='center'>
                                Faça sua autenticação para ver seus posts
                                exclusivos e convidar novos usários
                            </Heading>
                            <Button
                                colorScheme='teal'
                                onClick={login}
                                maxW='10rem'
                            >
                                Autenticar
                            </Button>
                        </Flex>
                    ) : (
                        <Box>
                            <Flex flexDirection='column' align='center' p={4}>
                                {posts.length === 0 ? (
                                    <Box>
                                        <Heading as='p' size='mg'>
                                            Nenhum post disponivel
                                        </Heading>
                                    </Box>
                                ) : (
                                    <Flex flexDirection='column' gap={8}>
                                        <Heading
                                            as='h1'
                                            size='lg'
                                            color='teal.300'
                                            textAlign='center'
                                        >
                                            Posts exclusivos para você
                                        </Heading>
                                        {posts.map((post) => (
                                            <Flex
                                                flexDir='column'
                                                key={post.id}
                                                gap={1}
                                            >
                                                <Heading as='h5' size='md'>
                                                    {post.title}
                                                </Heading>
                                                <p>{post.description}</p>
                                                <Button
                                                    colorScheme='teal'
                                                    size='xs'
                                                    width='5rem'
                                                >
                                                    Ver mais
                                                </Button>
                                            </Flex>
                                        ))}
                                    </Flex>
                                )}
                            </Flex>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box>
                    <Heading size='md'>
                        Você precisa ser convidado do fórum para acessar os
                        posts
                    </Heading>
                </Box>
            )}
        </Flex>
    )
}
