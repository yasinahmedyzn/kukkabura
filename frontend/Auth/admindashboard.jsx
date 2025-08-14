import React from "react";
import AdminCarouselDashboard from "../Admin/Frontpage/AdminCarouselManager";
import AdminTopSellingProductsDashboard from "../Admin/Frontpage/AdminTopSellingProductsDashboard";
import AdminNewProduct from "../Admin/Frontpage/AdminNewProductsDashboard";

const Admin_dashboard = () => {
  return (
    <div>
      <AdminCarouselDashboard />
      <AdminTopSellingProductsDashboard />
      <AdminNewProduct />
    </div>

  );
};

export default Admin_dashboard;