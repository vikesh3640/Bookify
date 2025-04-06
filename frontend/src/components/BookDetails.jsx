import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../src/css/BookDetails.css";

axios.defaults.withCredentials = true;
const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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
        toast.error("Failed to fetch user details.");
      }
    };

    fetchUser();
  }, [API_BASE]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setSelectedImage(response.data.photos[0]);
      })
      .catch((error) => console.error("Error fetching book details:", error));
  }, [id, API_BASE]);

  const addToCart = () => {
    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    axios
      .post(
        `${API_BASE}/api/cart/add`,
        { bookId: id, userId },
        { withCredentials: true }
      )
      .then(() => toast.success("Book added to cart! 🛒"))
      .catch((error) => {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add book to cart.");
      });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayScreen = async (amount, orderId) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_y2aFO9g9wRRMcD",
      amount: amount * 100,
      currency: "INR",
      name: "Bookify",
      description: "Purchase book",
      order_id: orderId,
      handler: async function (response) {
        try {
          const verifyRes = await axios.post(`${API_BASE}/api/payment/verify-payment`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            toast.success("Payment successful! 🎉");
            navigate("/orders");
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Error verifying payment.");
        }
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const createRazorpayOrder = () => {
    if (!userId) {
      toast.error("Please log in to proceed with the payment.");
      return;
    }

    axios
      .post(`${API_BASE}/api/payment/create-order`, {
        amount: book.demandPrice,
        userId,
        items: [{ bookId: book._id, title: book.bookName, price: book.demandPrice, quantity: 1 }],
      })
      .then((response) => {
        if (response.data && response.data.orderId) {
          handleRazorpayScreen(response.data.amount, response.data.orderId);
        } else {
          toast.error("Invalid order response from server.");
        }
      })
      .catch((error) => {
        console.error("Error creating order:", error.response?.data || error);
        toast.error("Failed to create order.");
      });
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="book-details-container">
      <div className="book-image-section">
        <div className="main-image-wrapper">
          <img src={`${API_BASE}/uploads/${selectedImage}`} alt={book.bookName} className="book-image-large" />
        </div>

        <div className="thumbnail-section">
          {book.photos.map((photo, index) => (
            <img
              key={index}
              src={`${API_BASE}/uploads/${photo}`}
              alt={`Thumbnail ${index + 1}`}
              className={`book-thumbnail ${selectedImage === photo ? "active" : ""}`}
              onClick={() => setSelectedImage(photo)}
            />
          ))}
        </div>

        <div className="action-buttons">
          <button className="add-to-cart" onClick={addToCart}>🛒 Add to Cart</button>
          <button className="buy-now" onClick={createRazorpayOrder}>⚡ Buy Now</button>
        </div>
      </div>

      <div className="book-info-section">
        <h2>{book.bookName}</h2>
        <p className="book-condition"><strong>Condition:</strong> {book.bookCondition}</p>
        <p className="book-price"><span>Special Price: </span><br /><span className="discounted-price">₹{book.demandPrice}</span></p>
        <hr />
        <div className="book-details">
          <h3>Book Details</h3>
          <p>{book.bookDetails}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
