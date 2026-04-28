import { useState, useEffect } from 'react'
import LiveMap from '../components/LiveMap'
import { SkeletonKPI, SkeletonCard } from '../components/Skeleton'
import socket from '../socket'

const getRiskColor = (score) => {
  if (score >= 80) return '#ff4444'
  if (score >= 50) return '#f59e0b'
  return '#00c896'
}

export default function Dashboard() {
  const [shipments, setShipments] = useState([])
  const [disruptions, setDisruptions] = useState([])
  const [stats, setStats] = useState({ total: 0, delayed: 0, inTransit: 0, onTime: 0, avgRisk: 0, activeDisruptions: 0 })
  const [liveAlerts, setLiveAlerts] = useState([])
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(r => r.json()).then(d => { if (d.success) setStats(d.data) }),
      fetch('/api/shipments').then(r => r.json()).then(d => { if (d.success) setShipments(d.data) }),
      fetch('/api/disruptions').then(r => r.json()).then(d => { if (d.success) setDisruptions(d.data) })
    ]).then(() => setLoading(false))

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('initial_data', ({ shipments: s, disruptions: d }) => {
      setShipments(s); setDisruptions(d); setLoading(false)
    })
    socket.on('shipment_update', ({ shipment }) => {
      setShipments(prev => prev.map(s => s.id === shipment.id ? shipment : s))
    })
    socket.on('disruption_alert', (alert) => {
      setLiveAlerts(prev => [alert, ...prev].slice(0, 5))
    })
    setConnected(socket.connected)

    return () => {
      socket.off('connect'); socket.off('disconnect')
      socket.off('initial_data'); socket.off('shipment_update')
      socket.off('disruption_alert')
    }
  }, [])

  const statCards = [
    { label: 'Total Shipments', value: stats.total, color: '#0ea5e9', icon: '◈' },
    { label: 'Delayed', value: stats.delayed, color: '#ff4444', icon: '⚠' },
    { label: 'In Transit', value: stats.inTransit, color: '#f59e0b', icon: '→' },
    { label: 'On Time', value: stats.onTime, color: '#00c896', icon: '✓' },
    { label: 'Avg Risk Score', value: `${stats.avgRisk}%`, color: getRiskColor(stats.avgRisk), icon: '◎' },
    { label: 'Active Disruptions', value: stats.activeDisruptions, color: '#ff4444', icon: '◉' },
  ]

  return (
    <div style={{ padding: '24px 32px', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', color: '#f1f5f9' }}>Mission Control</h1>
          <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '4px' }}>
            Live supply chain intelligence dashboard
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--mono)', fontSize: '12px' }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: connected ? '#00c896' : '#ff4444',
            display: 'inline-block',
            animation: connected ? 'pulse 1.5s infinite' : 'none'
          }}></span>
          <span style={{ color: connected ? '#00c896' : '#ff4444' }}>
            {connected ? 'LIVE DATA STREAM' : 'RECONNECTING...'}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '16px', marginBottom: '24px'
      }}>
        {loading ? (
          Array(6).fill(0).map((_, i) => <SkeletonKPI key={i} />)
        ) : (
          statCards.map((s, i) => (
            <div key={i} className="card" style={{ padding: '18px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--mono)', color: s.color }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>{s.label}</div>
                </div>
                <span style={{ fontSize: '20px', color: s.color, opacity: 0.6 }}>{s.icon}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Map */}
        <div className="card" style={{ height: '480px', overflow: 'hidden' }}>
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>⬡ Live Route Map</span>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              {[['#00c896','On Time'],['#f59e0b','In Transit'],['#ff4444','Delayed']].map(([c,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text2)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }}></span>
                  {l}
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 'calc(100% - 48px)' }}>
            <LiveMap shipments={shipments} />
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Live alerts */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>◉ Live Alerts</span>
              <span className="live-dot"></span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
              {liveAlerts.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text3)', textAlign: 'center', padding: '16px' }}>
                  Monitoring... alerts will appear here
                </div>
              ) : liveAlerts.map((a, i) => (
                <div key={i} style={{
                  padding: '10px 12px',
                  background: 'rgba(255,68,68,0.07)',
                  border: '1px solid rgba(255,68,68,0.2)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}>
                  <div style={{ color: '#ff4444', fontWeight: 600, marginBottom: '3px' }}>
                    {a.type.toUpperCase()} · {a.location}
                  </div>
                  <div style={{ color: 'var(--text2)' }}>{a.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* High risk shipments */}
          <div className="card" style={{ padding: '16px', flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>⚠ High Risk Shipments</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {shipments
                .filter(s => s.riskScore >= 60)
                .sort((a, b) => b.riskScore - a.riskScore)
                .slice(0, 4)
                .map(s => (
                <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{s.id}</span>
                    <span style={{ color: getRiskColor(s.riskScore), fontFamily: 'var(--mono)', fontWeight: 600 }}>
                      {Math.round(s.riskScore)}
                    </span>
                  </div>
                  <div className="risk-bar">
                    <div className="risk-fill" style={{
                      width: `${s.riskScore}%`,
                      background: `linear-gradient(90deg, ${getRiskColor(s.riskScore)}, ${getRiskColor(s.riskScore)}88)`
                    }} />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                    {s.origin.city} → {s.destination.city}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
