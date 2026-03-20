<template>
  <div class="reminders">
    <!-- Заголовок с кнопкой сворачивания -->
    <button class="reminders__header" @click="collapsed = !collapsed">
      <div class="reminders__title-row">
        <span class="reminders__icon">🔔</span>
        <span class="reminders__title">Требуют внимания</span>
        <span v-if="totalCount > 0" class="reminders__badge">{{ totalCount }}</span>
        <span v-else class="reminders__badge reminders__badge--ok">✓ Всё ок</span>
      </div>
      <svg
        class="reminders__chevron"
        :class="{ 'reminders__chevron--open': !collapsed }"
        width="16" height="16" fill="none" viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <Transition name="slide">
      <div v-if="!collapsed" class="reminders__body">
        <!-- Пусто -->
        <div v-if="totalCount === 0" class="reminders__empty">
          Все агенты и терминалы в порядке 🎉
        </div>

        <template v-else>
          <!-- Группа: Нет сертификата Столото -->
          <ReminderGroup
            v-if="groups.noCert.length"
            label="Нет сертификата (Столото)"
            color="red"
            :items="groups.noCert"
          />

          <!-- Группа: Нет сертификата МТС -->
          <ReminderGroup
            v-if="groups.noCertMts.length"
            label="Нет сертификата (МТС)"
            color="orange"
            :items="groups.noCertMts"
          />

          <!-- Группа: Билеты не продаются -->
          <ReminderGroup
            v-if="groups.noTickets.length"
            label="Билеты не продаются"
            color="yellow"
            :items="groups.noTickets"
          />

          <!-- Группа: На стопе / комментарий -->
          <ReminderGroup
            v-if="groups.stopped.length"
            label="На стопе"
            color="gray"
            :items="groups.stopped"
          />

          <!-- Группа: Заблокированные терминалы -->
          <ReminderGroup
            v-if="groups.blocked.length"
            label="Заблокированные терминалы"
            color="red"
            :items="groups.blocked"
          />

          <!-- Группа: Без игр -->
          <ReminderGroup
            v-if="groups.noGames.length"
            label="Нет игр на терминале"
            color="orange"
            :items="groups.noGames"
          />

          <!-- Группа: Другое -->
          <ReminderGroup
            v-if="groups.other.length"
            label="Другое"
            color="gray"
            :items="groups.other"
          />
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Agent } from '../types'
import ReminderGroup from './ReminderGroup.vue'

const props = defineProps<{ agents: Agent[] }>()

const collapsed = ref(false)

// ─── Группируем агентов по типу проблемы ─────────────────────────────────────
const groups = computed(() => {
  const noCert: string[]    = []
  const noCertMts: string[] = []
  const noTickets: string[] = []
  const stopped: string[]   = []
  const blocked: string[]   = []
  const noGames: string[]   = []
  const other: string[]     = []

  for (const a of props.agents) {
    if (!a.certAdded)    noCert.push(a.name)
    if (!a.certMtsAdded) noCertMts.push(a.name)
    if (!a.ticketsSelling) noTickets.push(a.name)
    if (a.comment)       stopped.push(`${a.name} — ${a.comment}`)

    for (const t of a.problemTerminals) {
      const label = `${a.name} — терминал ${t.id}`
      if (t.status === 'заблокирован') blocked.push(label)
      else if (t.status === 'без игр') noGames.push(label)
      else other.push(`${label} (${t.status})`)
    }
  }

  return { noCert, noCertMts, noTickets, stopped, blocked, noGames, other }
})

const totalCount = computed(() =>
  Object.values(groups.value).reduce((sum, arr) => sum + arr.length, 0)
)
</script>

<style scoped>
.reminders {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.reminders__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.reminders__header:hover {
  background: #f9fafb;
}

.reminders__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reminders__icon {
  font-size: 16px;
}

.reminders__title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.reminders__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 99px;
  background: #fee2e2;
  color: #dc2626;
  font-size: 12px;
  font-weight: 700;
}

.reminders__badge--ok {
  background: #dcfce7;
  color: #16a34a;
}

.reminders__chevron {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.reminders__chevron--open {
  transform: rotate(180deg);
}

.reminders__body {
  border-top: 1px solid #e5e7eb;
  padding: 12px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reminders__empty {
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  padding: 8px 0;
}

/* Transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>
