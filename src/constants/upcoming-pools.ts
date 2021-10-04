import { ChainId } from 'libs/sdk/src'

export const UPCOMING_POOLS = {
  [ChainId.MAINNET]: [
    {
      poolToken1Symbol: 'XTK',
      poolToken1Address: '0x7F3EDcdD180Dbe4819Bd98FeE8929b5cEdB3AdEB',
      poolToken2Symbol: 'VNDC',
      poolToken2Address: '0x1F3F677Ecc58F6A1F9e2CF410dF4776a8546b5DE',
      startAt: '2021-10-07 16:00:00',
      rewards: ['0x1F3F677Ecc58F6A1F9e2CF410dF4776a8546b5DE', '0x7F3EDcdD180Dbe4819Bd98FeE8929b5cEdB3AdEB'],
      information: 'https://docs.dmm.exchange/rainmaker/FAQs/index.html'
    },
    {
      poolToken1Symbol: 'KNC',
      poolToken1Address: '0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202',
      poolToken2Symbol: 'ID',
      poolToken2Address: '0xEBd9D99A3982d547C5Bb4DB7E3b1F9F14b67Eb83',
      startAt: '2021-10-07 21:00:00',
      rewards: ['0xEBd9D99A3982d547C5Bb4DB7E3b1F9F14b67Eb83'],
      information: 'https://docs.dmm.exchange/rainmaker/FAQs/index.html'
    },
    {
      poolToken1Symbol: 'RICE',
      poolToken1Address: '0xBCD515D6C5de70D3A31D999A7FA6a299657De294',
      poolToken2Symbol: 'KNC',
      poolToken2Address: '0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202',
      startAt: '2021-10-07 21:00:00',
      rewards: ['0xBCD515D6C5de70D3A31D999A7FA6a299657De294', '0x6710c63432A2De02954fc0f851db07146a6c0312'],
      information: 'https://docs.dmm.exchange/rainmaker/FAQs/index.html'
    }
  ],
  [ChainId.ROPSTEN]: [],
  [ChainId.RINKEBY]: [],
  [ChainId.GÖRLI]: [],
  [ChainId.KOVAN]: [],
  [ChainId.MATIC]: [],
  [ChainId.MUMBAI]: [],
  [ChainId.BSCTESTNET]: [],
  [ChainId.BSCMAINNET]: [],
  [ChainId.AVAXTESTNET]: [],
  [ChainId.AVAXMAINNET]: []
}
