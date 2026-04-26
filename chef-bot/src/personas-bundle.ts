// Bundle persona + system prompts at deploy time.
//
// Wrangler's Text rule (in wrangler.jsonc) inlines these markdown files
// as JS string exports. So when community PRs a change to a persona file
// in skills/chef-bot/personas/*.md, redeploying picks it up automatically.
//
// To add a new persona: drop personas/<name>.md, then import + register
// here AND in src/routing.ts (PersonaKey + selectPersona).

import tangniuPrompt from '../../skills/chef-bot/personas/tangniu.md'
import remyPrompt from '../../skills/chef-bot/personas/remy.md'
import systemPromptText from '../../skills/chef-bot/system-prompt.md'

import type { PersonaKey } from './routing'

export const personas: Record<PersonaKey, string> = {
  tangniu: tangniuPrompt,
  remy: remyPrompt,
}

export const systemPrompt: string = systemPromptText
