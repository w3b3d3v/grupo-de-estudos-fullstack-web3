import Head from 'next/head'

import dynamic from 'next/dynamic'
import CustomConnectButton from '@/components/CustomConnectButton'

const MainPanel = dynamic(() => import('@/components/MainPanel'), {
    ssr: false,
})

export default function Home() {
    return (
        <>
            <Head>
                <title>Web3Comunities</title>
                <meta name='description' content='A Gated Web3 Community' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div>
                <CustomConnectButton />
                <MainPanel />
            </div>
        </>
    )
}
