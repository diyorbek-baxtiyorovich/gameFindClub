<script setup lang="ts">
import { computed } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import type { ContactInfo } from '@/entities/venue'
import { validateContacts, type VenueContactField, type VenueEditorDraft } from '@/features/owner/venue-editor'
import { t } from '@/i18n'
import { useOwnerVenueDraftStore } from '@/stores'

const props = defineProps<{ draft: VenueEditorDraft }>()
const store = useOwnerVenueDraftStore()
const contacts = computed(() => props.draft.contacts ?? {})
const instagram = computed(() => contacts.value.socialLinks?.instagram ?? '')
const errors = computed(() => validateContacts(contacts.value))
const error = (field: VenueContactField) => errors.value[field] ? t(errors.value[field]!) : undefined
function patch(values: Partial<ContactInfo>): void { store.setContacts({ ...contacts.value, ...values }) }
function setInstagram(value: string): void { patch({ socialLinks: { ...contacts.value.socialLinks, instagram: value } }) }
</script>
<template>
  <section class="contacts-step">
    <header><h3>{{ t('owner.editor.contacts.title') }}</h3><p>{{ t('owner.editor.contacts.description') }}</p></header>
    <AppInput type="tel" :model-value="contacts.phone" :label="t('owner.editor.contacts.phone')" :error="error('phone')" @update:model-value="patch({phone:$event})" />
    <AppInput type="tel" :model-value="contacts.secondaryPhone" :label="t('owner.editor.contacts.secondary_phone')" :error="error('secondaryPhone')" @update:model-value="patch({secondaryPhone:$event})" />
    <AppInput :model-value="contacts.telegramUsername" :label="t('owner.editor.contacts.telegram')" placeholder="@username" :error="error('telegram')" @update:model-value="patch({telegramUsername:$event})" />
    <AppInput :model-value="instagram" :label="t('owner.editor.contacts.instagram')" placeholder="@username" :error="error('instagram')" @update:model-value="setInstagram" />
    <AppInput type="url" :model-value="contacts.websiteUrl" :label="t('owner.editor.contacts.website')" placeholder="https://example.com" :error="error('website')" @update:model-value="patch({websiteUrl:$event})" />
  </section>
</template>
<style scoped>.contacts-step{display:grid;gap:var(--space-4)}header h3,header p{margin:0}header p{color:var(--color-text-secondary)}</style>
