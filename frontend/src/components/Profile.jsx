import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../src/css/Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    profileImageURL: '/images/default.webp',
    gender: '',
    mobileNo: '',
    address: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/me`, {
          withCredentials: true
        });
        setUser(res.data);
        if (res.data.profileImageURL) {
          setImagePreview(`${import.meta.env.VITE_API_BASE_URL}${res.data.profileImageURL}`);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }
    formData.append('mobileNo', user.mobileNo || '');
    formData.append('gender', user.gender || 'Other');
    formData.append('address', user.address || '');

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setMessage('Profile updated successfully!');
      const updatedUser = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/me`, {
        withCredentials: true
      });
      setUser(updatedUser.data);
      if (updatedUser.data.profileImageURL) {
        setImagePreview(`${import.meta.env.VITE_API_BASE_URL}${updatedUser.data.profileImageURL}`);
      }
    } catch (error) {
      setMessage('Failed to update profile');
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-image">
          <img src={imagePreview || "/images/default.webp"} alt="Profile" />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="profile-details">
          <label>Full Name</label>
          <input type="text" name="fullName" value={user.fullName} onChange={handleChange} required />
          <label>Email</label>
          <input type="email" name="email" value={user.email} disabled />
          <label>Gender</label>
          <select name="gender" value={user.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <label>Mobile Number</label>
          <input type="text" name="mobileNo" value={user.mobileNo} onChange={handleChange} />
          <label>Address</label>
          <textarea name="address" value={user.address} onChange={handleChange}></textarea>
          <button type="submit">Update Profile</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Profile;
