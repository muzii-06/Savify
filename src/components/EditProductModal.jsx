import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import "./EditProductModal.css";

const EditProductModal = ({ show, handleClose, productId }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    quantity: "",
  });
  const [images, setImages] = useState([]);
  const [sellerId, setSellerId] = useState("");

  // Fetch sellerId from localStorage
  useEffect(() => {
    const storedSellerId = localStorage.getItem("sellerId");
    if (storedSellerId) {
      setSellerId(storedSellerId);
    }
  }, []);

  // Fetch existing product details when modal opens
  useEffect(() => {
    if (show && productId) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
          setFormData({
            name: response.data.name,
            price: response.data.price,
            description: response.data.description,
            category: response.data.category,
            subcategory: response.data.subcategory,
            quantity: response.data.quantity,
          });
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };
      fetchProduct();
    }
  }, [show, productId]);

  const categories = {
    Electronics: ["Mobile Phones", "Laptops", "Headphones", "Cameras"],
    Fashion: ["Men", "Women", "Kids", "Accessories"],
    "Home Appliances": ["Kitchen", "Living Room", "Bedroom", "Bathroom"],
    Books: ["Fiction", "Non-Fiction", "Textbooks", "Comics"],
    Toys: ["Action Figures", "Board Games", "Puzzles", "Dolls"],
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
  
    if (!sellerId) {
      alert("❌ Seller ID is missing. Please log in again.");
      return;
    }
  
    try {
      // ✅ Create an object with only the fields that need updating
      const updatedData = {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        quantity: formData.quantity,
      };
  
      // ✅ Send updated product data (excluding images)
      await axios.put(`http://localhost:5000/api/products/${productId}`, updatedData);
  
      // ✅ If new images are uploaded, send them separately
      if (images.length > 0) {
        const imageData = new FormData();
        Array.from(images).forEach((image) => {
          imageData.append("images", image);
        });
  
        await axios.put(`http://localhost:5000/api/products/${productId}/images`, imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      alert("✅ Product updated successfully!");
      handleClose();
      window.location.reload(); // ✅ Refresh page to show updated data
    } catch (error) {
      console.error("❌ Error updating product:", error.response?.data || error.message);
      alert("❌ Failed to update product. Try again.");
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="edit-product-form">
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
            <label htmlFor="images">Update Product Images</label>
            <input
              type="file"
              className="form-control"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
            />
            <small className="text-muted">Upload new images to replace the existing ones.</small>
          </div>
          <Button type="submit" variant="primary" className="w-100">
            Update Product
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;
