export const CURRENCIES = {
  KES: {
    symbol: 'KES',
    name: 'Kenyan Shilling',
    decimals: 2,
    icon: '🇰🇪',
  },
  USD: {
    symbol: 'USD',
    name: 'US Dollar',
    decimals: 2,
    icon: '💵',
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    icon: '⟠',
  },
} as const;

export const LOAN_TERMS = [
  { months: 3, label: '3 Months', apr: 12 },
  { months: 6, label: '6 Months', apr: 15 },
  { months: 12, label: '12 Months', apr: 18 },
  { months: 24, label: '24 Months', apr: 22 },
] as const;

export const CREDIT_SCORE_RANGES = {
  EXCELLENT: { min: 800, max: 850, color: 'text-green-600' },
  GOOD: { min: 740, max: 799, color: 'text-blue-600' },
  FAIR: { min: 670, max: 739, color: 'text-yellow-600' },
  POOR: { min: 580, max: 669, color: 'text-orange-600' },
  BAD: { min: 300, max: 579, color: 'text-red-600' },
} as const;

export const MPESA_SHORTCODE = '174379';
export const MPESA_PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';