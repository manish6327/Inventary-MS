import React, { useEffect, useState } from "react";
import axios from "axios";

const Summary = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    ordersToday: 0,
    revenue: 0,
    outOfStock: [],
    highestSaleProduct: null,
    lowStock: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("pos-token");

      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/dashboard/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setDashboardData(response.data.dashboardData);
      }
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        error.response?.data?.message || "Error fetching dashboard data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h2>

        <div className="rounded-lg bg-white p-10 text-center shadow-md">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>

          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Heading */}
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h2>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* ================= TOP CARDS ================= */}
      <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <div className="rounded-lg bg-blue-500 p-6 text-center text-white shadow-md">
          <p className="text-lg font-semibold">Total Products</p>

          <p className="mt-2 text-3xl font-bold">
            {dashboardData.totalProducts}
          </p>
        </div>

        {/* Total Stock */}
        <div className="rounded-lg bg-green-500 p-6 text-center text-white shadow-md">
          <p className="text-lg font-semibold">Total Stock</p>

          <p className="mt-2 text-3xl font-bold">{dashboardData.totalStock}</p>
        </div>

        {/* Orders Today */}
        <div className="rounded-lg bg-yellow-500 p-6 text-center text-white shadow-md">
          <p className="text-lg font-semibold">Orders Today</p>

          <p className="mt-2 text-3xl font-bold">{dashboardData.ordersToday}</p>
        </div>

        {/* Revenue */}
        <div className="rounded-lg bg-purple-500 p-6 text-center text-white shadow-md">
          <p className="text-lg font-semibold">Revenue</p>

          <p className="mt-2 text-3xl font-bold">₹{dashboardData.revenue}</p>
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Out of Stock */}
        <div className="rounded-lg bg-white p-5 shadow-md">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Out of Stock Products
          </h3>

          {dashboardData.outOfStock.length > 0 ? (
            <ul className="space-y-3">
              {dashboardData.outOfStock.map((product) => (
                <li
                  key={product._id}
                  className="flex items-center justify-between border-b border-gray-100 pb-2"
                >
                  <span className="font-medium text-gray-700">
                    {product.name}
                  </span>

                  <span className="font-semibold text-red-500">
                    {product.stock} left
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No products out of stock.</p>
          )}
        </div>

        {/* Highest Sale Product */}
        <div className="rounded-lg bg-white p-5 shadow-md">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Highest Sale Product
          </h3>

          {dashboardData.highestSaleProduct?.name ? (
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Name:</strong> {dashboardData.highestSaleProduct.name}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {dashboardData.highestSaleProduct.category}
              </p>

              <p>
                <strong>Total Units Sold:</strong>{" "}
                {dashboardData.highestSaleProduct.totalQuantity}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              {dashboardData.highestSaleProduct?.message ||
                "No sale data available"}
            </p>
          )}
        </div>

        {/* Low Stock */}
        <div className="rounded-lg bg-white p-5 shadow-md">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Low Stock Products
          </h3>

          {dashboardData.lowStock.length > 0 ? (
            <ul className="space-y-3">
              {dashboardData.lowStock.map((product) => (
                <li key={product._id} className="border-b border-gray-100 pb-2">
                  <span className="font-semibold text-gray-800">
                    {product.name}
                  </span>

                  <span className="text-gray-500"> - {product.stock} left</span>

                  <span className="ml-1 text-gray-400">
                    ({product.category?.categoryName || "No Category"})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No low stock products.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
