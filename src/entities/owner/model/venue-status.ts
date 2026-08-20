import type { MessageKey } from '@/i18n'

import type { VenueStatus } from './owner'

export type VenueStatusTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

export interface VenueStatusPresentation {
  labelKey: MessageKey
  tone: VenueStatusTone
}

export const VENUE_STATUS_PRESENTATION: Readonly<Record<VenueStatus, VenueStatusPresentation>> = {
  draft: { labelKey: 'owner.status.draft', tone: 'neutral' },
  pending_review: { labelKey: 'owner.status.pending_review', tone: 'primary' },
  changes_requested: { labelKey: 'owner.status.changes_requested', tone: 'warning' },
  approved: { labelKey: 'owner.status.approved', tone: 'success' },
  rejected: { labelKey: 'owner.status.rejected', tone: 'danger' },
  archived: { labelKey: 'owner.status.archived', tone: 'neutral' },
}

export const OWNER_VENUE_STATUS_FILTERS: readonly VenueStatus[] = [
  'draft',
  'pending_review',
  'changes_requested',
  'approved',
  'rejected',
  'archived',
]

export function getVenueStatusPresentation(status: VenueStatus): VenueStatusPresentation {
  return VENUE_STATUS_PRESENTATION[status]
}
