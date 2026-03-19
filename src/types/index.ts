export interface Agent {
  name: string
  gateId: number | null
  guid1c: string
  salesChannel1cbu: string
  salesChannelReports: string
  terminalIds: number[]
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
