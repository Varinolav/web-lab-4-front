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
        <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">$15.50</p>
        <div className="flex gap-1">
          <p className="text-text-muted text-base font-normal leading-normal">{t('dashboard.itemDetail.last30Days')}</p>
          <p className="text-green-400 text-base font-medium leading-normal">+2.1%</p>
        </div>
        <div className="flex min-h-[180px] flex-col gap-8 py-4">
          <svg
            fill="none"
            height="148"
            preserveAspectRatio="none"
            viewBox="-3 0 478 150"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
              fill="url(#paint0_linear_1131_5935)"
            />
            <path
              d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
              stroke="#4f46e5"
              strokeLinecap="round"
              strokeWidth="3"
            />
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="paint0_linear_1131_5935"
                x1="236"
                x2="236"
                y1="1"
                y2="149"
              >
                <stop stopColor="#4f46e5" stopOpacity="0.4" />
                <stop offset="1" stopColor="#4f46e5" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex justify-around">
            <p className="text-text-muted text-[13px] font-bold leading-normal tracking-[0.015em]">1D</p>
            <p className="text-text-muted text-[13px] font-bold leading-normal tracking-[0.015em]">7D</p>
            <p className="text-primary text-[13px] font-bold leading-normal tracking-[0.015em]">30D</p>
            <p className="text-text-muted text-[13px] font-bold leading-normal tracking-[0.015em]">90D</p>
            <p className="text-text-muted text-[13px] font-bold leading-normal tracking-[0.015em]">1Y</p>
            <p className="text-text-muted text-[13px] font-bold leading-normal tracking-[0.015em]">ALL</p>
          </div>
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

