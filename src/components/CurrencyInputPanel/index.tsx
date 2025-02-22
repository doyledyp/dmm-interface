import { Currency, Pair } from 'libs/sdk/src'
import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { t, Trans } from '@lingui/macro'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useActiveWeb3React } from '../../hooks'
import { AutoColumn } from '../Column'
import Card from '../Card'
import { useCurrencyConvertedToNative } from 'utils/dmm'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.primary1)};
    stroke-width: 1.5px;
  }
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? theme.bg1 : theme.bg1)};
  border: 1px solid ${({ theme, selected }) => (selected ? 'transparent' : theme.primary1)} !important;
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.primary1)};
  border-radius: 12px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
    color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  }
  :hover ${StyledDropDown}, :focus ${StyledDropDown} {
    path {
      stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
      stroke-width: 1.5px;
    }
  }
`
const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme, hideInput }) => (hideInput ? 'transparent' : theme.bg2)};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 8px;
  border: 1px solid ${({ theme, hideInput }) => (hideInput ? 'transparent' : theme.bg2)};
  background-color: ${({ theme, hideInput }) => (hideInput ? 'transparent' : theme.bg1)};
`

const StyledTokenName = styled.span<{ active?: boolean; fontSize?: string }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size: ${({ active, fontSize }) => (fontSize ? fontSize : active ? '20px' : '16px')};
`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

const Card2 = styled(Card)<{ balancePosition: string }>`
  padding: 0 0.75rem 0.4rem 0.75rem;
  text-align: ${({ balancePosition }) => `${balancePosition}`};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  balancePosition?: string
  hideLogo?: boolean
  fontSize?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  balancePosition = 'right',
  hideLogo = false,
  fontSize
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const nativeCurrency = useCurrencyConvertedToNative(currency || undefined)

  return (
    <div style={{ width: '100%' }}>
      {account && (
        <Card2 padding={'.4rem .75rem 0 .75rem'} borderRadius={'20px'} balancePosition={balancePosition}>
          <AutoColumn gap="4px">
            <TYPE.body
              onClick={onMax}
              color={theme.text2}
              fontWeight={500}
              fontSize={14}
              style={{ display: 'inline', cursor: `${label !== 'To' ? 'pointer' : 'initial'}` }}
            >
              {(!hideBalance && !!currency && !!selectedCurrencyBalance && customBalanceText) ??
                t`Balance: ${selectedCurrencyBalance?.toSignificant(10)}`}
            </TYPE.body>
          </AutoColumn>
        </Card2>
      )}
      <InputPanel id={id} hideInput={hideInput}>
        <Container hideInput={hideInput}>
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
            {!hideInput && (
              <>
                <NumericalInput
                  className="token-amount-input"
                  value={value}
                  onUserInput={val => {
                    onUserInput(val)
                  }}
                />
                {account && currency && showMaxButton && label !== 'To' && (
                  <StyledBalanceMax onClick={onMax}>
                    <Trans>MAX</Trans>
                  </StyledBalanceMax>
                )}
              </>
            )}
            <CurrencySelect
              selected={!!currency}
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencySelect) {
                  setModalOpen(true)
                }
              }}
            >
              <Aligner>
                {hideLogo ? null : pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
                ) : currency ? (
                  <CurrencyLogo currency={currency || undefined} size={'24px'} />
                ) : null}
                {pair ? (
                  <StyledTokenName className="pair-name-container">
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </StyledTokenName>
                ) : (
                  <StyledTokenName
                    className="token-symbol-container"
                    active={Boolean(currency && currency.symbol)}
                    fontSize={fontSize}
                  >
                    {(nativeCurrency && nativeCurrency.symbol && nativeCurrency.symbol.length > 20
                      ? nativeCurrency.symbol.slice(0, 4) +
                        '...' +
                        nativeCurrency.symbol.slice(nativeCurrency.symbol.length - 5, nativeCurrency.symbol.length)
                      : nativeCurrency?.symbol) || <Trans>Select a token</Trans>}
                  </StyledTokenName>
                )}
                {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
              </Aligner>
            </CurrencySelect>
          </InputRow>
        </Container>
        {!disableCurrencySelect && onCurrencySelect && (
          <CurrencySearchModal
            isOpen={modalOpen}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onCurrencySelect}
            selectedCurrency={currency}
            otherSelectedCurrency={otherCurrency}
            showCommonBases={showCommonBases}
          />
        )}
      </InputPanel>
    </div>
  )
}
