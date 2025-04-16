import React, { useEffect } from "react";
import "../../src/css/ContactUs.css";
import styles from "../../src/css/Chatbot.module.css";

const ContactUs = () => {
  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    const quickReplies = document.getElementById("quick-replies");

    const responses = {
      "buy book": { reply: "To buy a book, browse the listings and click 'Buy Now'. Need help with payment or delivery?", options: ["Payment Issue", "Delivery Tracking"] },
      "sell book": { reply: "To sell a book, click 'Sell Book' and upload details. Need help with listing or pricing?", options: ["Listing Issue", "Pricing Help"] },
      "listing issue": { reply: "If you're facing issues with listing, check if all required details are provided correctly. Need more assistance?", options: ["Contact Support"] },
      "pricing help": { reply: "For pricing suggestions, check similar books on our platform or use our pricing guide. Need more help?", options: ["Contact Support"] },
      "payment issue": { reply: "For payment issues, check your transaction history or contact support. Need a refund?", options: ["Refund", "Transaction Failed"] },
      "delivery tracking": { reply: "Track your order in the 'My Orders' section. Need help with a delayed or lost order?", options: ["Delayed Order", "Lost Package"] },
      "refund": { reply: "Refunds are processed within 5-7 business days. Did you not receive it?", options: ["Menu"] },
      "transaction failed": { reply: "Check your bank statement or retry the payment. Still facing issues?", options: ["Contact Support"] },
      "contact support": { reply: "You can reach our support team at iiitsurat.com or call +91234567890.", options: ["Menu"] },
      "menu": { reply: "Welcome back! How can I assist you today?", options: ["Buy Book", "Sell Book", "Payment Issue", "Delivery Tracking"] },
      "delayed order": { reply: "Sorry for the inconvenience. We will fix this soon.", options: ["Menu"] },
      "lost package": { reply: "If your package is lost, contact our support with your order ID.", options: ["Contact Support"] }
    };

    const addMessage = (text, sender) => {
      const message = document.createElement("div");
      message.classList.add(styles["chat-message"], sender === "user" ? styles["user-message"] : styles["bot-message"]);
      message.innerText = text;
      chatBox.appendChild(message);
      chatBox.scrollTop = chatBox.scrollHeight;
    };

    const showQuickReplies = (options) => {
      quickReplies.innerHTML = "";
      if (options.length === 0) return;
      options.forEach(option => {
        const btn = document.createElement("div");
        btn.classList.add(styles["quick-reply"]);
        btn.innerText = option;
        btn.onclick = () => sendMessage(option.toLowerCase());
        quickReplies.appendChild(btn);
      });
    };

    const getGeminiResponse = async (userInput) => {
      const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC3tuudkiDYvAIDW8Cj6rfdOXClchEkpGQ";
      const payload = {
        contents: [{
          parts: [{ text: userInput }]
        }]
      };

      try {
        const response = await fetch(Api_Url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";
        addMessage(reply, "bot");
      } catch (error) {
        console.error("Gemini API error:", error);
        addMessage("Sorry, I couldn't get a proper response. Please try again.", "bot");
      }
    };

    const sendMessage = (input = null) => {
      const userInput = input || document.getElementById("user-input").value.trim().toLowerCase();
      if (!userInput) return;

      addMessage(userInput, "user");

      if (responses[userInput]) {
        const response = responses[userInput];
        setTimeout(() => {
          addMessage(response.reply, "bot");
          showQuickReplies(response.options);
        }, 500);
      } else {
        showQuickReplies([]);
        getGeminiResponse(userInput);
      }

      document.getElementById("user-input").value = "";
    };

    document.getElementById("openChatBtn").onclick = () => {
      document.querySelector(`.${styles["chat-popup"]}`).style.display = "block";
      document.getElementById("openChatBtn").style.display = "none";
    };

    document.querySelector(`.${styles["close-btn"]}`).onclick = () => {
      document.querySelector(`.${styles["chat-popup"]}`).style.display = "none";
      document.getElementById("openChatBtn").style.display = "block";
    };

    // Add initial bot message and quick replies
    addMessage("Welcome to customer support! How can I assist you today?", "bot");
    showQuickReplies(["Buy Book", "Sell Book", "Payment Issue", "Delivery Tracking"]);

    // Send button click handler
    const sendButton = document.getElementById("sendBtn");
    if (sendButton) {
      sendButton.addEventListener("click", () => sendMessage());
    }
  }, []);

  return (
    <div className="support-page">
      <div className="hero-section">
        <h1>Get Support</h1>
        <div className="support-options">
          <div className="support-box">
            <i className="fas fa-map-marker-alt"></i>
            <p>TRACK YOUR ORDER</p>
          </div>
          <div className="support-box">
            <i className="fas fa-undo"></i>
            <p>START A RETURN</p>
          </div>
          <div className="support-box">
            <i className="fas fa-edit"></i>
            <p>CANCEL OR EDIT AN ORDER</p>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="What can we help you with?" />
      </div>

      {/* More Topics Section */}
      <div className="topics-section">
        <h2>MORE TOPICS</h2>
        <div className="topics-grid">
          <div className="topic">
            <h3>ORDER STATUS AND TRACKING</h3>
            <ul>
              <li>Order Status</li>
              <li>More Detailed Tracking Information</li>
              <li>Lost or Missing Package</li>
              <li>Cancel an Order</li>
              <li>Pre-Order FAQs</li>
            </ul>
            <a href="#">SEE MORE</a>
          </div>
          <div className="topic">
            <h3>SHIPPING</h3>
            <ul>
              <li>Change Shipping Address</li>
              <li>Shipping Costs</li>
              <li>Shipping Times</li>
              <li>Shipping Made to Order Items</li>
              <li>International Shipping</li>
            </ul>
            <a href="#">SEE MORE</a>
          </div>
          <div className="topic">
            <h3>RETURNS AND EXCHANGES</h3>
            <ul>
              <li>Cannot Locate Order</li>
              <li>Return Instructions</li>
              <li>Return and Exchange Processing Time</li>
              <li>Return Policy</li>
              <li>Exchange Instructions</li>
            </ul>
            <a href="#">SEE MORE</a>
          </div>
        </div>
      </div>

      {/* Chatbot UI */}
      <button id="openChatBtn">💬 Chat With Us</button>
      <div className={styles["chat-popup"]}>
        <div className={styles["chat-container"]}>
          <div className={styles["chat-header"]}>
            Customer Support
            <span className={styles["close-btn"]}>&times;</span>
          </div>
          <div className={styles["chat-box"]} id="chat-box"></div>
          <div className={styles["quick-replies"]} id="quick-replies"></div>
          <div className={styles["input-box"]}>
            <input type="text" id="user-input" placeholder="Type your query..." />
            <button id="sendBtn">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;