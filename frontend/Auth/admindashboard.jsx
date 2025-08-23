import React from "react";
import AdminCarouselDashboard from "../Admin/Frontpage/AdminCarouselManager";
import AdminTopSellingProductsDashboard from "../Admin/Frontpage/AdminTopSellingProductsDashboard";
import AdminNewProduct from "../Admin/Frontpage/AdminNewProductsDashboard";
import AdminDiscountProduct from "../Admin/Frontpage/AdminDiscountProductsDashboard";
import AdminAddProduct from "../Admin/AdminAddProductDashboard";

const Admin_dashboard = () => {
  return (
    <div>
      <AdminCarouselDashboard />
      <AdminAddProduct />
      <AdminTopSellingProductsDashboard />
      <AdminNewProduct />
      <AdminDiscountProduct />
    </div>

  );
};

export default Admin_dashboard;