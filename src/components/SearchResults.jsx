import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import './SearchResults.css';

const SearchResults = ({ handleAddToCart, username, isAuthenticated, handleLogout, cart }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/search?query=${encodeURIComponent(query)}`
        );

        if (response.data.length === 0) {
          setError(`No products found matching "${query}".`);
        } else {
          setSearchResults(response.data);
        }
      } catch (err) {
        console.error('Error fetching search results:', err.response || err.message);
        setError(err.response?.data?.message || 'Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <>
      <Navbar
        username={username}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        cart={cart}
      />

      <div className="search-results container mt-5">
        <h2 className="mb-4 text-center">
          {loading ? 'Searching...' : `Search Results for "${query}"`}
        </h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <p className="text-danger text-center fs-4">{error}</p>
        ) : (
          <div className="row g-4">
            {searchResults.map((product) => {
              // Normalize seller ID and name
              const sellerId = (product?.seller?._id || product?.sellerId || '').toString().trim();
              const sellerName = product?.seller?.storeName || product?.storeName || 'Unknown Store';

              const rating = product.reviews?.length
                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                : 4.5;

              const formattedProduct = {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: `http://localhost:5000/${product.images[0].replace(/\\/g, '/')}`,
                quantity: 1,
                seller: {
                  _id: sellerId,
                  storeName: sellerName,
                },
                sellerId: sellerId || 'UNKNOWN_SELLER',
                bargainRounds: product?.bargainRounds || 1,
                maxDiscountPercent: product?.maxDiscountPercent || 10,
                rating: rating,
              };

              return (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={formattedProduct.image}
                  handleAddToCart={() => handleAddToCart(formattedProduct)}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;
