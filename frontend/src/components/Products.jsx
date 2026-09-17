import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editProduct, setEditProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    supplier: "",
  });

  // =========================
  // Fetch Products
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:3000/api/product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch Categories
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // =========================
  // Fetch Suppliers
  // =========================

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/supplier", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        setSuppliers(response.data.suppliers);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // =========================
  // useEffect
  // =========================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  // =========================
  // Handle Input
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================
  // Add / Update Product
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editProduct) {
        response = await axios.put(
          `http://localhost:3000/api/product/${editProduct._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          },
        );
      } else {
        response = await axios.post(
          "http://localhost:3000/api/product/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          },
        );
      }

      if (response.data.success) {
        alert(
          editProduct
            ? "Product updated successfully"
            : "Product added successfully",
        );

        setShowModal(false);
        setEditProduct(null);

        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "",
          supplier: "",
        });

        fetchProducts();
      }
    } catch (error) {
      console.error("Error saving product:", error);

      alert(
        error.response?.data?.message ||
          "Error saving product. Please try again.",
      );
    }
  };

  // =========================
  // Edit Product
  // =========================

  const handleEdit = (product) => {
    setEditProduct(product);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category?._id || "",
      supplier: product.supplier?._id || "",
    });

    setShowModal(true);
  };

  // =========================
  // Delete Product
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        },
      );

      if (response.data.success) {
        alert("Product deleted successfully");

        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);

      alert(
        error.response?.data?.message ||
          "Error deleting product. Please try again.",
      );
    }
  };

  // =========================
  // Search
  // =========================

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  // =========================
  // Open Add Modal
  // =========================

  const handleAddProduct = () => {
    setEditProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      supplier: "",
    });

    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search products by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-3 mb-5"
      />

      {/* Product Table */}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Name</th>

                <th className="p-3 text-left">Category</th>

                <th className="p-3 text-left">Supplier</th>

                <th className="p-3 text-left">Price</th>

                <th className="p-3 text-left">Stock</th>

                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-3">{product.name}</td>

                  <td className="p-3">{product.category?.categoryName}</td>

                  <td className="p-3">{product.supplier?.name}</td>

                  <td className="p-3">${Number(product.price).toFixed(2)}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        product.stock === 0
                          ? "bg-red-100 text-red-600"
                          : product.stock <= 5
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mr-4"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================
          Add/Edit Product Modal
         ========================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Name */}

              <label className="block mb-1 font-medium">Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mb-4"
              />

              {/* Description */}

              <label className="block mb-1 font-medium">Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border rounded px-3 py-2 mb-4"
              />

              {/* Price */}

              <label className="block mb-1 font-medium">Price</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded px-3 py-2 mb-4"
              />

              {/* Stock */}

              <label className="block mb-1 font-medium">Stock</label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded px-3 py-2 mb-4"
              />

              {/* Category */}

              <label className="block mb-1 font-medium">Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mb-4"
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>

              {/* Supplier */}

              <label className="block mb-1 font-medium">Supplier</label>

              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mb-5"
              >
                <option value="">Select Supplier</option>

                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>

              {/* Buttons */}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditProduct(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
