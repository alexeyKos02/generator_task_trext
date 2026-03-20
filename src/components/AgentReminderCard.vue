<template>
  <div class="card">
    <button class="card__header" @click="open = !open">
      <div class="card__name-row">
        <svg class="card__chevron" :class="{ 'card__chevron--open': open }"
          width="14" height="14" fill="none" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" stroke="#9ca3af" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="card__name">{{ agent.name }}</span>
      </div>
      <span class="card__count">{{ agent.problemTerminals.length }}</span>
    </button>

    <Transition name="expand">
      <ul v-if="open" class="card__list">
        <li
          v-for="t in agent.problemTerminals"
          :key="t.id"
          class="card__item"
        >
          <span class="card__terminal-id">{{ t.id }}</span>
          <span class="card__badge" :class="badgeClass(t.status)">
            {{ t.status }}
          </span>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Agent } from '../types'

defineProps<{ agent: Agent }>()

const open = ref(false)

function badgeClass(status: string): string {
  const s = status.toLowerCase().trim()
  if (s === 'не добавлен')                       return 'badge--red'
  if (s === 'ожидает guid')                      return 'badge--yellow'
  if (s.startsWith('ожидает добавления'))        return 'badge--orange'
  if (s === 'добавлен без сертификата')          return 'badge--orange'
  if (s === 'без игр')                           return 'badge--blue'
  return 'badge--gray'
}
</script>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
}

.card__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 8px;
  transition: background 0.15s;
}

.card__header:hover {
  background: #f3f4f6;
}

.card__name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.card__chevron {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.card__chevron--open {
  transform: rotate(90deg);
}

.card__name {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__count {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  background: #e5e7eb;
  border-radius: 99px;
  padding: 1px 8px;
}

/* Список терминалов */
.card__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid #e5e7eb;
}

.card__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  gap: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.card__item:last-child {
  border-bottom: none;
}

.card__terminal-id {
  font-size: 13px;
  color: #374151;
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, monospace;
}

/* Бейджи статусов */
.card__badge {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 99px;
  white-space: nowrap;
}

.badge--red {
  background: #fee2e2;
  color: #dc2626;
}

.badge--orange {
  background: #ffedd5;
  color: #ea580c;
}

.badge--yellow {
  background: #fef9c3;
  color: #ca8a04;
}

.badge--blue {
  background: #dbeafe;
  color: #2563eb;
}

.badge--gray {
  background: #f3f4f6;
  color: #6b7280;
}

/* Анимация разворачивания */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>
