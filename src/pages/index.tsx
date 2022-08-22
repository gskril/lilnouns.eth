import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Dialog, Heading, Input, Profile } from '@ensdomains/thorin'
import {
  useAccount,
  useContractWrite,
  useDisconnect,
  useEnsName,
  useWaitForTransaction,
} from 'wagmi'
import MainButton from '../components/connect-button'
import abi from '../utils/abi.json'
import { Nft, TokenId } from '../utils/types'
import toast, { Toaster } from 'react-hot-toast'
import Gallery from '../components/nft-grid'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const Home: NextPage = () => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({
    address,
  })

  const [name, setName] = useState('')
  const [tokenId, setTokenId] = useState<TokenId>(null)
  const [lilnouns, setLilnouns] = useState<Nft[]>()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [isRegistered, setIsRegistered] = useState<boolean>(false)

  const { width: windowWidth, height: windowHeight } = useWindowSize()

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
            image: nft.image_url,
          }
        })
      )
    }
    if (address) fetchNfts()
  }, [address])

  // Set tokenId of owned lilnoun if the connected wallet owns just 1
  useEffect(() => {
    if (lilnouns && lilnouns.length > 0) {
      setTokenId(lilnouns[0].tokenId)
    }
  }, [lilnouns])

  const claim = useContractWrite({
    addressOrName: '0x27c4f6ff6935537c9cc05f4eb40e666d8f328918',
    contractInterface: abi,
    functionName: 'claimSubdomain',
    chainId: 1,
    args: [name, tokenId],
    mode: 'recklesslyUnprepared',
    onError: (error) => {
      const errMsg: string = error.message

      if (errMsg.includes('Not authorised')) {
        toast.error("You don't own a Lil Noun")
      } else if (errMsg.includes('sub-domain already exists')) {
        toast.error(`${name}.lilnouns.eth already exists`)
      } else if (errMsg.includes('user rejected transaction')) {
        toast.error('Transaction rejected')
      } else if (errMsg.includes('Token has already been set')) {
        toast.error('A name has already been claimed for this token', {
          style: {
            maxWidth: '100%',
          },
        })
      } else {
        const errReason = errMsg.split('(reason="')[1].split('", method=')[0]
        toast.error(errReason, {
          style: {
            maxWidth: '100%',
          },
        })
      }
    },
  })

  const waitForClaim = useWaitForTransaction({
    chainId: 1,
    hash: claim?.data?.hash,
    onSuccess: (res) => {
      const didFail = res.status === 0
      if (didFail) {
        toast.error('Registration failed')
      } else {
        toast.success('Your name has been registered!')
        setIsRegistered(true)
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

      {isRegistered && (
        <Confetti
          width={windowWidth}
          height={windowHeight}
          colors={['#44BCFO', '#7298F8', '#A099FF', '#DE82FF', '#7F6AFF']}
          style={{ zIndex: '1000' }}
        />
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
              if (claim.data) return
              if (lilnouns && lilnouns?.length === 1) {
                claim.write?.()
              } else {
                setOpenDialog(true)
              }
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
            <MainButton
              disabled={!tokenId}
              isLoading={claim.data && !isRegistered}
              txHash={claim.data?.hash}
              claimText="You don't have a Lil Noun :/"
            />
          </form>
        </div>
      </main>

      <Dialog
        open={openDialog}
        title="Which Lil Noun do you want to use?"
        variant="closable"
        onDismiss={() => setOpenDialog(false)}
      >
        <Gallery nfts={lilnouns} tokenId={tokenId} setTokenId={setTokenId} />
        <MainButton
          isLoading={claim.data && !isRegistered}
          txHash={claim.data?.hash}
          onClick={() => {
            if (claim.data) return
            claim.write?.()
          }}
        />
      </Dialog>

      <Toaster position="bottom-center" />
    </>
  )
}

export default Home
