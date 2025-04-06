import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../src/css/Orders.css";

axios.defaults.withCredentials = true;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/user/me`, {
          withCredentials: true,
        });
        setUserId(response.data._id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [API_BASE]);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/orders?userId=${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, API_BASE]);

  return (
    <div className="orders-page">
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-container">
          <h2>My Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              {order.items.map(({ bookId, quantity }) => (
                <div key={bookId._id} className="order-item">
                  {/* Left Section: Image, Book Name, Color, Quantity */}
                  <div className="order-left">
                    <img
                      src={
                        bookId.photos?.[0]
                          ? `${API_BASE}/uploads/${bookId.photos[0]}`
                          : "/default-book.png"
                      }
                      alt={bookId.bookName}
                      className="order-item-image"
                    />
                    <div className="order-item-details">
                      <h4>{bookId.bookName}</h4>
                      <p>Color: {bookId.color || "N/A"}</p>
                      <p>Quantity: {quantity}</p>
                    </div>
                  </div>

                  {/* Center Section: Price, Delivery Status */}
                  <div className="order-center">
                    <p className="order-amount">₹{order.amount}</p>
                    <p className={`order-status ${order.paymentStatus.toLowerCase()}`}>
                      ● Delivered on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Right Section: Rate & Review Button */}
                  <div className="order-right">
                    <button className="rate-review">★ Rate & Review Product</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
