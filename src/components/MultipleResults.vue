<template>
  <div class="multiple-results card">
    <div class="multiple-results__header">
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Найдено несколько совпадений ({{ agents.length }})</span>
    </div>
    <p class="multiple-results__hint">Выберите нужный вариант:</p>
    <ul class="multiple-results__list">
      <li
        v-for="agent in agents"
        :key="agent.name"
        class="multiple-results__item"
        @click="$emit('select', agent)"
      >
        <span class="multiple-results__name">{{ agent.name }}</span>
        <span class="multiple-results__meta">GATE ID: {{ agent.gateId ?? '—' }}</span>
        <svg class="multiple-results__arrow" width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Agent } from '../types'

defineProps<{
  agents: Agent[]
}>()

defineEmits<{
  select: [agent: Agent]
}>()
</script>

<style scoped>
.multiple-results__header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 14px;
}

.multiple-results__hint {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 10px;
}

.multiple-results__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.multiple-results__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
  background: #fff;
}

.multiple-results__item:hover {
  background: #eff6ff;
  border-color: #93c5fd;
  transform: translateY(-1px);
}

.multiple-results__item:active {
  transform: translateY(0);
}

.multiple-results__name {
  flex: 1;
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.multiple-results__meta {
  font-size: 12px;
  color: #9ca3af;
  flex-shrink: 0;
}

.multiple-results__arrow {
  flex-shrink: 0;
  opacity: 0.4;
  transition: opacity 0.15s;
}

.multiple-results__item:hover .multiple-results__arrow {
  opacity: 0.9;
}
</style>
