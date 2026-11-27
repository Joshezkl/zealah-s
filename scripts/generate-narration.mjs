import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.error('OPENAI_API_KEY is not set. Set it in this terminal, then run npm run generate:audio.')
  process.exitCode = 1
} else {
  const projectRoot = fileURLToPath(new URL('..', import.meta.url))
  const steps = JSON.parse(await readFile(join(projectRoot, 'src', 'presentation.json'), 'utf8'))
  const outputDirectory = join(projectRoot, 'public', 'assets', 'audio')
  const stagingDirectory = await mkdtemp(join(tmpdir(), 'zaelah-tts-'))

  try {
    for (const step of steps) {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          voice: 'shimmer',
          input: step.narration,
          instructions: 'Use a consistent, clearly synthetic childlike feminine voice with a youthful higher register. Sound soft, sweet, innocent, cheerful, and gently playful, like a young girl warmly inviting her guests. Keep the delivery natural, clear, and easy to understand, with light youthful intonation rather than exaggerated pitch or baby talk. Avoid an adult announcer style. Speak only the supplied words.',
          response_format: 'mp3',
        }),
      })

      if (!response.ok) {
        throw new Error(`TTS request for ${step.id} failed with HTTP ${response.status}. Check the API key, account access, and billing, then retry.`)
      }

      const audio = Buffer.from(await response.arrayBuffer())
      const hasId3Header = audio.subarray(0, 3).toString('ascii') === 'ID3'
      const hasMpegFrameHeader = audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0
      if (audio.length < 1_000 || (!hasId3Header && !hasMpegFrameHeader)) {
        throw new Error(`TTS returned invalid MP3 data for ${step.id}; no file was installed.`)
      }

      await writeFile(join(stagingDirectory, `${step.id}.mp3`), audio)
      console.log(`Generated ${step.id}.mp3 (${audio.length} bytes)`)
    }

    await mkdir(outputDirectory, { recursive: true })
    for (const step of steps) {
      await rename(
        join(stagingDirectory, `${step.id}.mp3`),
        join(outputDirectory, `${step.id}.mp3`),
      )
    }
    console.log(`Installed ${steps.length} narration MP3s in public/assets/audio/.`)
  } finally {
    await rm(stagingDirectory, { recursive: true, force: true })
  }
}
