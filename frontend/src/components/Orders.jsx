import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("pos-token");

      const response = await axios.get("http://localhost:3000/api/order/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);

      alert(error.response?.data?.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("pos-token");

      const response = await axios.put(
        `http://localhost:3000/api/order/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        alert("Order status updated");

        fetchOrders();
      }
    } catch (error) {
      console.error("Status update error:", error);

      alert(error.response?.data?.message || "Error updating order status");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800">Orders</h2>

        <p className="mt-5 text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Orders</h2>

        <p className="mt-1 text-gray-500">All orders placed by customers</p>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-gray-200 text-left">
              <th className="px-5 py-4">S No</th>

              <th className="px-5 py-4">Customer</th>

              <th className="px-5 py-4">Email</th>

              <th className="px-5 py-4">Product</th>

              <th className="px-5 py-4">Category</th>

              <th className="px-5 py-4">Quantity</th>

              <th className="px-5 py-4">Total Price</th>

              <th className="px-5 py-4">Date</th>

              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-4">{index + 1}</td>

                  <td className="px-5 py-4 font-medium">
                    {order.customer?.name || "N/A"}
                  </td>

                  <td className="px-5 py-4">
                    {order.customer?.email || "N/A"}
                  </td>

                  <td className="px-5 py-4">{order.product?.name || "N/A"}</td>

                  <td className="px-5 py-4">
                    {order.product?.category?.categoryName || "N/A"}
                  </td>

                  <td className="px-5 py-4">{order.quantity}</td>

                  <td className="px-5 py-4 font-semibold">
                    ₹{order.totalPrice}
                  </td>

                  <td className="px-5 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                    >
                      <option value="Pending">Pending</option>

                      <option value="Confirmed">Confirmed</option>

                      <option value="Delivered">Delivered</option>

                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Orders;