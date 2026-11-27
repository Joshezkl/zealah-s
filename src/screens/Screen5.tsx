import { motion } from 'framer-motion'
import { OceanEffects } from '../components/OceanEffects'

const colors = [
  ['Baby pink', '#F4B2C4'],
  ['Peach', '#F7C59F'],
  ['Cream', '#FFF2C7'],
  ['Aqua blue', '#87D9E8'],
  ['Mint green', '#ABDCC6'],
]

export default function Screen5() {
  return (
    <div className="screen screen-five">
      <OceanEffects />
      <motion.div className="invitation-card" initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.85 }}>
        <div className="card-crown">♢</div>
        <p className="card-kicker">You’re</p>
        <h1>Invited!</h1>
        <div className="parent-label">With joyful hearts</div>
        <p className="parent-names">Mr. Maynard Joseph Delos Santos<br /><span>&amp;</span><br />Mrs. Kwen Cyra Tembreza - Delos Santos</p>
        <p className="presence-message">Your presence will make this special day even more magical.</p>
        <div className="attire-rule" />
        <p className="attire-copy">We kindly request our guests to wear semi-formal or casual attire in the colors shown below.</p>
        <div className="color-palette" aria-label="Suggested attire colors">
          {colors.map(([name, color]) => (
            <div className="color-item" key={name}>
              <span style={{ background: color }} />
              <small>{name}</small>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
