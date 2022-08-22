import { Button } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const MainButton = (props: any) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        if (!connected) {
          return (
            <Button variant="action" onClick={openConnectModal} type="button">
              Connect Wallet
            </Button>
          )
        } else {
          return (
            <Button variant="action" type="submit" {...props}>
              Claim
            </Button>
          )
        }
      }}
    </ConnectButton.Custom>
  )
}

export default MainButton
