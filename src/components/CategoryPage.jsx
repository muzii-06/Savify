import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import './CategoryPage.css';

const CategoryPage = ({ handleAddToCart, username, isAuthenticated, handleLogout, cart }) => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setProducts([]);
      setError(null);
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/category/${encodeURIComponent(category)}`
        );

        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [category]);

  return (
    <>
      <Navbar
        username={username}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        cart={cart}
      />
      <div className="category-page container mt-5">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : products.length > 0 ? (
          <>
            <h2 className="category-title">{category}</h2>
            <div className="product-grid row g-4">
              {products.map((product) => {
                const sellerId = product?.seller?._id || 'UNKNOWN_SELLER';
                const rating = product.reviews?.length
                  ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                  : 4.5;

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
                          storeName: product?.seller?.storeName || 'Unknown Store',
                        },
                        sellerId: sellerId,
                        bargainRounds: product?.bargainRounds || 1,
                        maxDiscountPercent: product?.maxDiscountPercent || 10,
                        rating: rating,
                      })
                    }
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3>No products found in "{category}".</h3>
            <p>We are constantly updating our inventory. Please check back later!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
