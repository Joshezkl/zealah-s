import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Music, Music2, Pause, Play, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react'
import IntroScreen from './screens/IntroScreen'
import { presentationScreens } from './screens'
import { presentationSteps } from './presentation'

export default function App() {
  const [current, setCurrent] = useState(-1)
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const [voiceMuted, setVoiceMuted] = useState(false)
  const [musicMuted, setMusicMuted] = useState(false)
  const [narrating, setNarrating] = useState(false)
  const [narrationError, setNarrationError] = useState(false)
  const [notice, setNotice] = useState('')
  const [replayVersion, setReplayVersion] = useState(0)
  const voiceRef = useRef<HTMLAudioElement>(null)
  const musicRef = useRef<HTMLAudioElement>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const fallbackRef = useRef<(() => void) | null>(null)
  const initialPlayFailureRef = useRef(false)
  const pausedRef = useRef(false)
  const voiceMutedRef = useRef(false)
  const musicMutedRef = useRef(false)
  const narrationPlayingRef = useRef(false)
  const sceneTokenRef = useRef(0)
  const startFromGestureRef = useRef(false)
  const reducedMotion = useReducedMotion()

  const updateNarrationState = (playing: boolean) => {
    narrationPlayingRef.current = playing
    setNarrating(playing)
    const music = musicRef.current
    if (music && !musicMutedRef.current) {
      music.volume = playing && !voiceMutedRef.current ? 0.13 : 0.25
    }
  }

  const startMusic = () => {
    const music = musicRef.current
    if (!music || musicMutedRef.current) return
    music.muted = false
    music.volume = narrationPlayingRef.current && !voiceMutedRef.current ? 0.13 : 0.25
    void music.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setNotice('Background music could not start. Check the music file and browser audio permissions.')
    })
  }

  const startIntroNarration = () => {
    const voice = voiceRef.current
    if (!voice) return

    const source = '/assets/audio/intro.mp3'
    fallbackRef.current = null
    initialPlayFailureRef.current = false
    window.speechSynthesis?.cancel()
    utteranceRef.current = null
    voice.pause()
    voice.currentTime = 0
    voice.muted = voiceMutedRef.current
    voice.volume = 1
    startFromGestureRef.current = true
    if (!voice.src.endsWith(source)) {
      voice.src = source
      voice.load()
    }

    void voice.play().catch(() => {
      if (!voice.src.endsWith(source) || pausedRef.current) return
      initialPlayFailureRef.current = true
      fallbackRef.current?.()
    })
  }

  const begin = () => {
    setNotice('')
    setNarrationError(false)
    pausedRef.current = false
    setPaused(false)
    setFinished(false)
    setStarted(true)
    setCurrent(-1)
    startIntroNarration()
    const music = musicRef.current
    if (music) {
      music.currentTime = 0
      startMusic()
    }
  }

  const toggleVoice = () => {
    const nextMuted = !voiceMutedRef.current
    voiceMutedRef.current = nextMuted
    setVoiceMuted(nextMuted)
    const voice = voiceRef.current
    if (voice) voice.muted = nextMuted
    if (utteranceRef.current) {
      utteranceRef.current.volume = nextMuted ? 0 : 1
      updateNarrationState(!nextMuted && !window.speechSynthesis.paused)
    } else if (voice && !voice.paused && !voice.ended) {
      updateNarrationState(!nextMuted)
    }
  }

  const toggleMusic = () => {
    const nextMuted = !musicMutedRef.current
    musicMutedRef.current = nextMuted
    setMusicMuted(nextMuted)
    const music = musicRef.current
    if (!music) return
    music.muted = nextMuted
    if (!nextMuted && started && !pausedRef.current) startMusic()
  }

  const togglePause = () => {
    if (!started || finished) return
    if (pausedRef.current) {
      pausedRef.current = false
      setPaused(false)
      startMusic()
      if (utteranceRef.current) {
        window.speechSynthesis?.resume()
        updateNarrationState(!voiceMutedRef.current)
        return
      }
      const voice = voiceRef.current
      if (voice && !narrationError && !voice.ended) {
        voice.muted = voiceMutedRef.current
        void voice.play().catch(() => {
          setNarrationError(true)
          setNotice('Narration could not resume. Replay the invitation or skip this narration.')
        })
      }
      return
    }

    pausedRef.current = true
    setPaused(true)
    voiceRef.current?.pause()
    musicRef.current?.pause()
    if (utteranceRef.current) window.speechSynthesis?.pause()
    updateNarrationState(false)
  }

  const replay = () => {
    pausedRef.current = false
    setPaused(false)
    setFinished(false)
    setNarrationError(false)
    setNotice('')
    setStarted(true)
    setCurrent(-1)
    startIntroNarration()
    setReplayVersion((version) => version + 1)
    const music = musicRef.current
    if (music) {
      music.pause()
      music.currentTime = 0
      startMusic()
    }
  }

  const skipUnavailableNarration = () => {
    if (!narrationError) return
    const voice = voiceRef.current
    voice?.pause()
    window.speechSynthesis?.cancel()
    utteranceRef.current = null
    updateNarrationState(false)
    setNarrationError(false)
    setNotice('')
    if (current < presentationScreens.length - 1) {
      setCurrent(current + 1)
    } else {
      setFinished(true)
      musicRef.current?.pause()
    }
  }

  useEffect(() => {
    if (!started || finished) return
    const step = presentationSteps[current + 1]
    if (!step) return

    const token = ++sceneTokenRef.current
    const voice = voiceRef.current
    if (!voice) return

    let fallbackStarted = false
    let utterance: SpeechSynthesisUtterance | null = null
    setNotice('')
    setNarrationError(false)
    const source = `/assets/audio/${step.id}.mp3`
    const startSpeechFallback = () => {
      if (fallbackStarted || token !== sceneTokenRef.current || pausedRef.current) return
      fallbackStarted = true
      voice.pause()

      if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
        setNarrationError(true)
        setNotice('This browser has no available speech voice. Try a current version of Chrome or Edge.')
        return
      }

      const synthesizer = window.speechSynthesis
      const availableVoices = synthesizer.getVoices()
      const selectedVoice = availableVoices.find((candidate) =>
        /ana|zira|samantha|jenny|aria|ava/i.test(candidate.name) && /^en[-_]/i.test(candidate.lang),
      ) ?? availableVoices.find((candidate) => /^en[-_]/i.test(candidate.lang))
      utterance = new SpeechSynthesisUtterance(step.narration)
      utterance.lang = 'en-US'
      utterance.rate = 0.93
      utterance.pitch = 1.35
      utterance.volume = voiceMutedRef.current ? 0 : 1
      if (selectedVoice) utterance.voice = selectedVoice
      utteranceRef.current = utterance
      utterance.onstart = () => {
        if (token === sceneTokenRef.current) updateNarrationState(!voiceMutedRef.current)
      }
      utterance.onend = onEnded
      utterance.onerror = (event) => {
        if (token !== sceneTokenRef.current || event.error === 'canceled' || event.error === 'interrupted') return
        utteranceRef.current = null
        updateNarrationState(false)
        setNarrationError(true)
        setNotice('The device speech voice could not finish this narration. Check browser audio permissions or skip it.')
      }
      synthesizer.cancel()
      synthesizer.speak(utterance)
    }

    fallbackRef.current = startSpeechFallback
    const onPlay = () => {
      if (token !== sceneTokenRef.current) return
      updateNarrationState(!voiceMutedRef.current)
    }
    const onEnded = () => {
      if (token !== sceneTokenRef.current) return
      if (utteranceRef.current === utterance) utteranceRef.current = null
      updateNarrationState(false)
      if (current < presentationScreens.length - 1) {
        setCurrent(current + 1)
      } else {
        setFinished(true)
        musicRef.current?.pause()
      }
    }
    const onError = () => {
      if (token !== sceneTokenRef.current) return
      startSpeechFallback()
    }

    voice.addEventListener('play', onPlay)
    voice.addEventListener('ended', onEnded)
    voice.addEventListener('error', onError)
    voice.muted = voiceMutedRef.current
    voice.volume = 1

    if (!voice.src.endsWith(source)) {
      voice.pause()
      voice.src = source
      voice.load()
    }

    if (initialPlayFailureRef.current) {
      startSpeechFallback()
    } else if (!pausedRef.current) {
      if (voice.paused) {
        void voice.play().catch(() => {
          if (token !== sceneTokenRef.current || pausedRef.current) return
          startSpeechFallback()
        })
      } else {
        updateNarrationState(!voiceMutedRef.current)
      }
    }
    initialPlayFailureRef.current = false
    startFromGestureRef.current = false

    return () => {
      sceneTokenRef.current += 1
      voice.removeEventListener('play', onPlay)
      voice.removeEventListener('ended', onEnded)
      voice.removeEventListener('error', onError)
      if (fallbackRef.current === startSpeechFallback) fallbackRef.current = null
      if (utterance && utteranceRef.current === utterance) {
        window.speechSynthesis?.cancel()
        utteranceRef.current = null
      }
      if (!startFromGestureRef.current) voice.pause()
    }
  }, [started, current, finished, replayVersion])

  const Screen = current >= 0 ? presentationScreens[current] : null
  const presentationLabel = current < 0 ? 'Welcome' : `${current + 1} / ${presentationScreens.length}`

  return (
    <main className="experience">
      <audio ref={voiceRef} preload="auto" />
      <audio
        ref={musicRef}
        loop
        preload="none"
        onError={() => setNotice('Background music could not be loaded. Check public/assets/music/background-music.mp3.')}
      >
        <source src="/assets/music/background-music.mp3" type="audio/mpeg" />
      </audio>

      <AnimatePresence mode="wait">
        <motion.section
          key={current < 0 ? 'intro' : current}
          className="scene"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, filter: 'blur(5px)' }}
          transition={{ duration: reducedMotion ? 0.15 : 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {Screen ? <Screen /> : <IntroScreen started={started} onStart={begin} />}
        </motion.section>
      </AnimatePresence>

      {started && (
        <div className="presentation-hud">
          <div
            className="presentation-progress"
            role="progressbar"
            aria-label="Invitation progress"
            aria-valuemin={0}
            aria-valuemax={presentationScreens.length}
            aria-valuenow={Math.max(0, current + 1)}
          >
            {presentationScreens.map((_, index) => (
              <span
                key={index}
                className={index < current ? 'progress-segment complete' : index === current ? 'progress-segment current' : 'progress-segment'}
              />
            ))}
          </div>
          <div className="presentation-controls">
            <span className="presentation-count">{presentationLabel}</span>
            <button className="control-button" onClick={toggleVoice} aria-label={voiceMuted ? 'Turn voice on' : 'Turn voice off'}>
              {voiceMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button className="control-button" onClick={toggleMusic} aria-label={musicMuted ? 'Turn music on' : 'Turn music off'}>
              {musicMuted ? <Music size={18} /> : <Music2 size={18} />}
            </button>
            {!finished && (
              <button className="control-button" onClick={togglePause} aria-label={paused ? 'Resume presentation' : 'Pause presentation'}>
                {paused ? <Play size={18} /> : <Pause size={18} />}
              </button>
            )}
            {narrationError && !finished && (
              <button className="control-button" onClick={skipUnavailableNarration} aria-label="Skip unavailable narration">
                <SkipForward size={18} />
              </button>
            )}
            <button className="control-button replay-control" onClick={replay} aria-label="Replay invitation">
              <RotateCcw size={17} />
            </button>
          </div>
          {notice && <p className="playback-notice" role="status">{notice}</p>}
          {narrating && <span className="sr-only" aria-live="polite">Narration playing</span>}
        </div>
      )}
    </main>
  )
}
