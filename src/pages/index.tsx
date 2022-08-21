import type { NextPage } from 'next'
import Head from 'next/head'
import { Button, Heading, Input } from '@ensdomains/thorin'

const Home: NextPage = () => {
  async function handleFormSubmit(name: string) {
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
      <main className="wrapper">
        <div className="container">
          <Heading className="title" level="1" align="center">
            lilnouns.eth subdomain claim
          </Heading>
          <form
            className="claim"
            onClick={(e) => {
              e.preventDefault()
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
            <Button variant="action">Claim</Button>
          </form>
        </div>
      </main>
    </>
  )
}

export default Home
