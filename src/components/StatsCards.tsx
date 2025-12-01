import { useTranslation } from 'react-i18next';

interface StatsCardsProps {
  totalValue: number;
  change24h: number;
  changePercent: number;
  mostValuableItem: string;
  totalItems: number;
}

export default function StatsCards({
  totalValue,
  change24h,
  changePercent,
  mostValuableItem,
  totalItems,
}: StatsCardsProps) {
  const { t } = useTranslation();
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 2,
    }).format(value) + ' RUB';
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-surface-dark">
        <p className="text-text-muted text-base font-medium leading-normal">{t('dashboard.stats.totalValue')}</p>
        <p className="text-white tracking-light text-2xl font-bold leading-tight">{formatCurrency(totalValue)}</p>
      </div>
      <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-surface-dark">
        <p className="text-text-muted text-base font-medium leading-normal">{t('dashboard.stats.change24h')}</p>
        <p className={`tracking-light text-2xl font-bold leading-tight ${
          change24h >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {change24h >= 0 ? '+' : ''}{formatCurrency(change24h)}
        </p>
        <p className={`text-base font-medium leading-normal ${
          changePercent >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
        </p>
      </div>
      <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-surface-dark">
        <p className="text-text-muted text-base font-medium leading-normal">{t('dashboard.stats.mostValuableItem')}</p>
        <p className="text-white tracking-light text-2xl font-bold leading-tight truncate">{mostValuableItem}</p>
      </div>
      <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-surface-dark">
        <p className="text-text-muted text-base font-medium leading-normal">{t('dashboard.stats.totalItems')}</p>
        <p className="text-white tracking-light text-2xl font-bold leading-tight">{totalItems}</p>
      </div>
    </div>
  );
}

