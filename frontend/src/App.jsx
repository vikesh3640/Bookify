import './App.css';
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import Seller from './components/Seller';
import Contactus from './components/ContactUs';
import LoginSignup from './components/LoginSignup';
import SummaryPage from './components/SummaryPage';
import Footer from './components/Footer';
import Category from './components/Category';
import BookDetails from './components/BookDetails';
import Profile from './components/Profile';
import Orders from './components/Orders';  

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Navbar />
        <Category />
        <Homepage />
        <Footer />
      </div>
    ),
  },
  {
    path: "/seller",
    element: (
      <div>
        <Navbar />
        <Seller />
      </div>
    ),
  },
  {
    path: "/helpandcontact",
    element: (
      <div>
        <Navbar />
        <Contactus />
      </div>
    ),
  },
  {
    path: "/login",
    element: <LoginSignup />,
  },
  {
    path: "/cart",
    element: <SummaryPage />,
  },
  {
    path: "/book/:id",
    element: (
      <div>
        <BookDetails />
      </div>
    ),
  },
  {
    path: "/profile",
    element: (
      <div>
        <Navbar />
        <Profile />
      </div>
    ),
  },
  {
    path: "/orders", 
    element: (
      <div>
        <Navbar />
        <Orders />
      </div>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
