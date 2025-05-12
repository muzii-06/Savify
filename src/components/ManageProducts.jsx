import React, { useState, useEffect } from "react";
import axios from "axios";
import EditProductModal from "./EditProductModal"; // ✅ Import Edit Modal
import '../styling/ManageProducts.css';
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const sellerId = localStorage.getItem("sellerId"); // Get seller ID from localStorage

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/seller/${sellerId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [sellerId]);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  const handleEdit = (productId) => {
    setSelectedProductId(productId);
    setShowEditModal(true);
  };

  return (
    <div className="manage-products-container mt-4">
      <h2 className="">Manage Your Products</h2>
      {products.length === 0 ? (
        <p>No products found. Add some products!</p>
      ) : (
        <table className="table mtable table-striped">
          <thead >
            <tr className="fw-bold">
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody cl>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img src={`http://localhost:5000/${product.images[0]}`} alt={product.name} width="50" />
                </td>
                <td className="text-center">{product.name}</td>
                <td className="text-center">Rs. {product.price}</td>
                <td className="d-flex justify-content-center">
                  <button className="btn btn-warning me-2 " onClick={() => handleEdit(product._id)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Edit Product Modal */}
      <EditProductModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        productId={selectedProductId}
      />
    </div>
  );
};

export default ManageProducts;
