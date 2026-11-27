import { motion } from 'framer-motion'
import { Crown, Shell } from 'lucide-react'
import { OceanEffects } from '../components/OceanEffects'

export default function Screen1() {
  return (
    <div className="screen screen-one">
      <OceanEffects dense />
      <div className="undersea-castle" />
      <div className="screen-one-ornaments" aria-hidden="true">
        <Shell className="screen-shell shell-left" strokeWidth={1.35} />
        <Shell className="screen-shell shell-right" strokeWidth={1.35} />
        <span className="pearl-cluster pearl-cluster-left"><i /><i /><i /></span>
        <span className="pearl-cluster pearl-cluster-right"><i /><i /><i /></span>
      </div>
      <motion.div className="opening-content" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 1 }}>
        <p className="eyebrow">A Magical Celebration Awaits...</p>
        <div className="crown"><Crown aria-hidden="true" strokeWidth={1.5} /></div>
        <h1>Zaelah Hesztia</h1>
        <h2>Tembreza Delos Santos</h2>
        <div className="invitation-divider"><span />♢<span /></div>
        <p className="celebration-title">Baptism &amp; 1st Birthday</p>
      </motion.div>
    </div>
  )
}
