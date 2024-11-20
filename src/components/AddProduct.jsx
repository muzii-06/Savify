// AddProductModal.js
import React, { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./AddProduct.css";

const AddProduct = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    keywords: "",
    seller_name: "Your Seller Name", // Replace this with dynamic seller name if needed
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
      data.append("images", image);
    });

    try {
      await axios.post("http://localhost:5000/api/products", data);
      alert("Product added successfully!");
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Try again.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <label>Keywords (comma-separated):</label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleInputChange}
          />
          <label>Images:</label>
          <input type="file" multiple onChange={handleImageChange} />
          <Button type="submit" variant="primary" className="mt-3">
            Add Product
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProduct;
