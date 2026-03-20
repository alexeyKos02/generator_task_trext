<template>
  <div class="item">
    <button class="item__row" @click="open = !open">
      <svg class="item__chevron" :class="{ open }" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4 2.5l4 3.5-4 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="item__dot" :class="dotClass" />
      <span class="item__name">{{ agent.name }}</span>
      <span class="item__count" :class="countClass">{{ agent.problemTerminals.length }}</span>
    </button>

    <Transition name="drop">
      <div v-if="open" class="item__terminals">
        <div v-for="t in agent.problemTerminals" :key="t.id" class="item__terminal">
          <span class="item__tid">{{ t.id }}</span>
          <span class="item__badge" :class="badgeClass(t.status)">{{ t.status }}</span>
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

const dotClass = computed(() => {
  const classes = props.agent.problemTerminals.map(t => badgeClass(t.status))
  if (classes.includes('badge--red'))    return 'dot--red'
  if (classes.includes('badge--orange')) return 'dot--orange'
  if (classes.includes('badge--yellow')) return 'dot--yellow'
  if (classes.includes('badge--blue'))   return 'dot--blue'
  return 'dot--gray'
})

const countClass = computed(() => dotClass.value.replace('dot--', 'count--'))
</script>

<style scoped>
.item {}

.item__row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.1s;
  text-align: left;
}
.item__row:hover { background: #f3f4f6; }

.item__chevron {
  flex-shrink: 0;
  color: #9ca3af;
  transition: transform 0.15s;
}
.item__chevron.open { transform: rotate(90deg); }

.item__dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.dot--red    { background: #ef4444; }
.dot--orange { background: #f97316; }
.dot--yellow { background: #eab308; }
.dot--blue   { background: #3b82f6; }
.dot--gray   { background: #d1d5db; }

.item__name {
  flex: 1;
  font-size: 13.5px;
  font-weight: 500;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item__count {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  padding: 0 6px;
  border-radius: 99px;
  text-align: center;
}
.count--red    { background: #fee2e2; color: #dc2626; }
.count--orange { background: #ffedd5; color: #ea580c; }
.count--yellow { background: #fef9c3; color: #ca8a04; }
.count--blue   { background: #dbeafe; color: #2563eb; }
.count--gray   { background: #f1f5f9; color: #94a3b8; }

.item__terminals {
  padding: 2px 16px 8px 44px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.item__terminal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
}

.item__tid {
  font-size: 11.5px;
  color: #94a3b8;
  font-family: ui-monospace, monospace;
}

.item__badge {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 99px;
  white-space: nowrap;
}
.badge--red    { background: #fee2e2; color: #dc2626; }
.badge--orange { background: #ffedd5; color: #ea580c; }
.badge--yellow { background: #fef9c3; color: #ca8a04; }
.badge--blue   { background: #dbeafe; color: #2563eb; }
.badge--gray   { background: #f1f5f9; color: #94a3b8; }

.drop-enter-active, .drop-leave-active { transition: all 0.15s ease; overflow: hidden; }
.drop-enter-from, .drop-leave-to  { opacity: 0; max-height: 0; }
.drop-enter-to,   .drop-leave-from { opacity: 1; max-height: 400px; }
</style>
