import { motion } from 'framer-motion'
import { OceanEffects } from '../components/OceanEffects'

export default function Screen4() {
  return (
    <div className="screen screen-four">
      <OceanEffects />
      <span className="dove dove-left">‹3</span>
      <span className="dove dove-right">3›</span>
      <motion.div className="blessing-content" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <p className="blessing-kicker">A Sacred Moment</p>
        <h1>A Day of Blessings</h1>
        <motion.div className="cross" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35, duration: 0.8 }}>
          <span />
        </motion.div>
        <p className="blessing-copy">Celebrating the gift of faith and God’s love.</p>
        <div className="blessing-divider">✦</div>
        <p className="blessing-message">May God’s love and blessings guide her every step of the way.</p>
      </motion.div>
    </div>
  )
}
