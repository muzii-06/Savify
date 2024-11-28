import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'; // Ensure Navbar is imported
import ProductCard from './ProductCard'; // Ensure ProductCard is properly styled
import './SearchResults.css'; // Ensure styles are imported

const SearchResults = ({ handleAddToCart, username, isAuthenticated, handleLogout }) => {
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
        cart={[]} // Ensure cart details are passed if required
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
            {searchResults.map((product) => (
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
        )}
      </div>
    </>
  );
};

export default SearchResults;
