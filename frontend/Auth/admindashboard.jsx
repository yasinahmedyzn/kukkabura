import React from "react";
import AdminCarouselDashboard from "../Admin/Frontpage/AdminCarouselManager";
import AdminTopSellingProductsDashboard from "../Admin/Frontpage/AdminTopSellingProductsDashboard";
import AdminNewProduct from "../Admin/Frontpage/AdminNewProductsDashboard";
import AdminDiscountProduct from "../Admin/Frontpage/AdminDiscountProductsDashboard";

const Admin_dashboard = () => {
  return (
    <div>
      <AdminCarouselDashboard />
      <AdminTopSellingProductsDashboard />
      <AdminNewProduct />
      <AdminDiscountProduct />
    </div>

  );
};

export default Admin_dashboard;