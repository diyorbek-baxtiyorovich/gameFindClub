import type { CategoryCode, CategoryConfig } from './categories.types'

const games = ['Counter-Strike 2', 'Dota 2', 'Valorant', 'PUBG', 'Fortnite', 'EA Sports FC', 'GTA V', 'Call of Duty', 'League of Legends']
const commonFilters = [
  { key: 'gpu', label: 'GPU modeli', control: 'multi-select', options: ['RTX 3060', 'RTX 4060', 'RTX 4070', 'RTX 4080'].map((value) => ({ value, label: value })) },
  { key: 'minRam', label: 'Minimal RAM', control: 'single-select', options: [16, 32, 64].map((value) => ({ value, label: `${value} GB` })) },
  { key: 'monitorRefreshRate', label: 'Monitor chastotasi', control: 'multi-select', unitLabel: 'Hz', options: [144, 165, 240, 360].map((value) => ({ value, label: `${value} Hz` })) },
  { key: 'games', label: 'O‘yinlar', control: 'multi-select', options: games.map((value) => ({ value, label: value })) },
] as const

const reviewCriteria = [
  { key: 'pcPerformance', label: { key: 'review.pc_performance', defaultValue: 'PC performance' } },
  { key: 'internetStability', label: { key: 'review.internet_stability', defaultValue: 'Internet stability' } },
  { key: 'equipmentCondition', label: { key: 'review.equipment_condition', defaultValue: 'Equipment condition' } },
] as const

const detailSections = [
  { id: 'resources', label: { key: 'venue.resources', defaultValue: 'Gaming uskunalari' }, source: 'resources' },
] as const

function category(
  code: CategoryCode,
  label: string,
  icon: string,
  accent: 'gaming' | 'cyan' = 'gaming',
  filters: CategoryConfig['filters'] = commonFilters,
): CategoryConfig {
  return {
    id: `category-${code}`,
    code,
    label: { key: `category.${code}`, defaultValue: label },
    icon,
    accent,
    filters,
    editorFields: commonFilters,
    detailSections,
    reviewCriteria,
    highlights: [
      { source: 'resource-attribute', key: 'gpu' },
      { source: 'resource-attribute', key: 'monitorRefreshRate' },
      { source: 'resource-attribute', key: 'ram' },
    ],
  }
}

export const CATEGORY_CONFIGS = [
  category('pc-gaming', 'PC Gaming', 'gamepad'),
  category('playstation', 'PlayStation', 'gamepad', 'cyan', [
    { key: 'consoleType', label: 'Konsol turi', control: 'multi-select', options: ['PS5', 'PS5 Pro'].map((value) => ({ value, label: value })) },
    { key: 'games', label: 'O‘yinlar', control: 'multi-select', options: games.map((value) => ({ value, label: value })) },
  ]),
  category('vr', 'VR', 'glasses', 'cyan', [
    { key: 'headset', label: 'VR qurilma', control: 'multi-select', options: ['Meta Quest 3', 'HTC Vive Pro 2'].map((value) => ({ value, label: value })) },
  ]),
  category('private-room', 'Private Room', 'door'),
  category('bootcamp', 'Bootcamp', 'users'),
  category('open-24-7', 'Open 24/7', 'clock'),
] as const satisfies readonly CategoryConfig[]

export const UNKNOWN_CATEGORY: CategoryConfig = {
  id: 'category-unknown',
  code: 'unknown',
  label: { key: 'category.unknown', defaultValue: 'Gaming club' },
  icon: 'gamepad',
  accent: 'neutral',
}

export function getCategoryByCode(code: string | null | undefined): CategoryConfig {
  const normalizedCode = code?.trim().toLowerCase()
  return CATEGORY_CONFIGS.find((item) => item.code === normalizedCode) ?? UNKNOWN_CATEGORY
}

export function getCategoryById(id: string | null | undefined): CategoryConfig {
  return CATEGORY_CONFIGS.find((item) => item.id === id) ?? UNKNOWN_CATEGORY
}

export function isKnownCategoryCode(code: string): code is CategoryCode {
  return CATEGORY_CONFIGS.some((item) => item.code === code)
}
