import React from "react";
import { Routes as ReactRoutes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import AddProduct from "./pages/AddProduct/AddProduct";
/*import ManageSales from "./pages/ManageSales/ManageSales";
import SalesHistory from "./pages/SalesHistory/SalesHistory";
import LowStock from "./pages/LowStock/LowStock";
import ShowProducts from "./pages/ShowProducts/ShowProducts";
import Profit from "./pages/Profit/Profit";*/
import Layout from "./components/Layout/Layout"; // Componente Layout

const AppRoutes: React.FC = () => {
  return (
    <ReactRoutes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Route>
    </ReactRoutes>
  );
};

export default AppRoutes;

/*<Route path="/show-product" element={<ShowProducts />} />
        <Route path="/manage-sales" element={<ManageSales />} />
        <Route path="/sales-history" element={<SalesHistory />} />
        <Route path="/low-stock" element={<LowStock />} />
        <Route path="/profit-overview" element={<Profit />} /> */
