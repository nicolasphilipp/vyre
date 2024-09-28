export interface AdaData {
    eur: number;
    eur_24h_change: number;
    eur_24h_vol: number;
    eur_market_cap: number;
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap: number;
    last_updated_at: number;
}

export interface AdaInfo {
    id: string;
    name: string;
    symbol: string;
    image: ImageUrls;
    market_data: string;
}

export interface ImageUrls {
    small: string;
    thumb: string;
}

export interface MarketData {
    current_price: CurrencyPrice;
    market_cap: CurrencyPrice;
    total_volume: CurrencyPrice;
}

export interface CurrencyPrice {
    eur: number;
    gbp: number;
    usd: number;
}

export interface HistoricalAdaData {
    prices: number[][];
    market_caps: number[][];
    total_volumes: number[][];
}