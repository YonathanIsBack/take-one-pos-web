import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './commons/Layout';
import RoutePath from './constants/RoutePath';
import ItemDetailPage from './pages/item/ItemDetailPage';
import ItemEditPage from './pages/item/ItemEditPage';
import ItemFormPage from './pages/item/ItemFormPage';
import ItemPage from './pages/item/ItemPage';
import LoginPage from './pages/LoginPage';
import StockPurchaseFormPage from './pages/stock-purchase/StockPurchaseFormPage';
import StockPurchasePage from './pages/stock-purchase/StockPurchasePage';
import UserPage from './pages/UserPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutePath.LOGIN} element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path={RoutePath.ITEM} element={<ItemPage />} />
          <Route path={RoutePath.ITEM_NEW} element={<ItemFormPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/item/:id/edit" element={<ItemEditPage />} />
          <Route path={RoutePath.STOCK_PURCHASE} element={<StockPurchasePage />} />
          <Route path={RoutePath.STOCK_PURCHASE_NEW} element={<StockPurchaseFormPage />} />
          <Route path="/stock-purchase/:id" element={<StockPurchasePage />} />
          <Route path="/stock-purchase/:id/edit" element={<StockPurchasePage />} />
          <Route path={RoutePath.USER} element={<UserPage />} />
          <Route path="*" element={<Navigate to={RoutePath.LOGIN} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
