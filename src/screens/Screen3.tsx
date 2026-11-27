import { motion } from 'framer-motion'
import { CalendarDays, Clock3, MapPin, Sparkles } from 'lucide-react'
import { OceanEffects } from '../components/OceanEffects'

const details = [
  { icon: <CalendarDays />, label: 'Date', value: 'December 02, 2026' },
  { icon: <Clock3 />, label: 'Time', value: '3:00 PM' },
  { icon: <MapPin />, label: 'Venue', value: "Cai's Garden & Events Bypass Road, Urdaneta City Pangasinan" },
]

export default function Screen3() {
  return (
    <div className="screen screen-three">
      <OceanEffects />
      <div className="glowing-shell" aria-hidden="true"><div><Sparkles /></div></div>
      <motion.div className="celebration-heading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p>Let’s</p><h1>Celebrate!</h1>
      </motion.div>
      <div className="detail-list">
        {details.map((detail, index) => (
          <motion.article className="detail-card" key={detail.label} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.18 }}>
            <div className="detail-icon">{detail.icon}</div>
            <div><span>{detail.label}</span><strong>{detail.value}</strong></div>
          </motion.article>
        ))}
      </div>
      <p className="celebration-note">Let’s celebrate a magical milestone!</p>
    </div>
  )
}
