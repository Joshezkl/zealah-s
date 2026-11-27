import { motion } from 'framer-motion'
import { OceanEffects } from '../components/OceanEffects'

export default function Screen2() {
  return (
    <div className="screen screen-two">
      <OceanEffects dense />
      <div className="castle-silhouette" />
      <motion.div className="princess-heading" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <p>And now, introducing...</p>
        <h1>Our Little Princess</h1>
      </motion.div>
      <motion.div className="princess-frame" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1 }}>
        <img src="assets/baby/baby-photo-1.png.png" alt="Zaelah Hesztia" />
        <span className="frame-pearl pearl-a" /><span className="frame-pearl pearl-b" />
      </motion.div>
      <motion.p className="princess-message" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        The sweetest little blessing who fills our world with love and joy.
      </motion.p>
    </div>
  )
}
