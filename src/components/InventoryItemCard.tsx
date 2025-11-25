import { useTranslation } from 'react-i18next';
import type {ItemDto} from '../services/api';

interface InventoryItemCardProps {
    item: ItemDto;
    viewMode: 'grid' | 'list';
    onSelect: (item: ItemDto) => void;
    onDeselect: () => void;
}

const STEAM_IMAGE_BASE_URL = 'https://steamcommunity-a.akamaihd.net/economy/image/';

export default function InventoryItemCard({
                                              item,
                                              viewMode,
                                              onSelect,
                                              onDeselect,
                                          }: InventoryItemCardProps) {
    const { t } = useTranslation();
    const itemName = item.marketHashName || item.name || t('dashboard.unknownItem');
    const itemType = item.type || t('dashboard.item');
    const imageUrl = item.iconUrl ? `${STEAM_IMAGE_BASE_URL}${item.iconUrl}` : null;

    const handleMouseEnter = () => {
        onSelect(item);
    };

    const handleMouseLeave = () => {
        onDeselect();
    };


    if (viewMode === 'grid') {
        return (
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
                        <p className="text-white text-sm font-medium leading-normal">$0.00</p>
                        <p className="text-green-400 text-sm font-medium leading-normal flex items-center">
                            (N/A <span className="material-symbols-outlined text-sm">arrow_upward</span>)
                        </p>
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
                <p className="text-white text-sm font-medium leading-normal">$0.00</p>
                <p className="text-green-400 text-sm font-medium leading-normal flex items-center">
                    (N/A <span className="material-symbols-outlined text-sm">arrow_upward</span>)
                </p>
            </div>
        </div>
    );
}

