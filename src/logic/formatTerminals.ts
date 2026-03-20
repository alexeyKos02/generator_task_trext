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
 * Возвращает правильную форму слова «терминал» по правилам русского языка.
 * 1        → "терминал"
 * 2–4      → "терминала"
 * 5+, 11–14 → "терминалов"
 */
export function terminalWord(count: number): string {
  const mod100 = count % 100
  const mod10 = count % 10

  if (mod100 >= 11 && mod100 <= 14) return 'терминалов'
  if (mod10 === 1) return 'терминал'
  if (mod10 >= 2 && mod10 <= 4) return 'терминала'
  return 'терминалов'
}
