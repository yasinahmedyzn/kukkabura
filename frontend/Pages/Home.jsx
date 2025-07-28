import Catagory from "../Catagory/Catagory";
import FeaturedCategories from "../Catagory/FCatagory";

import Carousel from "../Component/carousel";
import TopSellingProducts from "../Product/TopSellingProduct";

export default function HomePage() {
  return (
    <div>
      <Carousel />
      <Catagory />
      <FeaturedCategories />
      <TopSellingProducts />
    </div>
  );
}
