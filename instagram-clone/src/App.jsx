import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import UploadPost from "./pages/UploadPost";
import Chat from "./pages/Chat";


// 🔐 PrivateRoute for protected pages
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};
const handleAddPost = (newPost) => {
  console.log("Post added:", newPost);
  // You can update post list or call API here
};
function App() {
  const location = useLocation();
  const hideNavbarOnRoutes = ["/login", "/signup", "/"];

  const handleAddPost  = async (newPost) => {
  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // assuming you're using JWT
      },
      body: JSON.stringify(newPost),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Post uploaded to DB:", data);
    } else {
      console.error("Upload failed:", data.message);
    }
  } catch (err) {
    console.error("Error uploading post:", err);
  }
};


  return (
    <>
      {!hideNavbarOnRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadPost addPost={handleAddPost} />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
  path="/chat"
  element={
    <PrivateRoute>
      <Chat />
    </PrivateRoute>
  }
/>

      </Routes>
    </>
  );
}


export default App;
