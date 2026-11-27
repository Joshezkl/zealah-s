import { motion } from 'framer-motion'
import { OceanEffects } from '../components/OceanEffects'

export default function Screen6() {
  return (
    <div className="screen screen-six">
      <OceanEffects dense /> 
      <motion.div className="farewell-photo" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
        <img src ="assets/baby/baby-photo-2.png" alt="Zaelah Hesztia" />
      </motion.div>
      <motion.div className="farewell-copy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.9 }}>
        <p>Until We Meet!</p>
        <h1>Thank you for being part of our little princess’s magical journey.</h1>
        <div className="farewell-heart">♡</div>
        <h2>With love, Zaelah</h2>
      </motion.div>
    </div>
  )
}
