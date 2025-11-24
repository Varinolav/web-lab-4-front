import React from "react";

interface SkinCardProps {
    name?: string;
    price?: string | number;
    imageUrl?: string; // full URL or Steam icon path
    subtitle?: string;
    favorite?: boolean;
    onAddToCart?: () => void;
    onToggleFavorite?: () => void;
}

/**
 * Clean, dependency-free (only React + Tailwind) Steam Skin card.
 * - No Framer Motion, no icon libraries
 * - Soft elevation, hover lift, accessible buttons
 * - Price chip, favorite toggle, broken-image fallback
 */
export default function SkinCard({
                                     name = "Unknown Skin",
                                     price,
                                     imageUrl,
                                     subtitle,
                                     favorite = false,
                                     onAddToCart,
                                     onToggleFavorite,
                                 }: SkinCardProps) {
    const [imgError, setImgError] = React.useState(false);

    // Build a Steam CDN URL when a path like `IEwqf.../size` is provided
    const resolvedSrc = React.useMemo(() => {
        if (!imageUrl) return "";
        if (imageUrl.startsWith("http")) return imageUrl;
        return `https://steamcommunity-a.akamaihd.net/economy/image/${imageUrl}`;
    }, [imageUrl]);

    return (
        <article
            className="group relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:bg-zinc-900"
            role="region"
            aria-label={name}
        >
            {/* Image area */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                {resolvedSrc && !imgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={resolvedSrc}
                        alt={name}
                        onError={() => setImgError(true)}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-500 dark:from-zinc-800 dark:to-zinc-700">
                        {/* Inline SVG placeholder (no external icons) */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
                            <path fill="currentColor" d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2M8 7h8v2H8V7m0 4h8v2H8v-2m0 4h5v2H8v-2Z"/>
                        </svg>
                        <span className="ml-2 text-sm">No image</span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10 opacity-80" />

                {/* Price chip */}
                {price !== undefined && (
                    <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-zinc-900/90 dark:text-zinc-100">
              {typeof price === "number" ? `$${price.toFixed(2)}` : price}
            </span>
                    </div>
                )}

                {/* Favorite toggle (inline heart SVG) */}
                <button
                    type="button"
                    onClick={onToggleFavorite}
                    aria-pressed={favorite}
                    aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                    className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-white/90 p-2 text-zinc-700 shadow-sm ring-1 ring-black/5 transition hover:scale-105 hover:text-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 backdrop-blur-sm dark:bg-zinc-900/90 dark:text-zinc-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`h-5 w-5 ${favorite ? "text-rose-500" : ""}`}>
                        <path
                            fill="currentColor"
                            d="M12 21s-6.716-4.258-9.193-7.24C.63 11.346 1.097 8.6 3.11 7.095C5.12 5.59 7.78 6.057 9.3 7.92L12 6l2.7 1.92c1.52-1.863 4.18-2.33 6.19-.825c2.013 1.505 2.48 4.251.303 6.665C18.716 16.742 12 21 12 21Z"
                            className={favorite ? "fill-current" : "fill-transparent stroke-current"}
                            strokeWidth={1.5}
                        />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-1 p-4">
                <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {name}
                </h3>
                {subtitle && (
                    <p className="line-clamp-1 text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 pt-0">
                <button
                    type="button"
                    onClick={onAddToCart}
                    className="relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-[0.99] hover:bg-indigo-500"
                >
                    {/* Inline cart icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                        <path fill="currentColor" d="M7 18a2 2 0 1 0 0 4a2 2 0 0 0 0-4m10 0a2 2 0 1 0 0 4a2 2 0 0 0 0-4M7.17 14h9.62a2 2 0 0 0 1.93-1.5L21 6H6.21l-.94-4H2v2h2l3.6 14H19v-2H7.17Z"/>
                    </svg>
                    Add to Cart
                    <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-indigo-600 opacity-0 blur-xl transition group-hover:opacity-30" />
                </button>
            </div>
        </article>
    );
}

// Example usage:
// <SkinCard
//   name="AK-47 | Redline"
//   subtitle="Field-Tested • StatTrak™"
//   price={25}
//   imageUrl="IEwqfV2W.../360x360f" // Steam icon path OR full URL
//   favorite={true}
//   onAddToCart={() => console.log("Added to cart")}
//   onToggleFavorite={() => console.log("Toggled favorite")}
// />
