import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import './ProductGrid.css'; // Import updated styles

const ProductGrid = ({ handleAddToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-grid p-3 my-5 shadow mx-auto">
      <h2 className="fs-2">Just For You</h2>
      <div className="row g-4">
        {products.map((product) => {
          const rating = product.reviews?.length
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
            : 4.5;

          const sellerId = product?.seller?._id || "UNKNOWN_SELLER";

          return (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={`http://localhost:5000/${product.images[0].replace(/\\/g, "/")}`}
              sellerId={sellerId} // ✅ pass sellerId
              handleAddToCart={() =>
                handleAddToCart({
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  image: `http://localhost:5000/${product.images[0].replace(/\\/g, "/")}`,
                  quantity: 1,
                  seller: {
                    _id: sellerId,
                    storeName: product?.seller?.storeName || "Unknown Store",
                  },
                  sellerId: sellerId,
                  rating: rating,
                  bargainRounds: product?.bargainRounds || 1,
                  maxDiscountPercent: product?.maxDiscountPercent || 10,
                })
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
