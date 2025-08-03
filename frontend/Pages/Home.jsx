import Catagory from "../Catagory/Catagory";
import FeaturedCategories from "../Catagory/FCatagory";

import Carousel from "../Component/carousel";
import Discountedproduct from "../Product/discountproduct";
import Newarrival from "../Product/Newarrival";
import TopSellingProducts from "../Product/TopSellingProduct";

export default function HomePage() {
  return (
    <div>
      <Carousel />
      <Catagory />
      <FeaturedCategories />
      <TopSellingProducts />
      <Newarrival />
      <Discountedproduct />
    </div>
  );
}
