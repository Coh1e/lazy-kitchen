export type PersonaKey = 'tangniu' | 'remy'

const CN_COUNTRIES = new Set(['CN', 'HK', 'TW', 'MO'])

/**
 * Cuisine country → persona.
 *   CN/HK/TW/MO → 唐牛 (DeepSeek)
 *   everything else → Remy / 雷米 (Gemini)
 *
 * Adding a new persona? Update this function + add `personas/<name>.md` +
 * map the persona key to a model in `llm.ts`.
 */
export function selectPersona(country: string): PersonaKey {
  return CN_COUNTRIES.has(country.toUpperCase()) ? 'tangniu' : 'remy'
}

export function personaLabel(key: PersonaKey): string {
  switch (key) {
    case 'tangniu': return '唐牛'
    case 'remy': return 'Remy / 雷米'
  }
}
