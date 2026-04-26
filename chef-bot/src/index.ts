import { generateObject } from 'ai'
import { selectPersona, personaLabel } from './routing'
import { getModel, type Env } from './llm'
import { personas, systemPrompt } from './personas-bundle'
import { RequestSchema, ResponseSchema } from './schema'

const AVATAR_BASE = 'https://bep.coh1e.com/avatars'

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === 'GET') {
      // Health check — handy for sanity-pinging the URL after deploy.
      return Response.json({ ok: true, service: 'lazy-kitchen-chef-bot' })
    }
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Optional bearer token check.
    if (env.AUTH_TOKEN) {
      const auth = req.headers.get('authorization')
      if (auth !== `Bearer ${env.AUTH_TOKEN}`) {
        return new Response('Unauthorized', { status: 401 })
      }
    }

    // Parse + validate request body.
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return new Response('Invalid JSON', { status: 400 })
    }
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return new Response(`Bad request: ${parsed.error.message}`, { status: 400 })
    }
    const input = parsed.data

    // Pick persona + LLM.
    const personaKey = selectPersona(input.country)
    const personaPrompt = personas[personaKey]
    const model = getModel(personaKey, env)

    const userMsg = [
      `加菜请求 (issue 提交):`,
      `菜名 (zh): ${input.dish_zh}`,
      `菜名 (en): ${input.dish_en}`,
      `菜系: ${input.country}${input.region ? ` / ${input.region}` : ''}`,
      input.notes ? `备注:\n${input.notes}` : '',
      '',
      '请按 system prompt 中的 schema 输出完整 JSON。',
    ].filter(Boolean).join('\n')

    try {
      const { object } = await generateObject({
        model,
        system: `${systemPrompt}\n\n---\n\n${personaPrompt}`,
        prompt: userMsg,
        schema: ResponseSchema,
      })

      return Response.json({
        ...object,
        dish: {
          ...object.dish,
          status: 'proposed',          // chef-bot always emits proposed (community审 + maintainer merge gate it)
          cross_reviewed: false,       // machine mode never marks reviewed
          cross_reviewer_cli: 'skipped',
        },
        agent_label: personaLabel(personaKey),
        agent_avatar_url: `${AVATAR_BASE}/${personaKey}.png`,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      return new Response(`LLM error: ${msg}`, { status: 502 })
    }
  },
} satisfies ExportedHandler<Env>
