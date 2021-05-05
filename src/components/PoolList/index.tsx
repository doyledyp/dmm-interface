import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import { JSBI, Pair } from 'libs/sdk/src'
import { ChevronUp, ChevronDown } from 'react-feather'
import { useMedia } from 'react-use'

import { ButtonEmpty } from 'components/Button'
import InfoHelper from 'components/InfoHelper'
import { SubgraphPoolData, UserLiquidityPosition } from 'state/pools/hooks'
import { getHealthFactor } from 'utils/dmm'
import ListItem, { ItemCard } from './ListItem'
import PoolDetailModal from './PoolDetailModal'

const TableHeader = styled.div<{ fade?: boolean; oddRow?: boolean }>`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(8, 1fr) 1fr;
  grid-template-areas: 'pool ratio liq vol';
  padding: 15px 36px 13px 26px;
  font-size: 12px;
  align-items: center;
  height: fit-content;
  position: relative;
  opacity: ${({ fade }) => (fade ? '0.6' : '1')};
  background-color: ${({ theme }) => theme.evenRow};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`

const ClickableText = styled(Text)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text6};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  text-transform: uppercase;
`

const LoadMoreButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.oddRow};
  font-size: 12px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    background-color: transparent;
  `};
`

const getOneYearFL = (liquidity: string, feeOneDay?: string): number => {
  return !feeOneDay || parseFloat(liquidity) === 0 ? 0 : (parseFloat(feeOneDay) * 365 * 100) / parseFloat(liquidity)
}

interface PoolListProps {
  poolsList: (Pair | null)[]
  subgraphPoolsData: SubgraphPoolData[]
  userLiquidityPositions: UserLiquidityPosition[]
  maxItems?: number
}

const SORT_FIELD = {
  NONE: -1,
  LIQ: 0,
  VOL: 1,
  FEES: 2,
  ONE_YEAR_FL: 3
}

const PoolList = ({ poolsList, subgraphPoolsData, userLiquidityPositions, maxItems = 10 }: PoolListProps) => {
  const { t } = useTranslation()
  const above1200 = useMedia('(min-width: 1200px)') // Extra large screen

  const transformedSubgraphPoolsData: {
    [key: string]: SubgraphPoolData
  } = {}

  const transformedUserLiquidityPositions: {
    [key: string]: UserLiquidityPosition
  } = {}

  subgraphPoolsData.forEach(data => {
    transformedSubgraphPoolsData[data.id] = data
  })

  userLiquidityPositions.forEach(position => {
    transformedUserLiquidityPositions[position.pool.id] = position
  })

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.NONE)

  const sortList = (poolA: Pair | null, poolB: Pair | null): number => {
    if (sortedColumn === SORT_FIELD.NONE) {
      if (!poolA) {
        return 1
      }

      if (!poolB) {
        return -1
      }

      // Pool with AMP = 1 will be on top
      // AMP from contract is 10000 (real value is 1)
      if (JSBI.equal(poolA.amp, JSBI.BigInt(10000))) {
        return -1
      }

      if (JSBI.equal(poolB.amp, JSBI.BigInt(10000))) {
        return 1
      }

      const poolAHealthFactor = getHealthFactor(poolA)
      const poolBHealthFactor = getHealthFactor(poolB)

      // Pool with better health factor will be prioritized higher
      if (poolAHealthFactor.greaterThan(poolBHealthFactor)) {
        return -1
      }

      if (poolAHealthFactor.lessThan(poolBHealthFactor)) {
        return 1
      }

      return 0
    }

    const poolASubgraphData = transformedSubgraphPoolsData[(poolA as Pair).address.toLowerCase()]
    const poolBSubgraphData = transformedSubgraphPoolsData[(poolB as Pair).address.toLowerCase()]

    const feeA = poolASubgraphData?.oneDayFeeUSD
      ? poolASubgraphData?.oneDayFeeUSD
      : poolASubgraphData?.oneDayFeeUntracked

    const feeB = poolBSubgraphData?.oneDayFeeUSD
      ? poolBSubgraphData?.oneDayFeeUSD
      : poolBSubgraphData?.oneDayFeeUntracked

    switch (sortedColumn) {
      case SORT_FIELD.LIQ:
        return parseFloat(poolASubgraphData?.reserveUSD) > parseFloat(poolBSubgraphData?.reserveUSD)
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1
      case SORT_FIELD.VOL:
        const volumeA = poolASubgraphData?.oneDayVolumeUSD
          ? poolASubgraphData?.oneDayVolumeUSD
          : poolASubgraphData?.oneDayVolumeUntracked

        const volumeB = poolBSubgraphData?.oneDayVolumeUSD
          ? poolBSubgraphData?.oneDayVolumeUSD
          : poolBSubgraphData?.oneDayVolumeUntracked

        return parseFloat(volumeA) > parseFloat(volumeB) ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
      case SORT_FIELD.FEES:
        return parseFloat(feeA) > parseFloat(feeB) ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
      case SORT_FIELD.ONE_YEAR_FL:
        const oneYearFLPoolA = getOneYearFL(poolASubgraphData?.reserveUSD, feeA)
        const oneYearFLPoolB = getOneYearFL(poolBSubgraphData?.reserveUSD, feeB)

        return oneYearFLPoolA > oneYearFLPoolB ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
      default:
        break
    }

    return 0
  }

  const renderHeader = () => {
    return above1200 ? (
      <TableHeader>
        <Flex alignItems="center" justifyContent="flexStart">
          <ClickableText>Pool</ClickableText>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText>Ratio</ClickableText>
          <InfoHelper
            text={
              'Current token pair ratio of the pool. Ratio changes depending on pool trades. Add liquidity according to this ratio.'
            }
          />
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText
            onClick={() => {
              setSortedColumn(SORT_FIELD.LIQ)
              setSortDirection(sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection)
            }}
          >
            Liquidity
            {sortedColumn === SORT_FIELD.LIQ ? (
              !sortDirection ? (
                <ChevronUp size="14" style={{ marginLeft: '2px' }} />
              ) : (
                <ChevronDown size="14" style={{ marginLeft: '2px' }} />
              )
            ) : (
              ''
            )}
          </ClickableText>
        </Flex>
        <Flex alignItems="center">
          <ClickableText
            onClick={() => {
              setSortedColumn(SORT_FIELD.VOL)
              setSortDirection(sortedColumn !== SORT_FIELD.VOL ? true : !sortDirection)
            }}
          >
            Volume (24h)
            {sortedColumn === SORT_FIELD.VOL ? (
              !sortDirection ? (
                <ChevronUp size="14" style={{ marginLeft: '2px' }} />
              ) : (
                <ChevronDown size="14" style={{ marginLeft: '2px' }} />
              )
            ) : (
              ''
            )}
          </ClickableText>
        </Flex>

        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText
            onClick={() => {
              setSortedColumn(SORT_FIELD.FEES)
              setSortDirection(sortedColumn !== SORT_FIELD.FEES ? true : !sortDirection)
            }}
          >
            Fee (24h)
            {sortedColumn === SORT_FIELD.FEES ? (
              !sortDirection ? (
                <ChevronUp size="14" style={{ marginLeft: '2px' }} />
              ) : (
                <ChevronDown size="14" style={{ marginLeft: '2px' }} />
              )
            ) : (
              ''
            )}
          </ClickableText>
        </Flex>

        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText>AMP</ClickableText>
          <InfoHelper
            text={
              'Amplification Factor. Higher AMP, higher capital efficiency within a price range. Higher AMP recommended for more stable pairs, lower AMP for more volatile pairs.'
            }
          />
        </Flex>

        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText
            onClick={() => {
              setSortedColumn(SORT_FIELD.ONE_YEAR_FL)
              setSortDirection(sortedColumn !== SORT_FIELD.ONE_YEAR_FL ? true : !sortDirection)
            }}
          >
            1y F/L
            {sortedColumn === SORT_FIELD.ONE_YEAR_FL ? (
              !sortDirection ? (
                <ChevronUp size="14" style={{ marginLeft: '2px' }} />
              ) : (
                <ChevronDown size="14" style={{ marginLeft: '2px' }} />
              )
            ) : (
              ''
            )}
          </ClickableText>
          <InfoHelper text={'1Yr Fees Collected/Liquidity based on 24H volume annualized'} />
        </Flex>

        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText>My liquidity</ClickableText>
        </Flex>

        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText>Add liquidity</ClickableText>
        </Flex>
      </TableHeader>
    ) : null
  }

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [poolsList])

  const pools = useMemo(() => {
    return poolsList
      .map(pair => pair) // Clone to a new array to prevent "in-place" sort that mutate the poolsList
      .sort(sortList)
  }, [poolsList, sortedColumn, sortDirection])

  useEffect(() => {
    if (poolsList) {
      let extraPages = 1
      if (Object.keys(poolsList).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(poolsList).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, poolsList])

  return (
    <div>
      {renderHeader()}
      {pools.slice(0, page * ITEMS_PER_PAGE).map((pool, index) => {
        if (pool && transformedSubgraphPoolsData[pool.address.toLowerCase()]) {
          return above1200 ? (
            <ListItem
              key={pool.address}
              pool={pool}
              subgraphPoolData={transformedSubgraphPoolsData[pool.address.toLowerCase()]}
              myLiquidity={transformedUserLiquidityPositions[pool.address.toLowerCase()]}
              oddRow={(index + 1) % 2 !== 0}
            />
          ) : (
            <ItemCard
              key={pool.address}
              pool={pool}
              subgraphPoolData={transformedSubgraphPoolsData[pool.address.toLowerCase()]}
              myLiquidity={transformedUserLiquidityPositions[pool.address.toLowerCase()]}
              oddRow={(index + 1) % 2 !== 0}
            />
          )
        }

        return null
      })}
      <LoadMoreButtonContainer>
        <ButtonEmpty
          onClick={() => {
            setPage(page === maxPage ? page : page + 1)
          }}
          disabled={page >= maxPage}
        >
          {t('showMorePools')}
        </ButtonEmpty>
      </LoadMoreButtonContainer>
      <PoolDetailModal />
    </div>
  )
}

export default PoolList
