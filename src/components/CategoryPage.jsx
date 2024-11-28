import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import './CategoryPage.css';

const CategoryPage = ({ handleAddToCart, username, isAuthenticated, handleLogout }) => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setProducts([]); // Reset products for UI refresh
      setError(null); // Reset error state
      setLoading(true); // Show loading spinner

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
        cart={[]} // Pass cart if required
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
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={`http://localhost:5000/${product.images[0]}`}
                  handleAddToCart={handleAddToCart}
                />
              ))}
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

