<template>
  <div class="error-block" role="alert">
    <svg class="error-block__icon" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <path d="M12 8v4m0 4h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <div class="error-block__content">
      <p class="error-block__title">{{ title }}</p>
      <p v-if="detail" class="error-block__detail">{{ detail }}</p>
      <ul v-if="items && items.length" class="error-block__list">
        <li v-for="item in items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  detail?: string
  items?: string[]
}>()
</script>

<style scoped>
.error-block {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
}

.error-block__icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.error-block__content {
  flex: 1;
  min-width: 0;
}

.error-block__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #991b1b;
}

.error-block__detail {
  margin: 4px 0 0;
  font-size: 13px;
  color: #b91c1c;
}

.error-block__list {
  margin: 6px 0 0;
  padding-left: 18px;
  font-size: 13px;
  color: #b91c1c;
}

.error-block__list li {
  margin-bottom: 2px;
}
</style>
