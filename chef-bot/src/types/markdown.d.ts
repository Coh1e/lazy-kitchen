// Allow `import md from '*.md'` to type-check.
// Wrangler's Text loader (configured in wrangler.jsonc `rules`) bundles
// matching files as string exports.
declare module '*.md' {
  const content: string
  export default content
}
