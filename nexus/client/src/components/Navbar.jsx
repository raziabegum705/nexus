import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import socket from '../socket'

export default function Navbar() {
  const location = useLocation()
  const [connected, setConnected] = useState(false)
  const [alerts, setAlerts] = useState(0)

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('disruption_alert', () => setAlerts(a => a + 1))
    setConnected(socket.connected)
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('disruption_alert')
    }
  }, [])

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '⬡' },
    { path: '/shipments', label: 'Shipments', icon: '◈' },
    { path: '/disruptions', label: 'Disruptions', icon: '◉' },
    { path: '/simulate', label: 'Cascade Sim', icon: '⬢' },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: 'rgba(255,255,255,0.95)',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      backdropFilter: 'blur(20px)',
      padding: '0 32px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: '60px'
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, #00c896, #0ea5e9)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', fontWeight: 700, color: '#000'
        }}>N</div>
        <span style={{ fontWeight: 700, fontSize: '18px', color: '#0f172a', letterSpacing: '2px' }}>NEXUS</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {navItems.map(item => (
          <Link key={item.path} to={item.path} style={{
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            color: location.pathname === item.path ? '#059669' : '#475569',
            background: location.pathname === item.path ? 'rgba(5,150,105,0.08)' : 'transparent',
            border: location.pathname === item.path ? '1px solid rgba(5,150,105,0.2)' : '1px solid transparent',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <span>{item.icon}</span>
            {item.label}
            {item.path === '/disruptions' && alerts > 0 && (
              <span style={{
                background: '#ff4444', color: '#fff',
                borderRadius: '10px', padding: '1px 6px',
                fontSize: '10px', fontWeight: 700
              }}>{alerts}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        <span className={connected ? 'live-dot' : ''} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: connected ? '#00c896' : '#ff4444',
          display: 'inline-block'
        }}></span>
        <span style={{ color: connected ? '#00c896' : '#ff4444', fontFamily: 'var(--mono)' }}>
          {connected ? 'LIVE' : 'OFFLINE'}
        </span>
      </div>
    </nav>
  )
}
