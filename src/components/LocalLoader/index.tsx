import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useDarkModeManager } from '../../state/user/hooks'

const pulse = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

const Wrapper = styled.div<{ fill?: boolean; height?: string }>`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  ${props =>
    props.fill && !props.height
      ? css`
          height: 100vh;
        `
      : css`
          height: 180px;
        `}
`

const AnimatedImg = styled.div`
  animation: ${pulse} 800ms linear infinite;
  & > * {
    width: 72px;
  }
`

interface LocalLoaderProps {
  fill?: boolean
}

const LocalLoader = ({ fill }: LocalLoaderProps) => {
  const [darkMode] = useDarkModeManager()

  return (
    <Wrapper fill={fill}>
      <AnimatedImg>
        <img
          src={require(darkMode ? '../../assets/svg/logo_white.svg' : '../../assets/svg/logo.svg')}
          alt="loading-icon"
        />
      </AnimatedImg>
    </Wrapper>
  )
}

export default LocalLoader
