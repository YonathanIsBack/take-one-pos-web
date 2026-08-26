import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './commons/Layout'
import ItemPage from './pages/ItemPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ItemEditPage from './pages/ItemEditPage'
import UserPage from './pages/UserPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/item" element={<ItemPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/item/:id/edit" element={<ItemEditPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="*" element={<Navigate to="/item" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
