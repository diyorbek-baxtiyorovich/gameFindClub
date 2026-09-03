import { getCategoryByCode } from '@/config'
import type { CategoryCode } from '@/config'
import type { CategorySummary } from '@/entities/category'

import type { VenueDetail, VenueListItem, Weekday } from './venue'

const weekdays: readonly Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const schedule = (open24 = false) => ({
  weekly: weekdays.map((day) => open24 ? { day, isOpen24Hours: true } : { day, periods: [{ opensAt: '10:00', closesAt: '02:00' }] }),
  statusText: open24 ? '24/7 ochiq' : undefined,
})
const categorySummary = (code: CategoryCode): CategorySummary => {
  const item = getCategoryByCode(code)
  return { id: item.id, slug: item.code, name: item.label.defaultValue, icon: item.icon }
}

const commonGames = ['Counter-Strike 2', 'Dota 2', 'Valorant', 'PUBG', 'Fortnite', 'EA Sports FC', 'GTA V', 'Call of Duty', 'League of Legends']
const images = {
  hall: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=84',
  pc: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=84',
  neon: 'https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=1200&q=84',
}

interface ClubInput {
  id: string; slug: string; name: string; category: CategoryCode; description: string; address: string
  district: string; latitude: number; longitude: number; distance: number; rating: number; reviews: number
  open: boolean; open24?: boolean; available: number; total: number; price: number; tier: string
  gpu: string; cpu: string; ram: string; refresh: number; image: string; badges: string[]
}

function club(input: ClubInput): VenueDetail {
  const availability = input.available === 0 ? 'unavailable' : input.available <= 4 ? 'limited' : 'available'
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    category: categorySummary(input.category),
    shortDescription: input.description,
    description: `${input.description} Kuchli qurilmalar, barqaror internet va jamoaviy o‘yin uchun qulay muhit.`,
    address: { formatted: input.address, city: 'Toshkent', district: input.district },
    location: { latitude: input.latitude, longitude: input.longitude },
    coverMedia: { id: `${input.id}-cover`, type: 'image', url: input.image, alt: `${input.name} gaming zali` },
    media: [
      { id: `${input.id}-1`, type: 'image', url: input.image, alt: `${input.name} asosiy gaming zali` },
      { id: `${input.id}-2`, type: 'image', url: images.pc, alt: `${input.name} kompyuter qatori` },
      { id: `${input.id}-3`, type: 'image', url: images.neon, alt: `${input.name} private xonasi` },
    ],
    rating: { average: input.rating, count: input.reviews, scale: 5 },
    openingHours: schedule(input.open24),
    operatingStatus: { isOpen: input.open, label: input.open ? (input.open24 ? '24/7 ochiq' : 'Hozir ochiq') : 'Yopiq', closesAt: input.open24 ? undefined : '02:00', opensAt: input.open ? undefined : '10:00' },
    activities: commonGames.map((name) => ({ id: name.toLowerCase().replaceAll(' ', '-'), name })),
    facilities: [{ id: 'team-room', name: 'Jamoa xonasi' }, { id: 'streaming', name: 'Streaming setup' }],
    amenities: [{ id: 'food-drinks', name: 'Taom va ichimliklar' }, { id: 'parking', name: 'Avtoturargoh' }, { id: 'air-conditioning', name: 'Konditsioner' }],
    resources: [
      { id: `${input.id}-standard`, name: 'Standard PC', resourceType: 'gaming-station', quantity: Math.max(12, input.total - 16), availability, attributes: { availableStations: Math.max(0, input.available - 6), cpu: 'Intel Core i5-13400F', gpu: 'RTX 3060', ram: '16 GB', monitorSize: '24.5″', monitorRefreshRate: 165, keyboard: 'HyperX Alloy', mouse: 'Logitech G102', headset: 'HyperX Cloud II', gamingChair: 'Cougar Armor', internetSpeed: '1 Gbps', tier: 'Standard', hourlyPrice: 20000 } },
      { id: `${input.id}-premium`, name: input.tier, resourceType: 'gaming-station', quantity: 12, availability, attributes: { availableStations: Math.min(input.available, 6), cpu: input.cpu, gpu: input.gpu, ram: input.ram, monitorSize: '27″', monitorRefreshRate: input.refresh, keyboard: 'SteelSeries Apex Pro', mouse: 'Logitech G Pro X', headset: 'SteelSeries Arctis Nova', gamingChair: 'AndaSeat Kaiser', internetSpeed: '2.5 Gbps', tier: input.tier, hourlyPrice: input.price } },
    ],
    pricing: [
      { id: `${input.id}-standard-price`, name: 'Standard PC', price: { amount: 20000, currency: 'UZS' }, unit: 'hour' },
      { id: `${input.id}-premium-price`, name: input.tier, price: { amount: input.price, currency: 'UZS' }, unit: 'hour' },
    ],
    priceFrom: { id: `${input.id}-from`, name: 'Boshlang‘ich narx', price: { amount: Math.min(20000, input.price), currency: 'UZS' }, unit: 'hour', isStartingPrice: true },
    occupancy: { level: input.available === 0 ? 'full' : input.available <= 4 ? 'high' : 'moderate', availableCount: input.available, totalCount: input.total, label: `${input.available} ta joy bo‘sh` },
    primaryAction: { kind: 'book', label: 'Joy band qilish', isAvailable: input.available > 0 },
    contact: { phone: '+998712000000', telegramUsername: 'gameclubfinder' },
    phone: '+998 71 200 00 00',
    isVerified: true,
    isOpen24Hours: input.open24,
    installedGames: commonGames,
    badges: input.badges,
  }
}

export const gamingVenueDetail = club({ id: 'club-nexus', slug: 'nexus-gaming-arena', name: 'Nexus Gaming Arena', category: 'pc-gaming', description: 'Professional esports arena va VIP PC zonalari.', address: 'Amir Temur shoh ko‘chasi, 12', district: 'Yunusobod', latitude: 41.3311, longitude: 69.2897, distance: 850, rating: 4.9, reviews: 326, open: true, open24: true, available: 14, total: 48, price: 40000, tier: 'Premium PC', gpu: 'RTX 4070', cpu: 'Ryzen 7 7800X3D', ram: '32 GB', refresh: 240, image: images.hall, badges: ['24/7', 'VIP Room', 'Tournament'] })
export const cyberZoneDetail = club({ id: 'club-cyber-zone', slug: 'cyber-zone-chilonzor', name: 'Cyber Zone Chilonzor', category: 'private-room', description: 'Do‘stlar uchun yopiq xonalar va premium PC.', address: 'Bunyodkor ko‘chasi, 18', district: 'Chilonzor', latitude: 41.2854, longitude: 69.2048, distance: 2100, rating: 4.7, reviews: 184, open: true, available: 4, total: 30, price: 45000, tier: 'VIP PC', gpu: 'RTX 4070 Super', cpu: 'Intel Core i7-14700F', ram: '32 GB', refresh: 240, image: images.pc, badges: ['VIP Room', 'PS5'] })
export const matrixDetail = club({ id: 'club-matrix', slug: 'matrix-playstation-club', name: 'Matrix PlayStation Club', category: 'playstation', description: 'PS5 va katta ekranli private konsol xonalari.', address: 'Shota Rustaveli ko‘chasi, 47', district: 'Yakkasaroy', latitude: 41.2921, longitude: 69.2532, distance: 3400, rating: 4.8, reviews: 219, open: true, available: 7, total: 16, price: 55000, tier: 'PS5 Private Room', gpu: 'PS5', cpu: 'AMD Zen 2', ram: '16 GB', refresh: 120, image: images.neon, badges: ['PS5', 'Private Room'] })
export const vrLabDetail = club({ id: 'club-vr-lab', slug: 'vr-lab-tashkent', name: 'VR Lab Tashkent', category: 'vr', description: 'Meta Quest 3 va xona bo‘ylab erkin VR tajribasi.', address: 'Buyuk Ipak Yo‘li, 105', district: 'Mirzo Ulug‘bek', latitude: 41.3265, longitude: 69.3281, distance: 4600, rating: 4.6, reviews: 97, open: true, available: 3, total: 10, price: 60000, tier: 'VR Zone', gpu: 'RTX 4080', cpu: 'Intel Core i9-14900K', ram: '64 GB', refresh: 120, image: images.hall, badges: ['VR', 'Private Room'] })
export const bootcampDetail = club({ id: 'club-titan', slug: 'titan-team-bootcamp', name: 'Titan Team Bootcamp', category: 'bootcamp', description: '5 kishilik jamoalar uchun turnirga tayyor bootcamp.', address: 'Maxtumquli ko‘chasi, 72', district: 'Yashnobod', latitude: 41.3044, longitude: 69.3122, distance: 5800, rating: 4.9, reviews: 141, open: true, open24: true, available: 5, total: 20, price: 50000, tier: 'Bootcamp PC', gpu: 'RTX 4070 Ti', cpu: 'Ryzen 9 7900X', ram: '32 GB', refresh: 360, image: images.pc, badges: ['Bootcamp', 'Tournament', '24/7'] })
export const nightCityDetail = club({ id: 'club-night-city', slug: 'night-city-gaming', name: 'Night City Gaming', category: 'open-24-7', description: 'Tungi gaming, tez internet va qulay standard zona.', address: 'Beruniy ko‘chasi, 6', district: 'Shayxontohur', latitude: 41.3162, longitude: 69.2452, distance: 6200, rating: 4.5, reviews: 268, open: false, open24: true, available: 0, total: 42, price: 30000, tier: 'Premium PC', gpu: 'RTX 4060 Ti', cpu: 'Intel Core i5-14600KF', ram: '32 GB', refresh: 240, image: images.neon, badges: ['24/7', 'Snacks'] })

export const venueDetailFixtures = [gamingVenueDetail, cyberZoneDetail, matrixDetail, vrLabDetail, bootcampDetail, nightCityDetail] as const satisfies readonly VenueDetail[]
const distances = [850, 2100, 3400, 4600, 5800, 6200]
export const venueListFixtures = venueDetailFixtures.map((item, index) => ({
  ...item,
  distanceMeters: distances[index],
  highlights: [String(item.resources?.[1]?.attributes?.gpu ?? ''), `${item.resources?.[1]?.attributes?.monitorRefreshRate ?? ''} Hz`, String(item.resources?.[1]?.attributes?.ram ?? '')],
  activityIds: item.activities?.map((activity) => activity.id),
  amenityIds: item.amenities?.map((amenity) => amenity.id),
})) satisfies readonly VenueListItem[]
