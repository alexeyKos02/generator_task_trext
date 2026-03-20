<template>
  <div class="card">
    <button class="card__row" @click="open = !open">
      <div class="card__left">
        <span class="card__accent" :class="accentClass"></span>
        <svg class="card__chevron" :class="{ 'open': open }"
          width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="card__name">{{ agent.name }}</span>
      </div>
      <span class="card__pill" :class="accentClass">
        {{ agent.problemTerminals.length }}
      </span>
    </button>

    <Transition name="drop">
      <div v-if="open" class="card__body">
        <div v-for="t in agent.problemTerminals" :key="t.id" class="card__terminal">
          <span class="card__id">{{ t.id }}</span>
          <span class="card__badge" :class="badgeClass(t.status)">{{ t.status }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Agent } from '../types'

const props = defineProps<{ agent: Agent }>()
const open = ref(false)

function badgeClass(status: string) {
  const s = status.toLowerCase().trim()
  if (s === 'не добавлен')                return 'badge--red'
  if (s === 'ожидает guid')               return 'badge--yellow'
  if (s.startsWith('ожидает добавления')) return 'badge--orange'
  if (s === 'добавлен без сертификата')   return 'badge--orange'
  if (s === 'без игр')                    return 'badge--blue'
  return 'badge--gray'
}

// Цвет акцента = самый «тяжёлый» статус среди терминалов агента
const accentClass = computed(() => {
  const classes = props.agent.problemTerminals.map(t => badgeClass(t.status))
  if (classes.includes('badge--red'))    return 'accent--red'
  if (classes.includes('badge--orange')) return 'accent--orange'
  if (classes.includes('badge--yellow')) return 'accent--yellow'
  if (classes.includes('badge--blue'))   return 'accent--blue'
  return 'accent--gray'
})
</script>

<style scoped>
.card {
  border-bottom: 1px solid #f1f5f9;
}
.card:last-child { border-bottom: none; }

/* Строка агента */
.card__row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 14px 7px 0;
  background: none;
  border: none;
  cursor: pointer;
  gap: 10px;
  transition: background 0.12s;
}
.card__row:hover { background: #f8fafc; }

.card__left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

/* Цветная полоска слева */
.card__accent {
  display: block;
  width: 3px;
  height: 20px;
  border-radius: 99px;
  flex-shrink: 0;
}
.accent--red    .card__accent, .card__accent.accent--red    { background: #ef4444; }
.accent--orange .card__accent, .card__accent.accent--orange { background: #f97316; }
.accent--yellow .card__accent, .card__accent.accent--yellow { background: #eab308; }
.accent--blue   .card__accent, .card__accent.accent--blue   { background: #3b82f6; }
.accent--gray   .card__accent, .card__accent.accent--gray   { background: #d1d5db; }

.card__chevron {
  flex-shrink: 0;
  color: #cbd5e1;
  transition: transform 0.18s;
}
.card__chevron.open { transform: rotate(90deg); }

.card__name {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Пилюля-счётчик */
.card__pill {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 99px;
  min-width: 22px;
  text-align: center;
}
.card__pill.accent--red    { background: #fee2e2; color: #dc2626; }
.card__pill.accent--orange { background: #ffedd5; color: #ea580c; }
.card__pill.accent--yellow { background: #fef9c3; color: #ca8a04; }
.card__pill.accent--blue   { background: #dbeafe; color: #2563eb; }
.card__pill.accent--gray   { background: #f1f5f9; color: #94a3b8; }

/* Список терминалов */
.card__body {
  padding: 2px 14px 8px 25px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card__terminal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}

.card__id {
  font-size: 12px;
  color: #64748b;
  font-family: ui-monospace, 'SF Mono', monospace;
  letter-spacing: 0.01em;
}

.card__badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 99px;
  white-space: nowrap;
}
.badge--red    { background: #fee2e2; color: #dc2626; }
.badge--orange { background: #ffedd5; color: #ea580c; }
.badge--yellow { background: #fef9c3; color: #ca8a04; }
.badge--blue   { background: #dbeafe; color: #2563eb; }
.badge--gray   { background: #f1f5f9; color: #94a3b8; }

/* Анимация */
.drop-enter-active, .drop-leave-active {
  transition: all 0.18s ease;
  overflow: hidden;
}
.drop-enter-from, .drop-leave-to  { opacity: 0; max-height: 0; }
.drop-enter-to,   .drop-leave-from { opacity: 1; max-height: 400px; }
</style>
