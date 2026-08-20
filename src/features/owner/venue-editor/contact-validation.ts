import type { ContactInfo } from '@/entities/venue'

export type ContactField = 'phone' | 'secondaryPhone' | 'telegram' | 'instagram' | 'website'
export type ContactErrors = Partial<Record<ContactField, string>>

export const isValidPhone = (value: string): boolean => /^\+?[0-9 ()-]{7,20}$/.test(value.trim())
export const isValidTelegram = (value: string): boolean => /^@?[A-Za-z0-9_]{5,32}$/.test(value.trim())
export const isValidInstagram = (value: string): boolean => /^@?[A-Za-z0-9._]{1,30}$/.test(value.trim())
  || /^https:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9._]+\/?$/i.test(value.trim())

export function isValidWebUrl(value: string): boolean {
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}

export function areContactsValid(contacts?: ContactInfo): boolean {
  if (!contacts) return true
  const instagram = contacts.socialLinks?.instagram
  return (!contacts.phone || isValidPhone(contacts.phone))
    && (!contacts.secondaryPhone || isValidPhone(contacts.secondaryPhone))
    && (!contacts.telegramUsername || isValidTelegram(contacts.telegramUsername))
    && (!instagram || isValidInstagram(instagram))
    && (!contacts.websiteUrl || isValidWebUrl(contacts.websiteUrl))
}
