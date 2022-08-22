export type Nft = {
  name: string
  tokenId: number
  image: string
}

export type TokenId = number | null

export type NftGrid = {
  nfts: Nft[] | undefined
  tokenId: TokenId
  setTokenId: (tokenId: number) => void
}
