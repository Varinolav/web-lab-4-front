import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type {ItemDto, PriceTimeSeriesDto} from '../services/api';

interface InventoryItemCardProps {
    item: ItemDto;
    viewMode: 'grid' | 'list';
    onSelect: (item: ItemDto) => void;
    onDeselect: () => void;
    onClick?: (item: ItemDto) => void;
}

const STEAM_IMAGE_BASE_URL = 'https://steamcommunity-a.akamaihd.net/economy/image/';

export default function InventoryItemCard({
                                              item,
                                              viewMode,
                                              onSelect,
                                              onDeselect,
                                              onClick,
                                          }: InventoryItemCardProps) {
    const { t } = useTranslation();
    const [price, setPrice] = useState<number | null>(null);
    const [priceHistory, setPriceHistory] = useState<PriceTimeSeriesDto[]>([]);
    const [priceLoading, setPriceLoading] = useState(false);
    
    const itemName = item.marketHashName || item.name || t('dashboard.unknownItem');
    const itemType = item.type || t('dashboard.item');
    const imageUrl = item.iconUrl ? `${STEAM_IMAGE_BASE_URL}${item.iconUrl}` : null;

    useEffect(() => {
        const fetchPriceData = async () => {
            if (!item.marketHashName) {
                setPrice(null);
                setPriceHistory([]);
                return;
            }

            try {
                setPriceLoading(true);
                const [fetchedPrice, history] = await Promise.all([
                    apiService.getPrice(item.marketHashName),
                    apiService.getPriceHistory(item.marketHashName),
                ]);
                setPrice(fetchedPrice);
                setPriceHistory(history);
            } catch (error) {
                console.error('Failed to fetch price data:', error);
                setPrice(null);
                setPriceHistory([]);
            } finally {
                setPriceLoading(false);
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

    const handleMouseEnter = () => {
        onSelect(item);
    };

    const handleMouseLeave = () => {
        onDeselect();
    };

    const handleClick = () => {
        if (onClick) {
            onClick(item);
        }
    };


    if (viewMode === 'grid') {
        return (
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                className="flex flex-col gap-3 pb-3 rounded-lg border border-transparent hover:border-primary/50 cursor-pointer p-2 transition-colors bg-surface-dark/50 hover:bg-surface-dark"
            >
                {imageUrl ? (
                    <div
                        className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg bg-[#000]/20"
                        style={{backgroundImage: `url("${imageUrl}")`}}
                    />
                ) : (
                    <div className="w-full bg-surface-dark aspect-[4/3] rounded-lg flex items-center justify-center">
                        <span className="text-white/30 text-xs">{t('dashboard.noImage')}</span>
                    </div>
                )}
                <div>
                    <p className="text-white text-base font-medium leading-normal truncate">{itemName}</p>
                    <p className="text-text-muted text-sm font-normal leading-normal">{itemType}</p>
                    <div className="flex items-center gap-1">
                        <p className="text-white text-sm font-medium leading-normal">
                            {priceLoading ? '...' : formatCurrency(price)}
                        </p>
                        {!priceLoading && priceHistory.length > 1 ? (
                            <p className={`text-sm font-medium leading-normal flex items-center ${
                                priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                                ({priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%{' '}
                                <span className={`material-symbols-outlined text-sm ${
                                    priceChange >= 0 ? '' : 'rotate-180'
                                }`}>
                                    arrow_upward
                                </span>)
                            </p>
                        ) : (
                            <p className="text-green-400 text-sm font-medium leading-normal flex items-center">
                                (N/A <span className="material-symbols-outlined text-sm">arrow_upward</span>)
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // List view
    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-primary/50 cursor-pointer transition-colors bg-surface-dark/50 hover:bg-surface-dark"
        >
            {imageUrl ? (
                <div
                    className="w-16 h-12 bg-center bg-no-repeat bg-cover rounded-lg bg-[#000]/20 flex-shrink-0"
                    style={{backgroundImage: `url("${imageUrl}")`}}
                />
            ) : (
                <div className="w-16 h-12 bg-surface-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white/30 text-xs">{t('dashboard.noImage')}</span>
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-white text-base font-medium leading-normal truncate">{itemName}</p>
                <p className="text-text-muted text-sm font-normal leading-normal">{itemType}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <p className="text-white text-sm font-medium leading-normal">
                    {priceLoading ? '...' : formatCurrency(price)}
                </p>
                {!priceLoading && priceHistory.length > 1 ? (
                    <p className={`text-sm font-medium leading-normal flex items-center ${
                        priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                        ({priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%{' '}
                        <span className={`material-symbols-outlined text-sm ${
                            priceChange >= 0 ? '' : 'rotate-180'
                        }`}>
                            arrow_upward
                        </span>)
                    </p>
                ) : (
                    <p className="text-green-400 text-sm font-medium leading-normal flex items-center">
                        (N/A <span className="material-symbols-outlined text-sm">arrow_upward</span>)
                    </p>
                )}
            </div>
        </div>
    );
}