import type { Agent, MessageTemplate, ValidationError } from '../types'

const FIELD_LABELS: Record<keyof Agent, string> = {
  name: 'Наименование',
  gateId: 'GATE ID',
  guid1c: 'GUID 1C',
  salesChannel1cbu: 'Канал продаж для 1СБУ',
  salesChannelReports: 'Канал продаж для отчетов',
  terminalIds: 'ID терминалов',
}

/**
 * Проверяет, заполнены ли все поля, необходимые для шаблона.
 * Возвращает список ошибок (пустой массив = всё ок).
 */
export function validateAgent(agent: Agent, template: MessageTemplate): ValidationError[] {
  const errors: ValidationError[] = []

  for (const field of template.requiredFields) {
    const value = agent[field]

    if (field === 'terminalIds') {
      if (!Array.isArray(value) || (value as number[]).length === 0) {
        errors.push({ field, label: FIELD_LABELS[field] })
      }
    } else if (value === null || value === undefined || value === '') {
      errors.push({ field, label: FIELD_LABELS[field] })
    }
  }

  return errors
}
