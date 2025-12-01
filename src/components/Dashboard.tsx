import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { SteamUser, ItemDto, PriceTimeSeriesDto } from '../services/api';
import InventoryList from './InventoryList';
import StatsCards from './StatsCards';
import ItemDetailPanel from './ItemDetailPanel';
import ItemDetailModal from './ItemDetailModal';

interface DashboardProps {
  user: SteamUser;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };
  const [inventory, setInventory] = useState<ItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<ItemDto | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalItem, setModalItem] = useState<ItemDto | null>(null);
  const [itemPrices, setItemPrices] = useState<Map<string, number>>(new Map());
  const [itemPriceHistories, setItemPriceHistories] = useState<Map<string, PriceTimeSeriesDto[]>>(new Map());

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true);
        const items = await apiService.getInventory(user.steamId);
        const marketableItems = items.filter(item => item.marketable === 1);
        setInventory(marketableItems);
        if (marketableItems.length > 0) {
          setSelectedItem(marketableItems[0]);
        }
      } catch (err) {
        setError(t('dashboard.failedToLoad'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.steamId) {
      loadInventory();
    }
  }, [user]);

  // Fetch prices and price histories for all items
  useEffect(() => {
    const fetchAllPrices = async () => {
      if (inventory.length === 0) {
        setItemPrices(new Map());
        setItemPriceHistories(new Map());
        return;
      }

      try {
        const itemsWithMarketHash = inventory.filter(item => item.marketHashName);
        
        // Fetch prices and histories in parallel for all items
        const pricePromises = itemsWithMarketHash.map(async (item) => {
          const marketHashName = item.marketHashName!;
          try {
            const [price, history] = await Promise.all([
              apiService.getPrice(marketHashName),
              apiService.getPriceHistory(marketHashName),
            ]);
            return { marketHashName, price, history };
          } catch (error) {
            console.error(`Failed to fetch price for ${marketHashName}:`, error);
            return { marketHashName, price: null, history: [] };
          }
        });

        const results = await Promise.all(pricePromises);
        
        const newPrices = new Map<string, number>();
        const newHistories = new Map<string, PriceTimeSeriesDto[]>();
        
        results.forEach(({ marketHashName, price, history }) => {
          if (price !== null) {
            newPrices.set(marketHashName, price);
          }
          if (history.length > 0) {
            newHistories.set(marketHashName, history);
          }
        });

        setItemPrices(newPrices);
        setItemPriceHistories(newHistories);
      } catch (err) {
        console.error('Failed to fetch prices:', err);
      }
    };

    fetchAllPrices();
  }, [inventory]);

  // Filter inventory based on search query
  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) {
      return inventory;
    }

    const query = searchQuery.toLowerCase().trim();
    return inventory.filter((item) => {
      const itemName = (item.marketHashName || item.name || '').toLowerCase();
      const itemType = (item.type || '').toLowerCase();

      return itemName.includes(query) || itemType.includes(query);
    });
  }, [inventory, searchQuery]);

  // Update selected item when filtered results change
  useEffect(() => {
    if (filteredInventory.length > 0) {
      // If current selected item is not in filtered results, select first item
      if (!selectedItem || !filteredInventory.includes(selectedItem)) {
        setSelectedItem(filteredInventory[0]);
      }
    } else {
      setSelectedItem(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredInventory]);

  // Calculate statistics
  const stats = useMemo(() => {
    let totalValue = 0;
    let totalValue24hAgo = 0;
    let mostValuableItem: { name: string; price: number } | null = null;
    let mostValuableItemName = 'N/A';

    inventory.forEach((item) => {
      if (!item.marketHashName) return;
      
      const currentPrice = itemPrices.get(item.marketHashName);
      if (currentPrice !== undefined && currentPrice !== null) {
        totalValue += currentPrice;

        // Find most valuable item
        if (!mostValuableItem || currentPrice > mostValuableItem.price) {
          const itemName = item.marketHashName || item.name || 'Unknown';
          mostValuableItem = {
            name: itemName,
            price: currentPrice,
          };
          mostValuableItemName = itemName;
        }

        // Calculate 24h ago value from price history
        const history = itemPriceHistories.get(item.marketHashName) || [];
        if (history.length > 0) {
          // Get price from 24 hours ago (or first available price if less than 24h of history)
          const now = Date.now();
          const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
          
          // Find the closest price point to 24h ago
          let price24hAgo = history[0].price; // Default to first price
          for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].time <= twentyFourHoursAgo) {
              price24hAgo = history[i].price;
              break;
            }
          }
          
          totalValue24hAgo += price24hAgo;
        } else {
          // If no history, assume price was the same 24h ago
          totalValue24hAgo += currentPrice;
        }
      }
    });

    const change24h = totalValue - totalValue24hAgo;
    const changePercent = totalValue24hAgo > 0 
      ? (change24h / totalValue24hAgo) * 100 
      : 0;

    return {
      totalValue,
      change24h,
      changePercent,
      mostValuableItem: mostValuableItemName,
      totalItems: filteredInventory.length,
    };
  }, [inventory, itemPrices, itemPriceHistories, filteredInventory.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <div className="text-white text-xl">{t('dashboard.loadingInventory')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-gray-100">      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5 sm:px-4 md:px-10 lg:px-20 xl:px-40">
          <div className="layout-content-container flex flex-col w-full max-w-[1280px] flex-1">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 dark:border-border-dark px-4 md:px-10 py-3">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedItem(inventory.length > 0 ? inventory[0] : null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-4 text-white hover:opacity-80 transition-opacity cursor-pointer"
                  aria-label="Return to dashboard"
                >
                  <div className="size-6 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">{t('dashboard.title')}</h2>
                </button>
                <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full relative">
                    <div className="text-text-muted flex border-none bg-surface-dark items-center justify-center pl-4 rounded-l-lg border-r-0">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-surface-dark focus:border-none h-full placeholder:text-text-muted px-4 rounded-l-none border-l-0 pl-2 pr-8 text-base font-normal leading-normal"
                      placeholder={t('dashboard.searchPlaceholder')}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                        aria-label={t('dashboard.clearSearch')}
                        type="button"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                          close
                        </span>
                      </button>
                    )}
                  </div>
                </label>
              </div>
              <div className="flex flex-1 justify-end gap-4 md:gap-8">
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-surface-dark text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                  >
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                      refresh
                    </span>
                  </button>
                  <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-surface-dark text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                      settings
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      i18n.language === 'en'
                        ? 'text-primary bg-white/10'
                        : 'text-white/70 hover:text-primary'
                    }`}
                  >
                    EN
                  </button>
                  <span className="text-white/30">|</span>
                  <button
                    onClick={() => changeLanguage('ru')}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      i18n.language === 'ru'
                        ? 'text-primary bg-white/10'
                        : 'text-white/70 hover:text-primary'
                    }`}
                  >
                    RU
                  </button>
                </div>
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
                  style={{
                    backgroundImage: user.avatarFull
                      ? `url("${user.avatarFull}")`
                      : 'url("https://via.placeholder.com/64")',
                  }}
                  onClick={onLogout}
                  title={t('dashboard.logout')}
                />
              </div>
            </header>
            <main className="flex flex-col gap-4 p-4">
              <StatsCards
                totalValue={stats.totalValue}
                change24h={stats.change24h}
                changePercent={stats.changePercent}
                mostValuableItem={stats.mostValuableItem}
                totalItems={stats.totalItems}
              />
              {/* Toolbar */}
              <div className="flex justify-between items-center gap-2 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-primary/20 text-primary'
                        : 'text-white hover:bg-white/10'
                    }`}
                    aria-label={t('dashboard.gridView')}
                    title={t('dashboard.gridView')}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                      grid_view
                    </span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-primary/20 text-primary'
                        : 'text-white hover:bg-white/10'
                    }`}
                    aria-label={t('dashboard.listView')}
                    title={t('dashboard.listView')}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                      view_list
                    </span>
                  </button>
                </div>
                <div className="flex gap-2 items-center">
                  <button className="flex items-center gap-2 p-2 text-text-muted hover:text-white rounded-lg hover:bg-white/10">
                    <span className="material-symbols-outlined">filter_list</span>
                    <span className="text-sm">{t('dashboard.filter')}</span>
                  </button>
                  <button className="flex items-center gap-2 p-2 text-text-muted hover:text-white rounded-lg hover:bg-white/10">
                    <span className="material-symbols-outlined">swap_vert</span>
                    <span className="text-sm">{t('dashboard.sortByPrice')}</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4 items-start">
                <InventoryList
                  items={filteredInventory}
                  viewMode={viewMode}
                  onItemSelect={setSelectedItem}
                  onItemDeselect={() => setSelectedItem(filteredInventory[0] || null)}
                  searchQuery={searchQuery}
                  onItemClick={setModalItem}
                />
                <div className="w-full xl:sticky xl:top-4">
                  {selectedItem && <ItemDetailPanel item={selectedItem} />}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      {modalItem && (
        <ItemDetailModal
          item={modalItem}
          onClose={() => setModalItem(null)}
        />
      )}
    </div>
    );
}
