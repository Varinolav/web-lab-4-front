import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { ItemDto, PriceTimeSeriesDto } from '../services/api';
import PriceChart from './PriceChart';

interface ItemDetailModalProps {
  item: ItemDto;
  onClose: () => void;
}

const STEAM_IMAGE_BASE_URL = 'https://steamcommunity-a.akamaihd.net/economy/image/';

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const { t } = useTranslation();
  const [priceHistory, setPriceHistory] = useState<PriceTimeSeriesDto[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemName = item.marketHashName || item.name || t('dashboard.unknownItem');
  const itemType = item.type || t('dashboard.item');
  const imageUrl = item.iconUrl ? `${STEAM_IMAGE_BASE_URL}${item.iconUrl}` : null;

  useEffect(() => {
    const fetchPriceData = async () => {
      if (!item.marketHashName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch current price and price history in parallel
        const [price, history] = await Promise.all([
          apiService.getPrice(item.marketHashName),
          apiService.getPriceHistory(item.marketHashName),
        ]);

        setCurrentPrice(price);
        setPriceHistory(history);
      } catch (err) {
        console.error('Failed to fetch price data:', err);
        setError('Failed to load price data');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [item.marketHashName]);

  // Calculate price change (first vs last price in history)
  const priceChange = priceHistory.length > 1
    ? ((priceHistory[priceHistory.length - 1].price - priceHistory[0].price) / priceHistory[0].price) * 100
    : 0;

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + ' RUB';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background-dark rounded-lg border border-border-dark shadow-2xl m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-surface-dark hover:bg-surface-dark/80 text-white transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Content */}
        <div className="flex flex-col gap-6 p-6">
          {/* Item header */}
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <div
                className="w-24 h-16 bg-center bg-no-repeat bg-contain flex-shrink-0"
                style={{ backgroundImage: `url("${imageUrl}")` }}
              />
            ) : (
              <div className="w-24 h-16 bg-surface-dark rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white/30 text-xs">{t('dashboard.noImage')}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-2xl font-bold leading-tight truncate">{itemName}</h2>
              <p className="text-text-muted text-base">{itemType}</p>
            </div>
          </div>

          {/* Price info */}
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-base font-medium leading-normal">{t('dashboard.itemDetail.priceHistory')}</p>
            <div className="flex items-baseline gap-3">
              <p className="text-white tracking-light text-4xl font-bold leading-tight">
                {loading ? '...' : formatCurrency(currentPrice)}
              </p>
              {!loading && priceHistory.length > 1 && (
                <p className={`text-base font-medium leading-normal flex items-center gap-1 ${
                  priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  <span className={`material-symbols-outlined text-sm ${
                    priceChange >= 0 ? '' : 'rotate-180'
                  }`}>
                    arrow_upward
                  </span>
                </p>
              )}
            </div>
            <div className="flex gap-1">
              <p className="text-text-muted text-base font-normal leading-normal">{t('dashboard.itemDetail.last30Days')}</p>
              {!loading && priceHistory.length > 0 && (
                <p className="text-green-400 text-base font-medium leading-normal">
                  {priceHistory.length} data points
                </p>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="w-full">
            {loading ? (
              <div className="flex items-center justify-center rounded-lg bg-surface-dark" style={{ height: '400px' }}>
                <p className="text-text-muted">Loading price history...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center rounded-lg bg-surface-dark" style={{ height: '400px' }}>
                <p className="text-red-400">{error}</p>
              </div>
            ) : (
              <PriceChart data={priceHistory} height={400} />
            )}
          </div>

          {/* Additional details */}
          <div className="border-t border-border-dark pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{t('dashboard.itemDetail.floatValue')}</span>
              <span className="text-white">N/A</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{t('dashboard.itemDetail.patternIndex')}</span>
              <span className="text-white">N/A</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{t('dashboard.itemDetail.steamMarket')}</span>
              <a
                className="text-primary hover:underline"
                href={`https://steamcommunity.com/market/listings/730/${encodeURIComponent(item.marketHashName || item.name || '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('dashboard.itemDetail.view')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

