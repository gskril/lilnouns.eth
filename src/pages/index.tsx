import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Heading, Input, Profile } from '@ensdomains/thorin'
import { useAccount, useContractWrite, useDisconnect, useEnsName } from 'wagmi'
import MainButton from '../components/connect-button'
import abi from '../utils/abi.json'
import { Nfts, TokenId } from '../utils/types'
import toast, { Toaster } from 'react-hot-toast'

const Home: NextPage = () => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({
    address,
  })

  const [name, setName] = useState('')
  const [tokenId, setTokenId] = useState<TokenId>(null)
  const [lilnouns, setLilnouns] = useState<Nfts[]>()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get owned lilnouns
  useEffect(() => {
    const fetchNfts = async () => {
      const opensea = await fetch(`
        https://api.opensea.io/api/v1/assets?owner=${address}&collection=lil-nouns&limit=50
      `)
      const nfts = await opensea.json()
      setLilnouns(
        nfts.assets.map((nft: any) => {
          return {
            name: nft.name,
            tokenId: nft.token_id,
          }
        })
      )
    }
    if (address) fetchNfts()
  }, [address])

  // Set tokenId of owned lilnoun
  useEffect(() => {
    if (lilnouns) {
      setTokenId(lilnouns[0].tokenId)
    }
  }, [lilnouns])

  const claim = useContractWrite({
    addressOrName: '0x27c4f6ff6935537c9cc05f4eb40e666d8f328918',
    contractInterface: abi,
    functionName: 'claimSubdomain',
    chainId: 1,
    args: [name, Number(tokenId)],
    mode: 'recklesslyUnprepared',
    onError: (error) => {
      const errMsg: string = error.message

      if (errMsg.includes('Not authorised')) {
        toast.error("You don't own a Lil Noun")
      } else if (errMsg.includes('sub-domain already exists')) {
        toast.error(`${name}.lilnouns.eth already exists`)
      } else if (errMsg.includes('user rejected transaction')) {
        toast.error('Transaction rejected')
      } else {
        toast.error(errMsg)
      }
    },
  })

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
            onSubmit={(e) => {
              e.preventDefault()
              claim.write?.()
            }}
          >
            <Input
              label=""
              name="name"
              placeholder="gregskril"
              maxLength={42}
              spellCheck={false}
              autoCapitalize="none"
              suffix=".lilnouns.eth"
              size="large"
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
            <MainButton />
          </form>
        </div>
      </main>
      <Toaster position="bottom-center" />
    </>
  )
}

export default Home
