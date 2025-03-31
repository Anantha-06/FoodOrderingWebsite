import React from 'react';
import ProductCard from "../../Components/User/CardHover.jsx"
import { useParams } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch.jsx";

const App = () => {
  let { id } = useParams();
  const [datarest, isLoading, error] = useFetch(`/restaurant/id/${"67da8656b1e6fb6f2bf7e97d"}`);
  const restaurant = datarest?.findRestaurant || [];

  return (
    <>
    
    <div className="d-flex justify-content-center flex-wrap align-items-center vh-100">
      {restaurant.menu?.length > 0 ? (
            restaurant.menu.map((item, index) => (
                <ProductCard
                  image={item.image}
                  desc={item.description}
                  price={item.price}
                  ProductCard={item.name}
                  foodId={item._id}
                  restaurantId={restaurant._id}
                />
            ))
          ) : (
            <p className="text-center">No menu items available</p>
          )}
    </div>
    </>
  );
};

export default App;