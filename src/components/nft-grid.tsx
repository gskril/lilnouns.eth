import { useEffect } from 'react'
import abi from '../utils/abi.json'
import { useContractRead } from 'wagmi'
import { Nft, NftGrid } from '../utils/types'
import { Typography } from '@ensdomains/thorin'

export default function Gallery({ nfts, tokenId, setTokenId }: NftGrid) {
  const nftsIds = nfts?.map((nft) => nft.tokenId)

  const { data: domains } = useContractRead({
    addressOrName: '0x27c4f6ff6935537c9cc05f4eb40e666d8f328918',
    contractInterface: abi,
    functionName: 'getTokensDomains',
    args: [nftsIds],
    chainId: 1,
  })

  // Add domains to nfts if already claimed
  useEffect(() => {
    if (domains) {
      nfts?.forEach((nft, index) => {
        nft.domain = domains[index]
      })
    }
  }, [nfts, domains])

  return (
    <div className="nfts">
      {nfts &&
        nfts.map((nft: Nft) => (
          <div
            className={'nft' + (nft.tokenId === tokenId ? ' selected' : '')}
            key={nft.tokenId}
            onClick={() => setTokenId(nft.tokenId)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="nft__image" src={nft.image} alt={nft.name} />
            <Typography
              as="p"
              style={{
                lineBreak: 'anywhere',
              }}
            >
              {nft?.domain}
            </Typography>
          </div>
        ))}
    </div>
  )
}
