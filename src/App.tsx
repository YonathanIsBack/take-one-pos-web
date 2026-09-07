import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './commons/Layout';
import RoutePath from './constants/RoutePath';
import ItemDetailPage from './pages/item/ItemDetailPage';
import ItemEditPage from './pages/item/ItemEditPage';
import ItemFormPage from './pages/item/ItemFormPage';
import ItemPage from './pages/item/ItemPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import StockPurchaseDetailPage from './pages/stock-purchase/StockPurchaseDetailPage';
import StockPurchaseEditPage from './pages/stock-purchase/StockPurchaseEditPage';
import StockPurchaseFormPage from './pages/stock-purchase/StockPurchaseFormPage';
import StockPurchasePage from './pages/stock-purchase/StockPurchasePage';
import SalesPage from './pages/sales/SalesPage';
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
          <Route path="/stock-purchase/:id" element={<StockPurchaseDetailPage />} />
          <Route path="/stock-purchase/:id/edit" element={<StockPurchaseEditPage />} />
          <Route path={RoutePath.SALES} element={<SalesPage />} />
          <Route path={RoutePath.USER} element={<UserPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
