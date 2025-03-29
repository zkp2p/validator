export const Currency = {
  AED: "AED",
  ARS: "ARS",
  AUD: "AUD",
  CAD: "CAD",
  CHF: "CHF",
  CNY: "CNY",
  EUR: "EUR",
  GBP: "GBP",
  HKD: "HKD",
  IDR: "IDR",
  ILS: "ILS",
  JPY: "JPY",
  KES: "KES",
  MXN: "MXN",
  MYR: "MYR",
  NZD: "NZD",
  PLN: "PLN",
  SAR: "SAR",
  SGD: "SGD",
  THB: "THB",
  TRY: "TRY",
  USD: "USD",
  VND: "VND",
  ZAR: "ZAR",
};

export type CurrencyType = (typeof Currency)[keyof typeof Currency];

function getCurrencies(): string[] {
  return Object.values(Currency);
}

export function getCurrencyInfoFromCountryCode(countryCode: string): CurrencyData | null {
  return Object.values(currencyInfo).find((currency) => currency.countryCode === countryCode) ?? null;
}

export function isSupportedCurrency(currencyCode: string): boolean {
  return Object.values(currencyInfo).some((currency) => currency.currencyCode === currencyCode);
}

export const currencies = getCurrencies();

interface CurrencyData {
  currency: CurrencyType;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  countryCode: string;
}

export const currencyInfo: Record<CurrencyType, CurrencyData> = {
  [Currency.AED]: {
    currency: Currency.AED,
    currencyCode: "AED",
    currencyName: "United Arab Emirates Dirham",
    currencySymbol: "د.إ",
    countryCode: "ae",
  },
  [Currency.ARS]: {
    currency: Currency.ARS,
    currencyCode: "ARS",
    currencyName: "Argentine Peso",
    currencySymbol: "$",
    countryCode: "ar",
  },
  [Currency.AUD]: {
    currency: Currency.AUD,
    currencyCode: "AUD",
    currencyName: "Australian Dollar",
    currencySymbol: "A$",
    countryCode: "au",
  },
  [Currency.CAD]: {
    currency: Currency.CAD,
    currencyCode: "CAD",
    currencyName: "Canadian Dollar",
    currencySymbol: "C$",
    countryCode: "ca",
  },
  [Currency.CHF]: {
    currency: Currency.CHF,
    currencyCode: "CHF",
    currencyName: "Swiss Franc",
    currencySymbol: "Fr",
    countryCode: "ch",
  },
  [Currency.CNY]: {
    currency: Currency.CNY,
    currencyCode: "CNY",
    currencyName: "Chinese Yuan",
    currencySymbol: "¥",
    countryCode: "cn",
  },
  [Currency.EUR]: {
    currency: Currency.EUR,
    currencyCode: "EUR",
    currencyName: "Euro",
    currencySymbol: "€",
    countryCode: "eu",
  },
  [Currency.GBP]: {
    currency: Currency.GBP,
    currencyCode: "GBP",
    currencyName: "British Pound",
    currencySymbol: "£",
    countryCode: "gb",
  },
  [Currency.HKD]: {
    currency: Currency.HKD,
    currencyCode: "HKD",
    currencyName: "Hong Kong Dollar",
    currencySymbol: "HK$",
    countryCode: "hk",
  },
  [Currency.IDR]: {
    currency: Currency.IDR,
    currencyCode: "IDR",
    currencyName: "Indonesian Rupiah",
    currencySymbol: "Rp",
    countryCode: "id",
  },
  [Currency.ILS]: {
    currency: Currency.ILS,
    currencyCode: "ILS",
    currencyName: "Israeli New Shekel",
    currencySymbol: "₪",
    countryCode: "il",
  },
  [Currency.JPY]: {
    currency: Currency.JPY,
    currencyCode: "JPY",
    currencyName: "Japanese Yen",
    currencySymbol: "¥",
    countryCode: "jp",
  },
  [Currency.KES]: {
    currency: Currency.KES,
    currencyCode: "KES",
    currencyName: "Kenyan Shilling",
    currencySymbol: "KSh",
    countryCode: "ke",
  },
  [Currency.MXN]: {
    currency: Currency.MXN,
    currencyCode: "MXN",
    currencyName: "Mexican Peso",
    currencySymbol: "$",
    countryCode: "mx",
  },
  [Currency.MYR]: {
    currency: Currency.MYR,
    currencyCode: "MYR",
    currencyName: "Malaysian Ringgit",
    currencySymbol: "RM",
    countryCode: "my",
  },
  [Currency.NZD]: {
    currency: Currency.NZD,
    currencyCode: "NZD",
    currencyName: "New Zealand Dollar",
    currencySymbol: "NZ$",
    countryCode: "nz",
  },
  [Currency.PLN]: {
    currency: Currency.PLN,
    currencyCode: "PLN",
    currencyName: "Polish Złoty",
    currencySymbol: "zł",
    countryCode: "pl",
  },
  [Currency.SAR]: {
    currency: Currency.SAR,
    currencyCode: "SAR",
    currencyName: "Saudi Riyal",
    currencySymbol: "﷼",
    countryCode: "sa",
  },
  [Currency.SGD]: {
    currency: Currency.SGD,
    currencyCode: "SGD",
    currencyName: "Singapore Dollar",
    currencySymbol: "S$",
    countryCode: "sg",
  },
  [Currency.THB]: {
    currency: Currency.THB,
    currencyCode: "THB",
    currencyName: "Thai Baht",
    currencySymbol: "฿",
    countryCode: "th",
  },
  [Currency.TRY]: {
    currency: Currency.TRY,
    currencyCode: "TRY",
    currencyName: "Turkish Lira",
    currencySymbol: "₺",
    countryCode: "tr",
  },
  [Currency.USD]: {
    currency: Currency.USD,
    currencyCode: "USD",
    currencyName: "United States Dollar",
    currencySymbol: "$",
    countryCode: "us",
  },
  [Currency.VND]: {
    currency: Currency.VND,
    currencyCode: "VND",
    currencyName: "Vietnamese Dong",
    currencySymbol: "₫",
    countryCode: "vn",
  },
  [Currency.ZAR]: {
    currency: Currency.ZAR,
    currencyCode: "ZAR",
    currencyName: "South African Rand",
    currencySymbol: "R",
    countryCode: "za",
  },
};
