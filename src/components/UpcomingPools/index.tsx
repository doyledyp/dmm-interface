import React from 'react'
import { useMedia } from 'react-use'
import { Flex } from 'rebass'
import { Trans } from '@lingui/macro'

import RainMakerBannel from 'assets/images/rain-maker.png'
import RainMakerMobileBanner from 'assets/images/rain-maker-mobile.png'
import { AdContainer, ClickableText } from 'components/YieldPools/styleds'
import { TableHeader } from './styled'

const UpcomingPools = () => {
  const lgBreakpoint = useMedia('(min-width: 992px)')

  const renderHeader = () => {
    return (
      <TableHeader>
        <Flex grid-area="pools" alignItems="center" justifyContent="flex-start">
          <ClickableText>
            <Trans>Pools</Trans>
          </ClickableText>
        </Flex>

        <Flex grid-area="liq" alignItems="center" justifyContent="flex-center">
          <ClickableText>
            <Trans>Starting In</Trans>
          </ClickableText>
        </Flex>

        <Flex grid-area="end" alignItems="right" justifyContent="flex-end">
          <ClickableText>
            <Trans>Rewards</Trans>
          </ClickableText>
        </Flex>

        <Flex grid-area="apy" alignItems="center" justifyContent="flex-end">
          <ClickableText>
            <Trans>Information</Trans>
          </ClickableText>
        </Flex>
      </TableHeader>
    )
  }

  return (
    <>
      <AdContainer>
        <img src={lgBreakpoint ? RainMakerBannel : RainMakerMobileBanner} alt="RainMaker" width="100%" />
      </AdContainer>

      {renderHeader()}
    </>
  )
}

export default UpcomingPools
