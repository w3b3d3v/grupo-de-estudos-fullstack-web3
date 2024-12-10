import React from 'react'

import CustomConnectButton from '../CustomConnectButton'
import { Box, ButtonGroup, Flex, Heading, Spacer } from '@chakra-ui/react'

export default function Header() {
    return (
        <Flex
            minWidth='max-content'
            alignItems='center'
            gap='2'
            p='6'
            borderBottom='1px solid gray'
        >
            <Box p='2'>
                <Heading size='md' color='teal.300'>
                    Web3 Communities{' '}
                </Heading>
            </Box>
            <Spacer />
            <ButtonGroup gap='2'>
                <CustomConnectButton />
            </ButtonGroup>
        </Flex>
    )
}
