<template>
  <div class="result-block card">
    <div class="result-block__header">
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Результат сгенерирован</span>
    </div>

    <!-- Заголовок -->
    <div class="result-field">
      <div class="result-field__label-row">
        <label class="result-field__label">Заголовок</label>
        <button
          class="copy-btn"
          :class="{ 'copy-btn--copied': copiedTitle }"
          @click="copyText(message.title, 'title')"
          title="Скопировать заголовок"
        >
          <svg v-if="!copiedTitle" width="14" height="14" fill="none" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ copiedTitle ? 'Скопировано!' : 'Скопировать' }}
        </button>
      </div>
      <div class="result-field__value result-field__value--single">{{ message.title }}</div>
    </div>

    <!-- Текст -->
    <div class="result-field">
      <div class="result-field__label-row">
        <label class="result-field__label">Текст</label>
        <button
          class="copy-btn"
          :class="{ 'copy-btn--copied': copiedBody }"
          @click="copyText(message.body, 'body')"
          title="Скопировать текст"
        >
          <svg v-if="!copiedBody" width="14" height="14" fill="none" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ copiedBody ? 'Скопировано!' : 'Скопировать' }}
        </button>
      </div>
      <div class="result-field__value result-field__value--multi">{{ message.body }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GeneratedMessage } from '../types'

defineProps<{
  message: GeneratedMessage
}>()

const copiedTitle = ref(false)
const copiedBody = ref(false)

async function copyText(text: string, which: 'title' | 'body') {
  try {
    await navigator.clipboard.writeText(text)
    if (which === 'title') {
      copiedTitle.value = true
      setTimeout(() => { copiedTitle.value = false }, 2000)
    } else {
      copiedBody.value = true
      setTimeout(() => { copiedBody.value = false }, 2000)
    }
  } catch {
    // fallback для старых браузеров
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    if (which === 'title') {
      copiedTitle.value = true
      setTimeout(() => { copiedTitle.value = false }, 2000)
    } else {
      copiedBody.value = true
      setTimeout(() => { copiedBody.value = false }, 2000)
    }
  }
}
</script>

<style scoped>
.result-block__header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #065f46;
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 18px;
}

.result-field {
  margin-bottom: 16px;
}

.result-field:last-child {
  margin-bottom: 0;
}

.result-field__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.result-field__label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.result-field__value {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  color: #111827;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.result-field__value--single {
  font-weight: 500;
}

.result-field__value--multi {
  min-height: 80px;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  font-weight: 500;
}

.copy-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.copy-btn--copied {
  background: #ecfdf5;
  border-color: #6ee7b7;
  color: #059669;
}
</style>
