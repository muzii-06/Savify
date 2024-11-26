import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './AddProductModal.css'; // Import custom CSS for styling

const AddProductModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    sellerName: 'Your Seller Name', // Replace with dynamic seller name if needed
  });
  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    Array.from(images).forEach((image) => {
      data.append('images', image);
    });
  
    try {
      const response =await axios.post('http://localhost:5000/api/products', data ,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product added successfully!');
      handleClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Try again.');
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
