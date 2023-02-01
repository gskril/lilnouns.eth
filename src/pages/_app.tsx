import React from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from 'styled-components'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'

import type { AppProps } from 'next/app'
import '../styles/globals.css'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import PlausibleProvider from 'next-plausible'

const { chains, provider } = configureChains(
  [chain.mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '' }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'lilnouns.eth',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <ThorinGlobalStyles />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <PlausibleProvider domain={'lil.domains'} trackOutboundLinks>
            <Component {...pageProps} />
          </PlausibleProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}
