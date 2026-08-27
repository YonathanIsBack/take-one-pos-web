import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './commons/Layout';
import RoutePath from './constants/RoutePath';
import ItemDetailPage from './pages/item/ItemDetailPage';
import ItemEditPage from './pages/item/ItemEditPage';
import ItemFormPage from './pages/item/ItemFormPage';
import ItemPage from './pages/item/ItemPage';
import UserPage from './pages/UserPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={RoutePath.ITEM} element={<ItemPage />} />
          <Route path={RoutePath.ITEM_NEW} element={<ItemFormPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/item/:id/edit" element={<ItemEditPage />} />
          <Route path={RoutePath.USER} element={<UserPage />} />
          <Route path="*" element={<Navigate to={RoutePath.ITEM} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
