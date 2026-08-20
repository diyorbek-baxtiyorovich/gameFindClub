export const enMessages = {
  'common.retry': 'Try again',
  'common.offline': 'You are offline',
  'common.offline_description': 'Some content may be unavailable until your connection returns.',
  'common.unauthorized': 'Sign in required',
  'common.maintenance': 'Temporarily unavailable',
  'venue.open_now': 'Open now',
  'venue.closed': 'Closed',
  'search.placeholder': 'Search venues',
  'filters.apply': 'Apply filters',
  'filters.reset': 'Reset filters',
  'favorites.empty': 'No saved venues yet',
} as const
export type MessageKey = keyof typeof enMessages
