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
          instructions: 'Use one consistent, clearly synthetic childlike feminine voice with a youthful, gentle quality, like a sweet little girl warmly inviting her family and friends to her birthday and baptism. Sound innocent, affectionate, cheerful, playful, and naturally bubbly, with a soft smile in the voice and a few light, expressive lifts of excitement. Keep the pitch comfortable and natural: do not squeak, shout, or sound like a cartoon. Speak at a relaxed, normal conversational pace with clear pronunciation and smooth phrasing—not rushed or drawn out. Leave a brief natural pause between sentences and a shorter pause at commas. Avoid robotic, overly dramatic, mature adult-announcer, or sleepy delivery. Speak only the supplied words; do not add laughter, sounds, or words.',
          speed: 0.92,
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
