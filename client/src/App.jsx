import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Shipments from './pages/Shipments'
import Disruptions from './pages/Disruptions'
import Simulate from './pages/Simulate'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/shipments" element={<><Navbar /><Shipments /></>} />
        <Route path="/disruptions" element={<><Navbar /><Disruptions /></>} />
        <Route path="/simulate" element={<><Navbar /><Simulate /></>} />
      </Routes>
    </BrowserRouter>
  )
}
