export const ChainId = {
  BASE: 8453,
  SOLANA: 792703809,
  ETHEREUM: 1,
  SEPOLIA: 11155111,
  LOCALHARDHAT: 31337,
  POLYGON: 137,
  SONIC: 146,
};

export const supportedDestinationChains = [
  ChainId.BASE,
  ChainId.SOLANA,
  ChainId.ETHEREUM,
  ChainId.POLYGON,
  ChainId.SONIC,
  ChainId.SEPOLIA,
  ChainId.LOCALHARDHAT,
];

export type ChainIdType = (typeof ChainId)[keyof typeof ChainId];

export const Token = {
  // Base tokens
  USDC: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  ETH: "0x0000000000000000000000000000000000000000",
  CBBTC: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
  // Solana tokens
  SOL: "11111111111111111111111111111111",
  SOL_USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  TRUMP: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
  // Ethereum tokens
  MAINNET_ETH: "0x0000000000000000000000000000000000000000",
  MAINNET_USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  MAINNET_USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  // Polygon tokens
  POLYGON_USDC: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  POLYGON_USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  POLYGON: "0x0000000000000000000000000000000000000000",
  // Sonic tokens
  SONIC_USDC: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",
  SONIC: "0x0000000000000000000000000000000000000000",
  // Sepolia testnet tokens
  SEPOLIA_USDC: "0x7a1C5Ee7461ab2790Aa9A93017fFCf789B785D12",
  // Local hardhat tokens
  LOCALHARDHAT_USDC: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
};

export type TokenType = (typeof Token)[keyof typeof Token];

function getTokens(): string[] {
  const tokens = [
    // Base tokens
    Token.USDC,
    Token.ETH,
    Token.CBBTC,
    // Solana tokens
    Token.SOL,
    Token.SOL_USDC,
    Token.TRUMP,
    // Ethereum tokens
    Token.MAINNET_ETH,
    Token.MAINNET_USDC,
    Token.MAINNET_USDT,
    // Polygon tokens
    Token.POLYGON_USDC,
    Token.POLYGON_USDT,
    Token.POLYGON,
    // Sonic tokens
    Token.SONIC_USDC,
    Token.SONIC,
    // Sepolia testnet tokens
    Token.SEPOLIA_USDC,
    // Local hardhat tokens
    Token.LOCALHARDHAT_USDC,
  ];

  return tokens;
}

export const tokens = getTokens();

export interface TokenData {
  name: string;
  tokenDecimals: number;
  ticker: string;
}

export const tokenInfo: Record<number, Record<TokenType, TokenData>> = {
  // Base tokens
  [ChainId.BASE]: {
    [Token.USDC]: {
      name: "USD Coin",
      tokenDecimals: 6,
      ticker: "USDC",
    },
    [Token.ETH]: {
      name: "Ethereum",
      tokenDecimals: 18,
      ticker: "ETH",
    },
    [Token.CBBTC]: {
      name: "Coinbase Wrapped BTC",
      tokenDecimals: 8,
      ticker: "CBBTC",
    },
  },

  // Solana tokens
  [ChainId.SOLANA]: {
    [Token.SOL]: {
      name: "Solana",
      tokenDecimals: 9,
      ticker: "SOL",
    },
    [Token.SOL_USDC]: {
      name: "USDC",
      tokenDecimals: 6,
      ticker: "USDC",
    },
    [Token.TRUMP]: {
      name: "Official Trump",
      tokenDecimals: 6,
      ticker: "TRUMP",
    },
  },

  // Ethereum tokens
  [ChainId.ETHEREUM]: {
    [Token.MAINNET_ETH]: {
      name: "Ethereum",
      tokenDecimals: 18,
      ticker: "ETH",
    },
    [Token.MAINNET_USDC]: {
      name: "USD Coin",
      tokenDecimals: 6,
      ticker: "USDC",
    },
    [Token.MAINNET_USDT]: {
      name: "Tether USD",
      tokenDecimals: 6,
      ticker: "USDT",
    },
  },

  // Polygon tokens
  [ChainId.POLYGON]: {
    [Token.POLYGON_USDC]: {
      name: "USD Coin",
      tokenDecimals: 6,
      ticker: "USDC",
    },
    [Token.POLYGON_USDT]: {
      name: "Tether USD",
      tokenDecimals: 6,
      ticker: "USDT",
    },
    [Token.POLYGON]: {
      name: "Polygon",
      tokenDecimals: 18,
      ticker: "POLYGON",
    },
  },

  // Sonic tokens
  [ChainId.SONIC]: {
    [Token.SONIC_USDC]: {
      name: "Bridged USDC (Sonic)",
      tokenDecimals: 6,
      ticker: "USDC",
    },
    [Token.SONIC]: {
      name: "Sonic",
      tokenDecimals: 18,
      ticker: "SONIC",
    },
  },

  // Sepolia testnet tokens
  [ChainId.SEPOLIA]: {
    [Token.SEPOLIA_USDC]: {
      name: "USD Coin",
      tokenDecimals: 6,
      ticker: "USDC",
    },
  },

  // Local hardhat tokens
  [ChainId.LOCALHARDHAT]: {
    [Token.LOCALHARDHAT_USDC]: {
      name: "USD Coin",
      tokenDecimals: 6,
      ticker: "USDC",
    },
  },
};
