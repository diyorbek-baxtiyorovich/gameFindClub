export type FilterPrimitive = string | number | boolean

export interface FilterRangeValue {
  min?: number
  max?: number
}

export type DynamicFilterValue =
  | FilterPrimitive
  | readonly string[]
  | readonly number[]
  | FilterRangeValue
  | null

export type FilterState = Record<string, DynamicFilterValue>

export interface FilterOption {
  value: FilterPrimitive
  label: string
  labelKey?: string
  description?: string
  count?: number
  disabled?: boolean
  metadata?: Readonly<Record<string, unknown>>
}

export type FilterControl =
  | 'select'
  | 'single-select'
  | 'multi-select'
  | 'range'
  | 'boolean'
  | 'number'
  | 'toggle'
  | 'text'

export interface FilterSchema {
  key: string
  label: string
  labelKey?: string
  control: FilterControl
  description?: string
  options?: readonly FilterOption[]
  defaultValue?: DynamicFilterValue
  min?: number
  max?: number
  step?: number
  unitLabel?: string
  required?: boolean
}
