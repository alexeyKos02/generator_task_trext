<template>
  <div class="reminders">
    <button class="reminders__header" @click="collapsed = !collapsed">
      <div class="reminders__title-row">
        <span class="reminders__icon">🔔</span>
        <span class="reminders__title">Требуют внимания</span>
        <span v-if="problemAgents.length > 0" class="reminders__badge">
          {{ problemAgents.length }}
        </span>
        <span v-else class="reminders__badge reminders__badge--ok">✓ Всё ок</span>
      </div>
      <svg
        class="reminders__chevron"
        :class="{ 'reminders__chevron--open': !collapsed }"
        width="16" height="16" fill="none" viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" stroke="#6b7280" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <Transition name="slide">
      <div v-if="!collapsed" class="reminders__body">
        <div v-if="problemAgents.length === 0" class="reminders__empty">
          Все терминалы в порядке 🎉
        </div>

        <AgentReminderCard
          v-for="agent in problemAgents"
          :key="agent.gateId"
          :agent="agent"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Agent } from '../types'
import AgentReminderCard from './AgentReminderCard.vue'

const props = defineProps<{ agents: Agent[] }>()

const collapsed = ref(false)

// Только агенты у которых есть проблемные терминалы
const problemAgents = computed(() =>
  props.agents.filter(a => a.problemTerminals.length > 0)
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

.reminders__icon { font-size: 16px; }

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
  padding: 0;
  display: flex;
  flex-direction: column;
}

.reminders__empty {
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  padding: 8px 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to { opacity: 0; max-height: 0; }
.slide-enter-to,
.slide-leave-from { opacity: 1; max-height: 2000px; }
</style>
