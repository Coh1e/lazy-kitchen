import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { PersonaKey } from './routing'

export interface Env {
  DEEPSEEK_API_KEY: string
  GEMINI_API_KEY: string
  /** Optional Bearer token. If set, requests must carry `Authorization: Bearer <token>`. */
  AUTH_TOKEN?: string
}

/**
 * Persona → LLM model. Each persona has its own provider + model.
 * Model IDs as of 2026-04 — adjust here when providers release new versions.
 */
export function getModel(persona: PersonaKey, env: Env) {
  switch (persona) {
    case 'tangniu': {
      const deepseek = createDeepSeek({ apiKey: env.DEEPSEEK_API_KEY })
      return deepseek('deepseek-chat')
    }
    case 'remy': {
      const google = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY })
      return google('gemini-2.5-flash')
    }
  }
}
