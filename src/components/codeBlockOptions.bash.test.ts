import { describe, expect, it } from 'vitest'
import { createTolariaCodeBlockOptions } from './codeBlockOptions'

describe('Bash code block highlighting', () => {
  it('offers one canonical Bash picker option for common shell aliases', () => {
    const options = createTolariaCodeBlockOptions()

    expect(options.supportedLanguages?.bash).toMatchObject({
      name: 'Bash',
      aliases: ['bash', 'sh', 'shell', 'shellscript', 'zsh'],
    })
    expect(options.supportedLanguages?.shellscript).toBeUndefined()
  })

  it('loads and applies the Shiki shell grammar through the Bash alias', async () => {
    const highlighter = await createTolariaCodeBlockOptions().createHighlighter?.()

    await expect(highlighter?.loadLanguage('bash')).resolves.toBeUndefined()
    expect(highlighter?.getLoadedLanguages()).toContain('bash')

    const html = await highlighter?.codeToHtml('echo "$HOME"', {
      lang: 'bash',
      theme: 'github-light',
    })
    expect(html).toContain('color:#005CC5')
  })
})
