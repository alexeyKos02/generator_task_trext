import type { MessageTemplate } from '../types'
import { formatTerminalIds, terminalWord } from './formatTerminals'

/**
 * Реестр шаблонов Jira-сообщений.
 *
 * Чтобы добавить новый тип — достаточно добавить объект в этот массив.
 * Никаких других изменений в коде не требуется.
 */
export const templates: MessageTemplate[] = [
  // ─── 1. Прописка сертификатов PROD ────────────────────────────────────────
  {
    id: 'cert-prod',
    label: 'Прописка сертификатов PROD',
    requiredFields: ['name', 'gateId', 'terminalIds'],
    buildTitle: (agent) => `${agent.name} — прописка сертификатов для PROD`,
    buildBody: (agent) => {
      const formatted = formatTerminalIds(agent.terminalIds)
      const count = agent.terminalIds.length
      return (
        `Коллеги, добрый день!\n` +
        `Прошу вас валидировать и прописать сертификаты для PROD среды партнёру ${agent.name}.\n` +
        `ID Agent: ${agent.gateId}\n` +
        `Номера терминалов: ${formatted} (${count} шт.)\n` +
        `Сертификаты прикладываю во вложении, архив — без пароля.\n` +
        `Также для Mercury.\n` +
        `Спасибо!`
      )
    },
  },

  // ─── 2. Доп терминалы — прописка сертификатов PROD ───────────────────────
  {
    id: 'extra-terminals-cert-prod',
    label: 'Доп терминалы — прописка сертификатов PROD',
    requiredFields: ['name', 'terminalIds'],
    buildTitle: (agent) =>
      `Доп терминалы - ${agent.name} — прописка сертификатов для PROD`,
    buildBody: (agent) => {
      const formatted = formatTerminalIds(agent.terminalIds)
      const word = terminalWord(agent.terminalIds.length)
      return `Добрый день! Добавьте, пожалуйста, ${word} с id = ${formatted}`
    },
  },

  // ─── 3. Выделение GUID 1С ─────────────────────────────────────────────────
  {
    id: 'guid-1c',
    label: 'Выделение GUID 1С',
    requiredFields: ['name', 'gateId', 'guid1c'],
    buildTitle: (agent) => `${agent.name} — выделение GUID 1С`,
    buildBody: (agent) =>
      `Коллеги, добрый день!\n` +
      `Просьба присвоить GUID 1С ранее заведённому агенту в ОХД.\n\n` +
      `Наименование агента: ${agent.name}\n` +
      `GATE ID: ${agent.gateId}\n` +
      `GUID 1C: ${agent.guid1c}\n` +
      `Канал продаж для 1СБУ: Розница\n` +
      `Канал продаж для отчетов: Точка продаж\n\n` +
      `Спасибо!`,
  },
]
