import { useTranslation } from 'react-i18next';
import type { ItemDto } from '../services/api';

interface ItemDetailPanelProps {
  item: ItemDto;
}

const STEAM_IMAGE_BASE_URL = 'https://steamcommunity-a.akamaihd.net/economy/image/';

export default function ItemDetailPanel({ item }: ItemDetailPanelProps) {
  const { t } = useTranslation();
  const itemName = item.marketHashName || item.name || t('dashboard.unknownItem');
  const itemType = item.type || t('dashboard.item');
  const imageUrl = item.iconUrl ? `${STEAM_IMAGE_BASE_URL}${item.iconUrl}` : null;

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-surface-dark">
      <div className="flex items-center gap-4">
        {imageUrl ? (
          <div
            className="w-24 h-16 bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
        ) : (
          <div className="w-24 h-16 bg-surface-dark rounded flex items-center justify-center">
            <span className="text-white/30 text-xs">{t('dashboard.noImage')}</span>
          </div>
        )}
        <div>
          <h3 className="text-white text-lg font-bold leading-tight">{itemName}</h3>
          <p className="text-text-muted text-sm">{itemType}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-base font-medium leading-normal">{t('dashboard.itemDetail.priceHistory')}</p>
        <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">0.00 RUB</p>
        <div className="flex gap-1">
          <p className="text-text-muted text-base font-normal leading-normal">{t('dashboard.itemDetail.last30Days')}</p>
          <p className="text-green-400 text-base font-medium leading-normal">N/A</p>
        </div>
      </div>
      <div className="border-t border-border-dark pt-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">{t('dashboard.itemDetail.floatValue')}</span>
          <span className="text-white">0.1834567</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">{t('dashboard.itemDetail.patternIndex')}</span>
          <span className="text-white">245</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">{t('dashboard.itemDetail.steamMarket')}</span>
          <a className="text-primary hover:underline" href="#">
            {t('dashboard.itemDetail.view')}
          </a>
        </div>
      </div>
    </div>
  );
}

