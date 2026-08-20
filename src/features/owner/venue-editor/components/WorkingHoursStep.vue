<script setup lang="ts">
import { computed } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppCheckbox from '@/components/ui/AppCheckbox.vue'
import AppInput from '@/components/ui/AppInput.vue'
import type { DailyOpeningHours, Weekday } from '@/entities/venue'
import {
  DEFAULT_OPENING_PERIOD,
  isDailyOpeningHoursValid,
  normalizeOpeningHours,
  WEEKDAYS,
} from '@/features/owner/venue-editor/working-hours'
import type { VenueEditorDraft } from '@/features/owner/venue-editor'
import { t } from '@/i18n'
import { useOwnerVenueDraftStore } from '@/stores'

const props = defineProps<{ draft: VenueEditorDraft }>()
const store = useOwnerVenueDraftStore()
const schedule = computed(() => normalizeOpeningHours(props.draft.schedule))

function replaceDay(day: Weekday, update: Partial<DailyOpeningHours>): void {
  store.setSchedule({
    ...schedule.value,
    weekly: schedule.value.weekly.map((item) => (item.day === day ? { ...item, ...update } : item)),
  })
}

function toggleOpen(day: Weekday, open: boolean): void {
  replaceDay(
    day,
    open
      ? { isClosed: false, isOpen24Hours: false, periods: [DEFAULT_OPENING_PERIOD] }
      : { isClosed: true, isOpen24Hours: false, periods: [] },
  )
}

function updateTime(day: Weekday, field: 'opensAt' | 'closesAt', value: string): void {
  const current = schedule.value.weekly.find((item) => item.day === day)
  const period = current?.periods?.[0] ?? DEFAULT_OPENING_PERIOD
  replaceDay(day, {
    isClosed: false,
    isOpen24Hours: false,
    periods: [{ ...period, [field]: value }],
  })
}

function setAllDay(): void {
  store.setSchedule({
    ...schedule.value,
    weekly: WEEKDAYS.map((day) => ({ day, isOpen24Hours: true, isClosed: false, periods: [] })),
  })
}

function copy(source: Weekday, targets: readonly Weekday[]): void {
  const sourceDay = schedule.value.weekly.find((item) => item.day === source)
  if (!sourceDay) return
  const template: DailyOpeningHours = sourceDay.isClosed
    ? {
        day: source,
        isClosed: false,
        isOpen24Hours: false,
        periods: [{ ...DEFAULT_OPENING_PERIOD }],
      }
    : sourceDay
  store.setSchedule({
    ...schedule.value,
    weekly: schedule.value.weekly.map((item) =>
      targets.includes(item.day)
        ? {
            ...template,
            day: item.day,
            periods: template.periods?.map((period) => ({ ...period })),
          }
        : item,
    ),
  })
}
</script>

<template>
  <section class="hours-step">
    <header>
      <h3>{{ t('owner.editor.hours.title') }}</h3>
      <p>{{ t('owner.editor.hours.description') }}</p>
    </header>
    <div class="hours-step__actions">
      <AppButton variant="secondary" size="sm" @click="setAllDay">{{
        t('owner.editor.hours.all_day')
      }}</AppButton>
      <AppButton variant="secondary" size="sm" @click="copy('monday', WEEKDAYS)">{{
        t('owner.editor.hours.copy_all')
      }}</AppButton>
      <AppButton variant="secondary" size="sm" @click="copy('monday', WEEKDAYS.slice(0, 5))">{{
        t('owner.editor.hours.copy_weekdays')
      }}</AppButton>
      <AppButton variant="secondary" size="sm" @click="copy('saturday', WEEKDAYS.slice(5))">{{
        t('owner.editor.hours.copy_weekend')
      }}</AppButton>
    </div>
    <div class="hours-step__days">
      <article v-for="item in schedule.weekly" :key="item.day" class="hours-day">
        <AppCheckbox
          :model-value="!item.isClosed"
          :label="t(`weekday.${item.day}`)"
          @update:model-value="toggleOpen(item.day, $event)"
        />
        <AppCheckbox
          v-if="!item.isClosed"
          :model-value="Boolean(item.isOpen24Hours)"
          :label="t('owner.editor.hours.open_24')"
          @update:model-value="
            replaceDay(item.day, {
              isOpen24Hours: $event,
              periods: $event ? [] : [DEFAULT_OPENING_PERIOD],
            })
          "
        />
        <div v-if="!item.isClosed && !item.isOpen24Hours" class="hours-day__times">
          <AppInput
            type="time"
            :model-value="item.periods?.[0]?.opensAt ?? ''"
            :label="t('owner.editor.hours.opens')"
            @update:model-value="updateTime(item.day, 'opensAt', $event)"
          />
          <AppInput
            type="time"
            :model-value="item.periods?.[0]?.closesAt ?? ''"
            :label="t('owner.editor.hours.closes')"
            :error="
              !isDailyOpeningHoursValid(item) ? t('owner.editor.validation.time_range') : undefined
            "
            @update:model-value="updateTime(item.day, 'closesAt', $event)"
          />
        </div>
        <span v-if="item.isClosed" class="hours-day__closed">{{
          t('owner.editor.hours.closed')
        }}</span>
      </article>
    </div>
    <p class="hours-step__hint">{{ t('owner.editor.hours.overnight_hint') }}</p>
  </section>
</template>

<style scoped>
.hours-step,
.hours-step__days {
  display: grid;
  gap: var(--space-4);
}
header h3,
header p,
.hours-step__hint {
  margin: 0;
}
header p,
.hours-step__hint,
.hours-day__closed {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.hours-step__actions {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding-bottom: var(--space-1);
  scrollbar-width: none;
}
.hours-step__actions::-webkit-scrollbar {
  display: none;
}
.hours-step__actions > * {
  flex: 0 0 auto;
}
.hours-day {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}
.hours-day__times {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
@media (max-width: 350px) {
  .hours-day__times {
    grid-template-columns: 1fr;
  }
}
</style>
