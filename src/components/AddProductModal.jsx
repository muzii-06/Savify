import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './AddProductModal.css';

const AddProductModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    subcategory: '',
    quantity: '',
  });
  const [images, setImages] = useState([]);
  const [sellerId, setSellerId] = useState('');

  // Fetch sellerId from localStorage when the modal opens
  useEffect(() => {
    const storedSellerId = localStorage.getItem("sellerId");
    console.log("📌 Retrieved Seller ID from localStorage:", storedSellerId); // Debugging
    if (storedSellerId) {
      setSellerId(storedSellerId);
    }
  }, [show]); // Run every time modal is opened

  const categories = {
    Electronics: ['Mobile Phones', 'Laptops', 'Headphones', 'Cameras'],
    Fashion: ['Men', 'Women', 'Kids', 'Accessories'],
    'Home Appliances': ['Kitchen', 'Living Room', 'Bedroom', 'Bathroom'],
    Books: ['Fiction', 'Non-Fiction', 'Textbooks', 'Comics'],
    Toys: ['Action Figures', 'Board Games', 'Puzzles', 'Dolls'],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const sellerId = localStorage.getItem("sellerId"); // ✅ Ensure sellerId is included
    if (!sellerId) {
      alert("Seller ID is missing. Please log in again.");
      return;
    }
  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    Array.from(images).forEach((image) => {
      data.append('images', image);
    });
  
    data.append('sellerId', sellerId); // ✅ Append sellerId
  
    try {
      const response = await axios.post("http://localhost:5000/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert("✅ Product added successfully!");
      handleClose();
    } catch (error) {
      console.error("❌ Error adding product:", error.response?.data || error.message);
      alert("❌ Failed to add product. Try again.");
    }
  };
  
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group mb-3">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              placeholder="Enter product price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              placeholder="Enter product description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="category">Category</label>
            <select
              className="form-control"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {Object.keys(categories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {formData.category && (
            <div className="form-group mb-3">
              <label htmlFor="subcategory">Subcategory</label>
              <select
                className="form-control"
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a subcategory</option>
                {categories[formData.category].map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group mb-3">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              name="quantity"
              placeholder="Enter available quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="images">Product Images</label>
            <input
              type="file"
              className="form-control"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
              required
            />
            <small className="text-muted">You can upload up to 5 images.</small>
          </div>
          <Button type="submit" variant="primary" className="w-100">
            Add Product
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
