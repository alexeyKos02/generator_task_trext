/**
 * Форматирует список ID терминалов в читаемую строку.
 * Подряд идущие ID объединяются в диапазоны через «–».
 * Одиночные ID и несмежные диапазоны разделяются запятой.
 *
 * Примеры:
 *   [31954873]                           → "31954873"
 *   [31954873, 31954874, 31954875]       → "31954873–31954875"
 *   [31954873, 31954875, 31954878]       → "31954873, 31954875, 31954878"
 *   [31954873,31954874,31954880,31954882,31954883] → "31954873–31954874, 31954880, 31954882–31954883"
 */
export function formatTerminalIds(ids: number[]): string {
  if (ids.length === 0) return ''

  const sorted = [...ids].sort((a, b) => a - b)
  const segments: string[] = []

  let rangeStart = sorted[0]
  let rangeEnd = sorted[0]

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === rangeEnd + 1) {
      rangeEnd = sorted[i]
    } else {
      segments.push(rangeEnd > rangeStart ? `${rangeStart}–${rangeEnd}` : `${rangeStart}`)
      rangeStart = sorted[i]
      rangeEnd = sorted[i]
    }
  }
  segments.push(rangeEnd > rangeStart ? `${rangeStart}–${rangeEnd}` : `${rangeStart}`)

  return segments.join(', ')
}

/**
 * Возвращает правильную форму слова «терминал» в зависимости от количества.
 */
export function terminalWord(count: number): string {
  if (count === 1) return 'терминал'
  return 'терминалы'
}
