import type { Agent } from '../types'

/**
 * Нормализует строку для нечёткого поиска:
 * - приводит к нижнему регистру
 * - унифицирует кавычки
 * - унифицирует дефисы/тире
 * - удаляет лишние пробелы
 * - опционально: ё → е
 */
function normalize(str: string, replaceYo = true): string {
  let result = str.toLowerCase()
  // Кавычки
  result = result.replace(/[«»""„‟‹›]/g, '"')
  // Тире и дефисы
  result = result.replace(/[–—−]/g, '-')
  // Ё → Е
  if (replaceYo) {
    result = result.replace(/ё/g, 'е')
  }
  // Лишние пробелы
  result = result.replace(/\s+/g, ' ').trim()
  return result
}

/**
 * Ищет агентов по части названия.
 * Поиск нечувствителен к регистру, кавычкам, тире, пробелам и ё/е.
 */
export function searchAgents(agents: Agent[], query: string): Agent[] {
  const q = normalize(query)
  if (!q) return []

  return agents.filter((agent) => normalize(agent.name).includes(q))
}
