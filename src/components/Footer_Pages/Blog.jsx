import React, { useEffect, useState } from 'react';
import './Blog.css';
import savifylogo from './Savify logo.png';

const dummyPosts = [
  {
    id: 1,
    title: 'Savify Launches AI Bargain System',
    date: 'May 10, 2025',
    summary: 'Our latest feature helps customers negotiate better prices using AI. Learn how this will revolutionize your shopping experience!',
  },
  {
    id: 2,
    title: 'Top 5 Tips to Maximize Savings on Savify',
    date: 'April 28, 2025',
    summary: 'Discover smart ways to use Savify features like image search, vouchers, and seasonal offers to save more every time you shop.',
  },
  {
    id: 3,
    title: 'Meet the Sellers: Growing with Savify',
    date: 'April 15, 2025',
    summary: 'Real stories from small business owners who scaled their online presence using Savify’s multi-vendor tools.',
  },
];

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // You can replace this with an API call in the future
    setPosts(dummyPosts);
  }, []);

  return (
    <div className="blog-container">
      <img src={savifylogo} alt="Savify Logo" className="blog-logo" />

      <h1 className="blog-title">Savify Blog</h1>
      <p className="blog-intro">Explore updates, insights, and stories from the Savify community.</p>

      <div className="blog-grid">
        {posts.map((post) => (
          <div key={post.id} className="blog-card">
            <h3>{post.title}</h3>
            <p className="blog-date">{post.date}</p>
            <p className="blog-summary">{post.summary}</p>
            <button className="read-more">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
