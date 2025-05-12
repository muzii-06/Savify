import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import './ProductGrid.css';

const ProductGrid = ({ handleAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="product-grid my-5 shadow mx-auto">
      <h2 className="fs-1 fw-bold text-center mb-4 text-dark">Just For You</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="row justify-content-center">
            {visibleProducts.map((product) => {
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
                  sellerId={sellerId}
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

          {visibleCount < products.length && (
            <div className="text-center mt-4">
              <button className="btn btn-dark px-4 py-2" onClick={handleLoadMore}>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
