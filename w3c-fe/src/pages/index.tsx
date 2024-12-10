import Head from 'next/head'

import dynamic from 'next/dynamic'
import Header from '@/components/Header'

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
                <Header />
                <MainPanel />
            </div>
        </>
    )
}
