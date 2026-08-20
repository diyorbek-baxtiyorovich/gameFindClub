import { getCategoryByCode } from '@/config'
import type { CategoryCode } from '@/config'
import type { CategorySummary } from '@/entities/category'

import type { VenueDetail, VenueListItem, Weekday } from './venue'

const weekdays: readonly Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]
const weeklySchedule = (opensAt: string, closesAt: string) => weekdays.map((day) => ({
  day,
  periods: [{ opensAt, closesAt }],
}))

const categorySummary = (code: CategoryCode): CategorySummary => {
  const category = getCategoryByCode(code)
  return {
    id: category.id,
    slug: category.code,
    name: category.label.defaultValue,
    icon: category.icon,
  }
}

export const gamingVenueDetail = {
  id: 'venue-gaming-nexus',
  slug: 'nexus-gaming-arena',
  name: 'Nexus Gaming Arena',
  category: categorySummary('gaming'),
  shortDescription: 'Competitive gaming stations and private VIP rooms.',
  description: 'A modern gaming venue for teams, casual players, and tournaments.',
  address: { formatted: '12 Amir Temur Avenue, Tashkent', city: 'Tashkent' },
  location: { latitude: 41.3111, longitude: 69.2797 },
  coverMedia: {
    id: 'gaming-cover',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=82',
    alt: 'Gaming stations at Nexus Gaming Arena',
  },
  media: [
    { id: 'gaming-1', type: 'image', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=84', alt: 'Main gaming hall' },
    { id: 'gaming-2', type: 'image', url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=84', alt: 'Private VIP room' },
  ],
  rating: { average: 4.8, count: 326, scale: 5 },
  openingHours: { weekly: weeklySchedule('09:00', '02:00') },
  activities: [
    { id: 'cs2', name: 'CS2' },
    { id: 'dota-2', name: 'Dota 2' },
  ],
  facilities: [{ id: 'vip', name: 'VIP rooms' }],
  amenities: [{ id: 'snacks', name: 'Snack bar' }],
  resources: [
    {
      id: 'gaming-pc-pro',
      name: 'Pro PC station',
      resourceType: 'gaming-station',
      quantity: 36,
      availability: 'available',
      attributes: { monitorRefreshRate: 240, gpu: 'RTX 4070', cpu: 'Ryzen 7', ram: '32 GB', headset: 'Pro headset', games: ['CS2', 'Dota 2'], tier: 'VIP' },
    },
  ],
  pricing: [
    { id: 'gaming-hour', name: 'Standard station', price: { amount: 35000, currency: 'UZS' }, unit: 'hour' },
    { id: 'gaming-vip-hour', name: 'VIP station', price: { amount: 65000, currency: 'UZS' }, unit: 'hour' },
  ],
  priceFrom: {
    id: 'gaming-hour',
    name: 'Standard station',
    price: { amount: 35000, currency: 'UZS' },
    unit: 'hour',
    isStartingPrice: true,
  },
  occupancy: { level: 'moderate', availableCount: 14, totalCount: 36 },
  operatingStatus: { isOpen: true, label: 'Open now', closesAt: '02:00' },
  primaryAction: { kind: 'book', label: 'Book a station', isAvailable: true },
  isFavorite: false,
  isVerified: true,
} satisfies VenueDetail

export const tennisVenueDetail = {
  id: 'venue-tennis-center',
  slug: 'central-indoor-tennis',
  name: 'Central Indoor Tennis Center',
  category: categorySummary('tennis'),
  shortDescription: 'Six climate-controlled indoor hard courts.',
  address: { formatted: '8 Bunyodkor Street, Tashkent', city: 'Tashkent' },
  location: { latitude: 41.2854, longitude: 69.2048 },
  coverMedia: { id: 'tennis-cover', type: 'image', url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=82', alt: 'Indoor tennis court' },
  rating: { average: 4.6, count: 118, scale: 5 },
  openingHours: { weekly: weeklySchedule('07:00', '23:00') },
  operatingStatus: { isOpen: true, closesAt: '23:00' },
  activities: [{ id: 'tennis', name: 'Tennis' }],
  facilities: [{ id: 'racket-rental', name: 'Racket rental' }],
  resources: [
    {
      id: 'indoor-hard-court',
      name: 'Indoor hard court',
      resourceType: 'tennis-court',
      quantity: 6,
      attributes: { surface: 'hard', setting: 'indoor', courtCount: 6, lighting: true, racketRental: true, coachAvailable: true },
    },
  ],
  pricing: [
    { id: 'court-hour', name: 'Court rental', price: { amount: 180000, currency: 'UZS' }, unit: 'hour' },
  ],
  primaryAction: { kind: 'call', label: 'Check availability', isAvailable: true },
  isVerified: true,
} satisfies VenueDetail

export const footballVenueDetail = {
  id: 'venue-football-five',
  slug: 'five-side-football-park',
  name: 'Five Side Football Park',
  category: categorySummary('football'),
  shortDescription: 'Outdoor 5x5 field with professional artificial turf.',
  address: { formatted: '44 Small Ring Road, Tashkent', city: 'Tashkent' },
  location: { latitude: 41.3265, longitude: 69.2281 },
  coverMedia: { id: 'football-cover', type: 'image', url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=82', alt: 'Five-a-side football field' },
  media: [{ id: 'football-1', type: 'image', url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=84', alt: 'Artificial turf field' }],
  rating: { average: 4.3, count: 89, scale: 5 },
  openingHours: { weekly: weeklySchedule('09:00', '23:00') },
  amenities: [{ id: 'shower', name: 'Shower' }],
  facilities: [{ id: 'changing-room', name: 'Changing room' }],
  resources: [
    {
      id: 'field-5x5',
      name: '5x5 field',
      resourceType: 'football-field',
      quantity: 2,
      availability: 'unavailable',
      attributes: { fieldSize: '5x5', surface: 'artificial-turf', setting: 'outdoor', shower: true, changingRoom: true, ballRental: true },
    },
  ],
  pricing: [
    { id: 'field-hour', name: 'Field rental', price: { amount: 300000, currency: 'UZS' }, unit: 'hour' },
  ],
  priceFrom: { id: 'field-hour', name: 'Field rental', price: { amount: 300000, currency: 'UZS' }, unit: 'hour' },
  occupancy: { level: 'full', availableCount: 0, totalCount: 2, label: 'Closed now' },
  operatingStatus: { isOpen: false, label: 'Closed', opensAt: '09:00' },
  primaryAction: { kind: 'book', label: 'Book a field', isAvailable: false, disabledReason: 'Venue is closed' },
} satisfies VenueDetail

export const gymVenueDetail = {
  id: 'venue-gym-very-long-name',
  slug: 'twenty-four-seven-strength-and-wellness',
  name: 'Twenty Four Seven Strength, Conditioning and Complete Wellness Center',
  category: categorySummary('gym'),
  shortDescription: 'A 24/7 training space with coaching and recovery facilities.',
  address: { formatted: '3 Navoi Street, Tashkent', city: 'Tashkent' },
  location: { latitude: 41.3162, longitude: 69.2452 },
  coverMedia: { id: 'gym-cover', type: 'image', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=82', alt: 'Modern fitness training area' },
  openingHours: {
    weekly: weekdays.map((day) => ({ day, isOpen24Hours: true })),
    statusText: 'Open 24/7',
  },
  operatingStatus: { isOpen: true, label: 'Open 24/7' },
  activities: [
    { id: 'strength-training', name: 'Strength training' },
    { id: 'personal-training', name: 'Personal training' },
  ],
  facilities: [{ id: 'trainer', name: 'Personal trainer' }],
  amenities: [{ id: 'sauna', name: 'Sauna' }],
  resources: [
    { id: 'gym-floor', name: 'Training floor', resourceType: 'fitness-area', attributes: { trainerAvailable: true, equipmentGroups: ['Strength', 'Cardio', 'Functional'], pool: false, sauna: true, groupClasses: true } },
  ],
  pricing: [
    { id: 'gym-month', name: 'Monthly membership', price: { amount: 550000, currency: 'UZS' }, unit: 'month' },
  ],
  primaryAction: { kind: 'open-url', label: 'Join now', url: 'https://example.com/join', isAvailable: true },
} satisfies VenueDetail

export const venueDetailFixtures = [
  gamingVenueDetail,
  tennisVenueDetail,
  footballVenueDetail,
  gymVenueDetail,
] as const satisfies readonly VenueDetail[]

export const venueListFixtures = [
  { ...gamingVenueDetail, distanceMeters: 850, highlights: ['240 Hz', 'RTX 4070', 'VIP'], activityIds: ['cs2', 'dota-2'], amenityIds: ['snacks'] },
  { ...tennisVenueDetail, distanceMeters: 2400, priceFrom: undefined, highlights: ['Hard', 'Indoor', '6 courts'], activityIds: ['tennis'], amenityIds: [] },
  { ...footballVenueDetail, distanceMeters: 5100, highlights: ['5x5', 'Artificial turf', 'Shower'], activityIds: ['football'], amenityIds: ['shower'] },
  {
    ...gymVenueDetail,
    rating: undefined,
    distanceMeters: undefined,
    highlights: ['Open 24/7', 'Personal trainer', 'Sauna'],
    activityIds: ['strength-training', 'personal-training'],
    amenityIds: ['sauna'],
  },
] as const satisfies readonly VenueListItem[]
