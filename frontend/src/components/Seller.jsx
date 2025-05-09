import React, { useState } from "react";
import '../../src/css/Seller.css';
import axios from "axios";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Seller = () => {
  const [formData, setFormData] = useState({
    bookName: "",
    bookDetails: "",
    demandPrice: "",
    bookCondition: "Excellent",
    state: "",
    addressLine: "",
    contactNumber: "",
    photos: [],
  });

  const [toastVisible, setToastVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 6); // Limit to 6 images
    setFormData({ ...formData, photos: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
      alert("Contact number must be exactly 10 digits.");
      return;
    }
  
    const data = new FormData();
    data.append("bookName", formData.bookName);
    data.append("bookDetails", formData.bookDetails);
    data.append("demandPrice", formData.demandPrice);
    data.append("bookCondition", formData.bookCondition);
    data.append("state", formData.state);
    data.append("addressLine", formData.addressLine);
    data.append("contactNumber", formData.contactNumber);
  
    formData.photos.forEach((photo) => {
      data.append("photos", photo);
    });
  
    try {
      const response = await axios.post("http://localhost:8000/api/books/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // Ensure the auth token is sent
      });
  
      console.log("Response:", response.data);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Try again.");
    }
  
    setFormData({
      bookName: "",
      bookDetails: "",
      demandPrice: "",
      bookCondition: "Excellent",
      state: "",
      addressLine: "",
      contactNumber: "",
      photos: [],
    });
  };
  

  return (
    <div className="form-container">
      <h2>Sell Your Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group bordered">
          <label>Book Name:</label>
          <input type="text" name="bookName" value={formData.bookName} onChange={handleChange} required />
        </div>

        <div className="form-group bordered">
          <label>Book Details:</label>
          <textarea name="bookDetails" value={formData.bookDetails} onChange={handleChange} required rows="4" />
        </div>

        <div className="form-group bordered">
          <label>Demand Price (₹):</label>
          <input type="number" name="demandPrice" value={formData.demandPrice} onChange={handleChange} required min="1" />
        </div>

        <div className="form-group bordered">
          <label>Book Condition:</label>
          <select name="bookCondition" value={formData.bookCondition} onChange={handleChange} required>
            <option value="Excellent">Excellent</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div className="form-group bordered">
          <label>State:</label>
          <select name="state" value={formData.state} onChange={handleChange} required>
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="form-group bordered">
          <label>Address Line:</label>
          <input type="text" name="addressLine" value={formData.addressLine} onChange={handleChange} required />
        </div>

        <div className="form-group bordered">
          <label>Contact Number:</label>
          <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required pattern="[0-9]{10}" title="Contact number must be exactly 10 digits." />
        </div>

        {/* Upload Photos Section */}
        <div className="form-group bordered">
          <label>Upload Photos (up to 6):</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <div className="photo-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="photo-box">
                {formData.photos[index] ? (
                  <img src={URL.createObjectURL(formData.photos[index])} alt="Preview" />
                ) : (
                  <span>+</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>

      {toastVisible && <div className="toast">Form submitted successfully!</div>}
    </div>
  );
};

export default Seller;
