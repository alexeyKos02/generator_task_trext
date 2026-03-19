<template>
  <div class="search-form card">
    <h2 class="search-form__heading">Параметры</h2>

    <div class="form-group">
      <label class="form-label" for="template-select">Тип сообщения</label>
      <div class="select-wrapper">
        <select
          id="template-select"
          class="form-select"
          :value="modelTemplateId"
          @change="$emit('update:modelTemplateId', ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>Выберите тип...</option>
          <option v-for="t in templates" :key="t.id" :value="t.id">
            {{ t.label }}
          </option>
        </select>
        <span class="select-arrow">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="agent-input">Наименование ЮЛ / агента</label>
      <input
        id="agent-input"
        class="form-input"
        type="text"
        placeholder="Введите часть названия..."
        :value="modelQuery"
        @input="$emit('update:modelQuery', ($event.target as HTMLInputElement).value)"
        @keydown.enter="$emit('submit')"
      />
      <p class="form-hint">Поиск по части названия, без учёта регистра и кавычек</p>
    </div>

    <button
      class="btn btn-primary"
      :disabled="!canSubmit || loading"
      @click="$emit('submit')"
    >
      <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
      <span>{{ loading ? 'Поиск...' : 'Сгенерировать' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { MessageTemplate } from '../types'

defineProps<{
  modelTemplateId: string
  modelQuery: string
  templates: MessageTemplate[]
  loading: boolean
  canSubmit: boolean
}>()

defineEmits<{
  'update:modelTemplateId': [value: string]
  'update:modelQuery': [value: string]
  submit: []
}>()
</script>

<style scoped>
.search-form__heading {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.select-wrapper {
  position: relative;
}

.form-select {
  appearance: none;
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-hint {
  margin: 5px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  width: 100%;
  justify-content: center;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
