import React, { useEffect, useState } from "react";
import "../../src/css/SummaryPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const SummaryPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/cart`, { withCredentials: true })
      .then((response) => {
        setCartItems(response.data.items || []);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart items");
      });
  }, [API_BASE_URL]);

  const handleQuantityChange = async (bookId, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.book._id === bookId) {
        const newQuantity = item.quantity + delta;

        if (newQuantity < 1) {
          toast.error("Invalid quantity! Cannot be less than 1.");
          return item;
        }

        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);

    try {
      await axios.put(
        `${API_BASE_URL}/api/cart/update`,
        { bookId, quantity: updatedCart.find((item) => item.book._id === bookId)?.quantity },
        { withCredentials: true }
      );

      toast.success(delta > 0 ? "Book quantity increased!" : "Book quantity decreased!");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity.");
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cart/remove/${bookId}`, { withCredentials: true });
      setCartItems((prevItems) => prevItems.filter((item) => item.book._id !== bookId));
      toast.success("Book removed from cart!");
    } catch (error) {
      toast.error("Error removing book from cart");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.book.demandPrice * item.quantity,
    0
  );

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      setLoading(true);

      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/payment/order`,
        { amount: totalPrice },
        { withCredentials: true }
      );

      const { orderId, currency } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: totalPrice * 100,
        currency: currency,
        name: "Bookify Store",
        description: "Book Purchase",
        order_id: orderId,
        handler: async function (response) {
          try {
            await axios.post(
              `${API_BASE_URL}/api/payment/verify`,
              { ...response, orderId },
              { withCredentials: true }
            );
            toast.success("Payment Successful! 🎉");
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment failed! Try again.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map(({ book, quantity }) => (
            <div key={book._id} className="cart-item">
              <div className="cart-item-image">
                <img src={`${API_BASE_URL}/uploads/${book.photos[0]}`} alt={book.bookName} />
              </div>
              <div className="cart-item-details">
                <h3>{book.bookName}</h3>
                <p>Price: ₹{book.demandPrice}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(book._id, -1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange(book._id, 1)}>+</button>
                </div>
                <button className="remove-button" onClick={() => handleRemove(book._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Total Price: ₹{totalPrice}</h3>
            <h4>Payment Method:</h4>
            <select value={selectedPayment} onChange={handlePaymentChange}>
              <option value="upi">UPI</option>
              <option value="creditCard">Credit Card</option>
              <option value="debitCard">Debit Card</option>
              <option value="netBanking">Net Banking</option>
            </select>
            <button className="checkout-button" onClick={handleCheckout} disabled={loading}>
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
