import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

export default function LoginPage() {
    const { t, i18n } = useTranslation();

    const handleSteamLogin = () => {
        window.location.href = apiService.getSteamLoginUrl();
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-4 md:px-10 py-3">
                            <div className="flex items-center gap-4 text-white">
                                <div className="size-5 text-primary">
                                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                                    </svg>
                                </div>
                                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">{t('header.title')}</h2>
                            </div>
                            <div className="hidden md:flex flex-1 justify-end gap-8">
                                <div className="flex items-center gap-9">
                                    <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">{t('header.features')}</a>
                                    <a className="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">{t('header.about')}</a>
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
                                </div>
                            </div>
                        </header>
                        <main className="flex-grow">
                            <div className="@container py-16 md:py-24">
                                <div className="@[480px]:p-4">
                                    <div 
                                        className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4 text-center" 
                                        style={{
                                            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 1) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBB9WBT4bn4_wgZOuGBN5jLLzIvWGadEYVNJDONLPP9DC5MjamiMWZYMhucLXnT3ItQbRWAUcOzANQh_bn_v16DARYILDGHvO28zaAqBu0xBv8aaM-ZAOo4UJ_052SI_lTB4vqQsRUtm19JWpm7anwqb_gruqbHUsKAUAOXeptFyUDhHPMx_6LXWifgMkofJYLwWejSQ2CAB5ZjrUb221A3bN1DWF4q_EdE0y6XQgUhh-nCFfBqLsND_Tbpm2r7JFMkg3GaiKo2u38r")`
                                        }}
                                    >
                                        <div className="flex flex-col gap-4 max-w-2xl">
                                            <h1 className="text-white text-4xl font-bold leading-tight tracking-tight @[480px]:text-5xl @[480px]:font-bold @[480px]:leading-tight @[480px]:tracking-tighter">
                                                {t('hero.title')}
                                            </h1>
                                            <h2 className="text-slate-300 text-base font-normal leading-normal @[480px]:text-lg @[480px]:font-normal @[480px]:leading-normal">
                                                {t('hero.subtitle')}
                                            </h2>
                                        </div>
                                        <button 
                                            onClick={handleSteamLogin}
                                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-opacity-90 transition-all duration-200"
                                        >
                                            <span className="truncate">{t('hero.signInButton')}</span>
                                        </button>
                                        <p className="text-muted text-xs font-normal leading-normal pt-1 px-4 text-center max-w-sm">
                                            {t('hero.signInNote')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-10 px-4 py-10 @container">
                                <div className="flex flex-col gap-4 text-center items-center">
                                    <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-bold @[480px]:leading-tight @[480px]:tracking-tighter max-w-[720px]">
                                        {t('features.title')}
                                    </h1>
                                    <p className="text-slate-300 text-base font-normal leading-normal max-w-[720px]">{t('features.subtitle')}</p>
                                </div>
                                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 p-0">
                                    <div className="flex flex-1 gap-4 rounded-xl border border-white/10 bg-surface-dark p-6 flex-col">
                                        <div className="text-primary">
                                            <span className="material-symbols-outlined">cloud_sync</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-white text-lg font-bold leading-tight">{t('features.inventorySync.title')}</h2>
                                            <p className="text-muted text-sm font-normal leading-normal">
                                                {t('features.inventorySync.description')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 gap-4 rounded-xl border border-white/10 bg-surface-dark p-6 flex-col">
                                        <div className="text-primary">
                                            <span className="material-symbols-outlined">monitoring</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-white text-lg font-bold leading-tight">{t('features.priceHistory.title')}</h2>
                                            <p className="text-muted text-sm font-normal leading-normal">
                                                {t('features.priceHistory.description')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 gap-4 rounded-xl border border-white/10 bg-surface-dark p-6 flex-col">
                                        <div className="text-primary">
                                            <span className="material-symbols-outlined">pie_chart</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-white text-lg font-bold leading-tight">{t('features.analytics.title')}</h2>
                                            <p className="text-muted text-sm font-normal leading-normal">
                                                {t('features.analytics.description')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <footer className="flex flex-col gap-6 px-5 py-10 text-center @container border-t border-white/10 mt-10">
                            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                                <a className="text-muted text-sm font-normal leading-normal hover:text-primary transition-colors" href="#">{t('footer.privacyPolicy')}</a>
                                <a className="text-muted text-sm font-normal leading-normal hover:text-primary transition-colors" href="#">{t('footer.termsOfService')}</a>
                                <a className="text-muted text-sm font-normal leading-normal hover:text-primary transition-colors" href="#">{t('footer.contact')}</a>
                            </div>
                            <p className="text-slate-500 text-sm font-normal leading-normal">
                                {t('footer.copyright')}
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}
