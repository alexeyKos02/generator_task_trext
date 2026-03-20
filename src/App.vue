<template>
  <div class="app">
    <AppHeader />

    <main class="app__main">
      <!-- Загрузка данных -->
      <div v-if="dataState === 'loading'" class="data-status data-status--loading">
        <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#d1d5db" stroke-width="2.5"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        Загрузка данных…
      </div>

      <!-- Ошибка загрузки данных -->
      <div v-else-if="dataState === 'error'" class="data-status data-status--error">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2"/>
          <path d="M12 8v4m0 4h.01" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Не удалось загрузить данные. <button class="retry-btn" @click="loadAgents">Повторить</button>
      </div>

      <div v-else class="layout">
        <!-- Левая панель: форма -->
        <aside class="layout__sidebar">
          <SearchForm
            v-model:modelTemplateId="selectedTemplateId"
            v-model:modelQuery="query"
            :templates="templates"
            :loading="false"
            :canSubmit="canSubmit"
            @submit="handleGenerate"
          />
        </aside>

        <!-- Правая панель: результат -->
        <section class="layout__content">
          <Transition name="fade" mode="out-in">
            <!-- Пустое состояние -->
            <div v-if="state === 'idle'" key="idle" class="empty-state">
              <div class="empty-state__icon">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p class="empty-state__title">Результат появится здесь</p>
              <p class="empty-state__text">
                Выберите тип сообщения, введите название ЮЛ / агента и нажмите «Сгенерировать»
              </p>
              <p class="empty-state__hint">
                Данные: {{ agents.length }} агентов
              </p>
            </div>

            <!-- Несколько совпадений -->
            <MultipleResults
              v-else-if="state === 'multiple'"
              key="multiple"
              :agents="foundAgents"
              @select="handleSelectAgent"
            />

            <!-- Ошибка -->
            <ErrorBlock
              v-else-if="state === 'error'"
              key="error"
              :title="errorTitle"
              :detail="errorDetail"
              :items="errorItems"
            />

            <!-- Результат -->
            <ResultBlock
              v-else-if="state === 'result' && generatedMessage"
              key="result"
              :message="generatedMessage"
            />
          </Transition>
        </section>
      </div>
    </main>

    <footer class="app-footer">
      <p>Jira Generator — внутренний инструмент</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import AppHeader from './components/AppHeader.vue'
import SearchForm from './components/SearchForm.vue'
import MultipleResults from './components/MultipleResults.vue'
import ResultBlock from './components/ResultBlock.vue'
import ErrorBlock from './components/ErrorBlock.vue'

import { templates } from './logic/templates'
import { searchAgents } from './logic/search'
import { validateAgent } from './logic/validate'

import type { Agent, GeneratedMessage, AppState } from './types'

// ─── Загрузка данных ──────────────────────────────────────────────────────────
const agents = ref<Agent[]>([])
const dataState = ref<'loading' | 'ready' | 'error'>('loading')

async function loadAgents() {
  dataState.value = 'loading'
  try {
    // import.meta.env.BASE_URL = '/generator_task_trext/' в prod, '/' в dev
    const res = await fetch(`${import.meta.env.BASE_URL}agents.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    agents.value = await res.json()
    dataState.value = 'ready'
  } catch (e) {
    console.error('Ошибка загрузки agents.json:', e)
    dataState.value = 'error'
  }
}

onMounted(loadAgents)

// ─── Форма ───────────────────────────────────────────────────────────────────
const selectedTemplateId = ref('')
const query = ref('')

const canSubmit = computed(() => selectedTemplateId.value !== '' && query.value.trim() !== '')

// ─── Состояние приложения ────────────────────────────────────────────────────
const state = ref<AppState>('idle')

const foundAgents = ref<Agent[]>([])
const generatedMessage = ref<GeneratedMessage | null>(null)

const errorTitle = ref('')
const errorDetail = ref('')
const errorItems = ref<string[]>([])

// ─── Основная логика ─────────────────────────────────────────────────────────
function handleGenerate() {
  if (!canSubmit.value) return

  resetError()

  const results = searchAgents(agents.value, query.value)

  if (results.length === 0) {
    showError(
      'Агент не найден',
      `По запросу «${query.value.trim()}» ничего не найдено. Проверьте написание.`,
    )
    return
  }

  if (results.length > 1) {
    foundAgents.value = results
    state.value = 'multiple'
    return
  }

  buildMessage(results[0])
}

function handleSelectAgent(agent: Agent) {
  buildMessage(agent)
}

function buildMessage(agent: Agent) {
  const template = templates.find((t) => t.id === selectedTemplateId.value)
  if (!template) {
    showError('Шаблон не найден', 'Выберите тип сообщения из списка.')
    return
  }

  const errors = validateAgent(agent, template)
  if (errors.length > 0) {
    showError(
      'Недостаточно данных для генерации',
      `У агента «${agent.name}» не заполнены обязательные поля:`,
      errors.map((e) => e.label),
    )
    return
  }

  generatedMessage.value = {
    title: template.buildTitle(agent),
    body: template.buildBody(agent),
  }
  state.value = 'result'
}

function showError(title: string, detail = '', items: string[] = []) {
  errorTitle.value = title
  errorDetail.value = detail
  errorItems.value = items
  state.value = 'error'
}

function resetError() {
  errorTitle.value = ''
  errorDetail.value = ''
  errorItems.value = []
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f3f4f6;
}

.app__main {
  flex: 1;
  padding: 32px 24px;
}

/* Статусы загрузки данных */
.data-status {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 400px;
  margin: 80px auto;
  font-size: 14px;
  color: #6b7280;
}

.data-status--error {
  color: #ef4444;
}

.retry-btn {
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  text-decoration: underline;
}

.retry-btn:hover {
  color: #4f46e5;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 0.9s linear infinite;
  flex-shrink: 0;
}

.layout {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}

.layout__sidebar {
  position: sticky;
  top: 24px;
}

/* Пустое состояние */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 32px;
  background: #fff;
  border: 1.5px dashed #d1d5db;
  border-radius: 12px;
}

.empty-state__icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state__title {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 8px;
}

.empty-state__text {
  font-size: 13px;
  color: #9ca3af;
  max-width: 300px;
  line-height: 1.5;
  margin: 0;
}

.empty-state__hint {
  margin: 12px 0 0;
  font-size: 12px;
  color: #d1d5db;
}

/* Футер */
.app-footer {
  text-align: center;
  padding: 16px;
  font-size: 12px;
  color: #9ca3af;
  border-top: 1px solid #e5e7eb;
  background: #fff;
}

.app-footer p {
  margin: 0;
}

/* Адаптив */
@media (max-width: 768px) {
  .app__main {
    padding: 16px 12px;
  }

  .layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .layout__sidebar {
    position: static;
  }
}
</style>
