import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet'
import { Icon } from 'leaflet'

const getRiskColor = (score) => {
  if (score >= 80) return '#ff4444'
  if (score >= 50) return '#f59e0b'
  return '#00c896'
}

const getStatusIcon = (status) => {
  const colors = { delayed: '#ff4444', in_transit: '#f59e0b', on_time: '#00c896' }
  const color = colors[status] || '#7ba8c4'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="24" height="24">
    <circle cx="12" cy="12" r="8" fill="${color}" opacity="0.9"/>
    <circle cx="12" cy="12" r="4" fill="#000"/>
  </svg>`
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

export default function LiveMap({ shipments }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=""
      />

      {shipments && shipments.map(s => (
        <div key={s.id}>
          {/* Route line from origin to destination */}
          <Polyline
            positions={[
              [s.origin.lat, s.origin.lng],
              [s.currentLocation.lat, s.currentLocation.lng],
              [s.destination.lat, s.destination.lng]
            ]}
            color={getRiskColor(s.riskScore)}
            weight={2}
            opacity={0.5}
            dashArray={s.status === 'delayed' ? '6,6' : null}
          />

          {/* Origin marker */}
          <CircleMarker
            center={[s.origin.lat, s.origin.lng]}
            radius={5}
            color={getRiskColor(s.riskScore)}
            fillOpacity={0.8}
          >
            <Popup>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '13px' }}>
                <strong>📦 {s.name}</strong><br />
                Origin: {s.origin.city}<br />
                Status: {s.status}
              </div>
            </Popup>
          </CircleMarker>

          {/* Current location marker */}
          <Marker
            position={[s.currentLocation.lat, s.currentLocation.lng]}
            icon={getStatusIcon(s.status)}
          >
            <Popup>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '13px', minWidth: '180px' }}>
                <strong>{s.name}</strong><br />
                <span style={{ color: getRiskColor(s.riskScore) }}>⚠ Risk: {Math.round(s.riskScore)}/100</span><br />
                Status: <b>{s.status.replace('_', ' ').toUpperCase()}</b><br />
                Cargo: {s.cargo}<br />
                ETA: {s.estimatedArrival}
                {s.delay > 0 && <><br /><span style={{ color: '#ff4444' }}>Delayed: +{s.delay}h</span></>}
              </div>
            </Popup>
          </Marker>

          {/* Destination marker */}
          <CircleMarker
            center={[s.destination.lat, s.destination.lng]}
            radius={6}
            color="#0ea5e9"
            fillOpacity={0.7}
          >
            <Popup>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '13px' }}>
                <strong>🏥 Destination</strong><br />
                {s.destination.city}<br />
                ETA: {s.estimatedArrival}
              </div>
            </Popup>
          </CircleMarker>
        </div>
      ))}
    </MapContainer>
  )
}
