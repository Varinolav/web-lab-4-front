import { useTranslation } from 'react-i18next';
import InventoryItemCard from './InventoryItemCard';
import type {ItemDto} from '../services/api';

interface InventoryListProps {
    items: ItemDto[];
    viewMode: 'grid' | 'list';
    onItemSelect: (item: ItemDto) => void;
    onItemDeselect: () => void;
    searchQuery?: string;
}

export default function InventoryList({
                                          items,
                                          viewMode,
                                          onItemSelect,
                                          onItemDeselect,
                                          searchQuery = '',
                                      }: InventoryListProps) {
    const { t } = useTranslation();
    if (items.length === 0) {
        return (
            <div className="col-span-full text-center text-white/70 py-10">
                {searchQuery.trim()
                    ? t('dashboard.noItemsFound', { query: searchQuery })
                    : t('dashboard.noMarketableItems')}
            </div>
        );
    }

    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4">
                {items.map((item, index) => (
                    <InventoryItemCard
                        key={`${item.classId}-${item.instanceId}-${index}`}
                        item={item}
                        viewMode={viewMode}
                        onSelect={onItemSelect}
                        onDeselect={onItemDeselect}
                    />
                ))}
            </div>
        );
    }

    // List view
    return (
        <div className="flex flex-col gap-2">
            {items.map((item, index) => (
                <InventoryItemCard
                    key={`${item.classId}-${item.instanceId}-${index}`}
                    item={item}
                    viewMode={viewMode}
                    onSelect={onItemSelect}
                    onDeselect={onItemDeselect}
                />
            ))}
        </div>
    );
}

