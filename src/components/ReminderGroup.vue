<template>
  <div class="group">
    <div class="group__header">
      <span class="group__dot" :class="`group__dot--${color}`"></span>
      <span class="group__label">{{ label }}</span>
      <span class="group__count">{{ items.length }}</span>
    </div>
    <ul class="group__list">
      <li v-for="item in items" :key="item" class="group__item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  color: 'red' | 'orange' | 'yellow' | 'gray'
  items: string[]
}>()
</script>

<style scoped>
.group__header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.group__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.group__dot--red    { background: #ef4444; }
.group__dot--orange { background: #f97316; }
.group__dot--yellow { background: #eab308; }
.group__dot--gray   { background: #9ca3af; }

.group__label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.group__count {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  background: #f3f4f6;
  border-radius: 99px;
  padding: 1px 7px;
}

.group__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.group__item {
  font-size: 13px;
  color: #4b5563;
  padding: 3px 0 3px 14px;
  position: relative;
  line-height: 1.4;
}

.group__item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #d1d5db;
}
</style>
