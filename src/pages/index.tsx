import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Heading, Input, Profile } from '@ensdomains/thorin'
import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import MainButton from '../components/connect-button'

const Home: NextPage = () => {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({
    address,
  })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleFormSubmit(event: any) {
    // Check if wallet is connected
    // Check if wallet has 1 lil noun
    // If wallet has > 1 lil noun, let them choose which one to use
    // If wallet has 0 lil nouns, throw an error and redirect to https://lilnouns.wtf/
    // Confetti noggles on success
  }

  return (
    <>
      <Head>
        <title>lilnouns.eth</title>
        <meta property="og:title" content="lilnouns.eth" />
        <meta name="description" content="Claim your lilnouns.eth subdomain" />
        <meta
          property="og:description"
          content="Claim your lilnouns.eth subdomain"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lilnounsdao" />
        <meta name="twitter:creator" content="@gregskril" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {mounted && address && (
        <div className="ens-profile">
          <Profile
            address={address}
            ensName={ensName || ''}
            dropdownItems={[
              {
                label: 'Disconnect',
                onClick: () => disconnect(),
                color: 'red',
              },
            ]}
          />
        </div>
      )}

      <main className="wrapper">
        <div className="container">
          <Heading className="title" level="1" align="center">
            lilnouns.eth subdomain claim
          </Heading>
          <form
            className="claim"
            onClick={async (e) => {
              e.preventDefault()
              await handleFormSubmit(e.target)
            }}
          >
            <Input
              label=""
              placeholder="gregskril"
              maxLength={42}
              spellCheck={false}
              autoCapitalize="none"
              suffix=".lilnouns.eth"
              size="large"
            />
            <MainButton />
          </form>
        </div>
      </main>
    </>
  )
}

export default Home
