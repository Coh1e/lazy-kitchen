import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Cover from './pages/Cover'
import Compose from './pages/Compose'
import Board from './pages/Board'
import Glossary from './pages/Glossary'
import Doc from './pages/Doc'
import Search from './pages/Search'
import Graph from './pages/Graph'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/zh/cover" replace />} />
      <Route path="/:lang" element={<Layout />}>
        <Route index element={<Navigate to="cover" replace />} />
        <Route path="cover" element={<Cover />} />
        <Route path="compose/:slug" element={<Compose />} />
        <Route path="board" element={<Board />} />
        <Route path="board/:view" element={<Board />} />
        <Route path="glossary" element={<Glossary />} />
        <Route path="graph" element={<Graph />} />
        <Route path="search" element={<Search />} />
        <Route path="*" element={<Doc />} />
      </Route>
      <Route path="*" element={<Navigate to="/zh/cover" replace />} />
    </Routes>
  )
}
