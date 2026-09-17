import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  // Order modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("pos-token");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message,
      );
    } finally {
      setProductsLoading(false);
    }
  };

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("pos-token");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error.response?.data || error.message,
      );
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ==========================================
  // OPEN ORDER MODAL
  // ==========================================

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  // ==========================================
  // CLOSE ORDER MODAL
  // ==========================================

  const handleCloseModal = () => {
    if (loading) return;

    setShowModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  // ==========================================
  // QUANTITY CHANGE
  // ==========================================

  const handleQuantityChange = (e) => {
    let value = Number(e.target.value);

    if (value < 1) {
      value = 1;
    }

    if (selectedProduct && value > selectedProduct.stock) {
      value = selectedProduct.stock;
    }

    setQuantity(value);
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async () => {
    if (!selectedProduct) {
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (quantity > selectedProduct.stock) {
      alert("Not enough stock available");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("pos-token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/order/add",
        {
          productId: selectedProduct._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Order response:", response.data);

      if (response.data.success) {
        alert("Order placed successfully!");

        setShowModal(false);
        setSelectedProduct(null);
        setQuantity(1);

        // Refresh products to show updated stock
        await fetchProducts();
      } else {
        alert(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message,
      );
      

      alert(
        error.response?.data?.message ||
          "Something went wrong while placing order",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || product.category?._id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-full bg-gray-100 p-6">
      {/* ========================================
          HEADER
          ======================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>

        <p className="mt-1 text-sm text-gray-500">
          Browse products and place your order
        </p>
      </div>

      {/* ========================================
          FILTER SECTION
          ======================================== */}

      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* CATEGORY */}

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Category
            </label>

            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* SEARCH */}

          <div>
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search Product
            </label>

            <input
              id="search"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>
      </div>

      {/* ========================================
          PRODUCT TABLE
          ======================================== */}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* TABLE HEADER */}

            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Name
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Category
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Price
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Stock
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody className="divide-y divide-gray-100">
              {productsLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      Loading products...
                    </p>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product._id} className="transition hover:bg-gray-50">
                    {/* ID */}

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {index + 1}
                    </td>

                    {/* NAME */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {product.name}
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                        {product.category?.categoryName || "N/A"}
                      </span>
                    </td>

                    {/* PRICE */}

                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      ₹{product.price}
                    </td>

                    {/* STOCK */}

                    <td className="whitespace-nowrap px-6 py-4">
                      {product.stock > 0 ? (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                          {product.stock} available
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* ACTION */}

                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        type="button"
                        disabled={product.stock <= 0}
                        onClick={() => handleOrderClick(product)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
                          product.stock <= 0
                            ? "cursor-not-allowed bg-gray-400"
                            : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                        }`}
                      >
                        {product.stock <= 0 ? "Unavailable" : "Order"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
                        />
                      </svg>

                      <p className="mt-3 text-sm font-medium text-gray-600">
                        No products found
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Try changing your search or category.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================
          ORDER MODAL
          ======================================== */}

      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Place Order
                </h2>

                <p className="text-xs text-gray-500">
                  Confirm your product quantity
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="px-6 py-5">
              {/* PRODUCT */}

              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product
                </label>

                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="font-medium text-gray-800">
                    {selectedProduct.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    ₹{selectedProduct.price} per item
                  </p>
                </div>
              </div>

              {/* QUANTITY */}

              <div className="mb-5">
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Quantity
                </label>

                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Available stock: {selectedProduct.stock}
                </p>
              </div>

              {/* TOTAL */}

              <div className="rounded-xl bg-indigo-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-indigo-600">
                    ₹{(selectedProduct.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                    Placing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProduct;
