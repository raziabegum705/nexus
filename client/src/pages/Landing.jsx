import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const STATS = [
  { label: 'Active Shipments', value: 9, suffix: '' },
  { label: 'Disruptions Detected', value: 4, suffix: '' },
  { label: 'Avg Response Time', value: 6, suffix: 'min' },
  { label: 'Routes Optimized', value: 247, suffix: '+' },
]

function CountUp({ target, suffix }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const step = target / 60
    const timer = setInterval(() => {
      setCount(c => {
        if (c >= target) { clearInterval(timer); return target }
        return Math.min(c + step, target)
      })
    }, 20)
    return () => clearInterval(timer)
  }, [target])
  return <>{Math.round(count)}{suffix}</>
}

export default function Landing() {
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(to bottom right, #0F1419, #1a2f42, #0d3b52)',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden'
    }}>
      <style>{`
        @keyframes morph { 0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
        .blob-shape { animation: morph 10s ease-in-out infinite; mix-blend-mode: screen; filter: blur(60px); }
      `}</style>
      
      {/* Animated Gradient Orbs */}
      <div style={{
        position: 'absolute', top: '5%', right: '10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(15, 157, 138, 0.2), rgba(0, 212, 255, 0.1))',
        pointerEvents: 'none',
        animation: 'float-slow 8s ease-in-out infinite',
        filter: 'blur(60px)',
        mixBlendMode: 'screen'
      }} className="blob-shape" />
      <div style={{
        position: 'absolute', top: '40%', left: '5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(37, 99, 235, 0.1))',
        pointerEvents: 'none',
        animation: 'float-slow 10s ease-in-out infinite',
        filter: 'blur(60px)',
        mixBlendMode: 'screen',
        animationDelay: '-2s'
      }} className="blob-shape" />
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%',
        width: 450, height: 450, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.08), rgba(255, 69, 0, 0.05))',
        pointerEvents: 'none',
        animation: 'float-slow 12s ease-in-out infinite',
        filter: 'blur(60px)',
        mixBlendMode: 'screen',
        animationDelay: '-4s'
      }} className="blob-shape" />

      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        position: 'relative', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #0F9D8A, #00D4FF)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '18px', color: '#fff',
            boxShadow: '0 0 20px rgba(15, 157, 138, 0.5)'
          }}>N</div>
          <span style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '3px', color: '#f1f5f9' }}>NEXUS</span>
        </div>
        <div style={{ fontFamily: 'var(--mono)', color: '#cbd5e1', fontSize: '13px' }}>
          {time.toUTCString().replace('GMT', 'UTC')}
        </div>
      </div>

      {/* Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px', textAlign: 'center',
        gap: '28px', position: 'relative', zIndex: 5
      }}>
        <div className="badge" style={{
          fontSize: '12px', padding: '8px 20px',
          background: 'rgba(15, 157, 138, 0.15)',
          border: '1px solid rgba(15, 157, 138, 0.3)',
          color: '#0F9D8A',
          backdropFilter: 'blur(10px)',
          animation: 'slide-in 0.6s ease-out'
        }}>
          <span className="live-dot" style={{ marginRight: '6px', background: '#0F9D8A' }}></span>
          DISASTER LOGISTICS INTELLIGENCE PLATFORM
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 700, lineHeight: 1.1,
          letterSpacing: '-2px', maxWidth: '900px',
          color: '#f1f5f9',
          animation: 'slide-in 0.6s ease-out 0.1s backwards'
        }}>
          Predict. Route. Deliver.
          <br />
          <span style={{
            background: 'linear-gradient(90deg, #0F9D8A, #00D4FF)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(15, 157, 138, 0.3)',
            animation: 'text-glow 3s ease-in-out infinite'
          }}>Before It's Too Late.</span>
        </h1>

        <p style={{
          fontSize: '18px', color: '#cbd5e1',
          maxWidth: '580px', lineHeight: 1.7,
          animation: 'slide-in 0.6s ease-out 0.2s backwards'
        }}>
          AI-powered supply chain platform that detects disruptions 48 hours before they happen
          and auto-routes critical supplies to disaster zones.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', animation: 'slide-in 0.6s ease-out 0.3s backwards' }}>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}
            style={{
              padding: '14px 32px', fontSize: '16px',
              background: 'linear-gradient(135deg, #0F9D8A, #00D4FF)',
              border: 'none',
              boxShadow: '0 0 30px rgba(15, 157, 138, 0.5)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 0 50px rgba(15, 157, 138, 0.8)'}
            onMouseLeave={(e) => e.target.style.boxShadow = '0 0 30px rgba(15, 157, 138, 0.5)'}
          >
            ⬡ Open Mission Control
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/simulate')}
            style={{
              padding: '14px 32px', fontSize: '16px',
              border: '2px solid rgba(15, 157, 138, 0.5)',
              color: '#00D4FF',
              background: 'rgba(15, 157, 138, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(15, 157, 138, 0.15)'; e.target.style.borderColor = '#00D4FF'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(15, 157, 138, 0.05)'; e.target.style.borderColor = 'rgba(15, 157, 138, 0.5)'; }}
          >
            ⬢ Try Cascade Simulator
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px', marginTop: '20px', width: '100%', maxWidth: '800px',
          animation: 'slide-in 0.6s ease-out 0.4s backwards'
        }}>
          {STATS.map((s, i) => (
            <div key={i} className="card glass-effect-strong" style={{
              padding: '20px', textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(15, 157, 138, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}>
              <div style={{
                fontSize: '36px', fontWeight: 700,
                fontFamily: 'var(--mono)',
                color: '#00D4FF',
                textShadow: '0 0 15px rgba(0, 212, 255, 0.5)'
              }}>
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '6px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px', animation: 'slide-in 0.6s ease-out 0.5s backwards' }}>
          {['⚡ 48hr Disruption Forecast', '🛣️ AI Auto-Rerouting', '📡 Live Socket Tracking',
            '🌊 Cascade Simulator', '🤖 Gemini-Powered'].map((f, idx) => (
            <div key={f} style={{
              padding: '8px 16px', borderRadius: '20px',
              border: '1px solid rgba(15, 157, 138, 0.3)',
              fontSize: '13px', color: '#cbd5e1',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              animation: `slide-in 0.4s ease-out ${0.1 * idx}s backwards`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(15, 157, 138, 0.15)';
              e.currentTarget.style.borderColor = '#00D4FF';
              e.currentTarget.style.color = '#00D4FF';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(15, 157, 138, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(15, 157, 138, 0.3)';
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.boxShadow = 'none';
            }}>{f}</div>
          ))}
        </div>

        <p style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--mono)', animation: 'slide-in 0.6s ease-out 0.6s backwards' }}>
          SDG 9 · SDG 11 · SDG 13 — Built for Google Solution Challenge
        </p>
      </div>
    </div>
  )
}
