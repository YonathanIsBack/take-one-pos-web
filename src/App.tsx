import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './commons/Layout'
import ItemEditPage from './pages/item/ItemEditPage'
import ItemFormPage from './pages/item/ItemFormPage'
import ItemPage from './pages/item/ItemPage'
import UserPage from './pages/UserPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/item" element={<ItemPage />} />
          <Route path="/item/new" element={<ItemFormPage />} />
          <Route path="/item/:id/edit" element={<ItemEditPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="*" element={<Navigate to="/item" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
