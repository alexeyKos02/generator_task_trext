export interface ProblemTerminal {
  id: number
  status: 'заблокирован' | 'без игр' | 'другое' | string
}

export interface Agent {
  name: string
  gateId: number | null
  guid1c: string
  salesChannel1cbu: string
  salesChannelReports: string
  terminalIds: number[]
  // Флаги из листа СВОДНАЯ
  certAdded: boolean
  certMtsAdded: boolean
  ticketsSelling: boolean
  comment: string | null
  // Терминалы с нестандартным статусом (не «добавлен»)
  problemTerminals: ProblemTerminal[]
}

export interface MessageTemplate {
  id: string
  label: string
  requiredFields: (keyof Agent)[]
  buildTitle: (agent: Agent) => string
  buildBody: (agent: Agent) => string
}

export interface GeneratedMessage {
  title: string
  body: string
}

export type AppState = 'idle' | 'multiple' | 'error' | 'result'

export interface ValidationError {
  field: keyof Agent
  label: string
}
