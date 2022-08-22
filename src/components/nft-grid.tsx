import { Nft, NftGrid } from '../utils/types'

export default function Gallery({ nfts, tokenId, setTokenId }: NftGrid) {
  return (
    <div className="nfts">
      {nfts &&
        nfts.map((nft: Nft) => (
          <>
            <div
              className={'nft' + (nft.tokenId === tokenId ? ' selected' : '')}
              key={nft.tokenId}
              onClick={() => setTokenId(nft.tokenId)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="nft__image" src={nft.image} alt={nft.name} />
            </div>
          </>
        ))}
    </div>
  )
}
