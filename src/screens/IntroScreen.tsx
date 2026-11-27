import { motion } from 'framer-motion'
import { ChevronRight, Sparkles } from 'lucide-react'
import { OceanEffects } from '../components/OceanEffects'

interface IntroScreenProps {
  started: boolean
  onStart: () => void
}

export default function IntroScreen({ started, onStart }: IntroScreenProps) {
  return (
    <div className="screen intro-screen">
      <OceanEffects dense />
      <motion.div
        className="intro-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Sparkles className="intro-sparkles" strokeWidth={1.3} aria-hidden="true" />
        <p className="intro-eyebrow">A little magic awaits</p>
        <h1>Hello, everyone!</h1>
        <p className="intro-message">Welcome to my little magical world! I'm so happy you're here. I have a very special invitation for you, so come and celebrate with me!</p>
        {!started && (
          <button className="start-invitation" onClick={onStart}>
            <span>Start the Invitation</span>
            <ChevronRight size={18} />
          </button>
        )}
      </motion.div>
    </div>
  )
}
