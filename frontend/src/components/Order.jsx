import React, { useEffect, useState } from "react";
import axios from "axios";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("pos-token");

      if (!token) {
        setError("Please login to view your orders.");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/order/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);

      setError(
        error.response?.data?.message ||
          "Unable to fetch orders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Orders</h1>

        <div className="flex items-center justify-center rounded-lg bg-white py-16 shadow">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>

            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>

        <p className="mt-1 text-sm text-gray-500">
          View all your orders and purchase details
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mb-3 text-5xl">🛒</div>

            <h2 className="text-xl font-semibold text-gray-700">
              No Orders Found
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border-b border-gray-300 px-5 py-4 text-sm font-semibold text-gray-700">
                    S NO
                  </th>

                  <th className="border-b border-gray-300 px-5 py-4 text-sm font-semibold text-gray-700">
                    Product Name
                  </th>

                  <th className="border-b border-gray-300 px-5 py-4 text-sm font-semibold text-gray-700">
                    Category Name
                  </th>

                  <th className="border-b border-gray-300 px-5 py-4 text-sm font-semibold text-gray-700">
                    Quantity
                  </th>

                  <th className="border-b border-gray-300 px-5 py-4 text-sm font-semibold text-gray-700">
                    Total Price
                  </th>

                  <th className="border-b border-gray-300 px-5 py-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id} className="transition hover:bg-gray-50">
                    {/* S No */}
                    <td className="border-b border-gray-200 px-5 py-4 text-sm text-gray-700">
                      {index + 1}
                    </td>

                    {/* Product */}
                    <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium text-gray-800">
                      {order.product?.name || "-"}
                    </td>

                    {/* Category */}
                    <td className="border-b border-gray-200 px-5 py-4 text-sm text-gray-700">
                      {order.product?.category?.categoryName || "-"}
                    </td>

                    {/* Quantity */}
                    <td className="border-b border-gray-200 px-5 py-4 text-sm text-gray-700">
                      {order.quantity}
                    </td>

                    {/* Total Price */}
                    <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium text-gray-800">
                      ₹{order.totalPrice}
                    </td>

                    {/* Date */}
                    <td className="border-b border-gray-200 px-5 py-4 text-sm text-gray-700">
                      {formatDate(order.orderDate || order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
