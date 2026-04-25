import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Cover from './pages/Cover'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/zh/cover" replace />} />
      <Route path="/:lang" element={<Layout />}>
        <Route index element={<Navigate to="cover" replace />} />
        <Route path="cover" element={<Cover />} />
      </Route>
      <Route path="*" element={<Navigate to="/zh/cover" replace />} />
    </Routes>
  )
}
