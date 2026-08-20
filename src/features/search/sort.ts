export type VenueSort = 'recommended' | 'nearest' | 'highest-rated' | 'lowest-price' | 'most-popular' | 'open-now'
export const SORT_OPTIONS: readonly { value: VenueSort; label: string; labelKey: string }[] = [
  { value: 'recommended', label: 'Recommended', labelKey: 'sort.recommended' },
  { value: 'nearest', label: 'Nearest', labelKey: 'sort.nearest' },
  { value: 'highest-rated', label: 'Highest rated', labelKey: 'sort.highestRated' },
  { value: 'lowest-price', label: 'Lowest price', labelKey: 'sort.lowestPrice' },
  { value: 'most-popular', label: 'Most popular', labelKey: 'sort.mostPopular' },
  { value: 'open-now', label: 'Open now', labelKey: 'sort.openNow' },
]
