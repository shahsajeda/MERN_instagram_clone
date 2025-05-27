import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaHeart, FaRegComment } from "react-icons/fa"; // Importing icons

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-100 to-purple-100 min-h-screen pb-12">
      <Navbar />
      <h1 className="text-center text-4xl font-bold mt-8 mb-10 text-purple-800">
        Instagram Clone
      </h1>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet...</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                <img
                  className="h-10 w-10 rounded-full object-cover border border-purple-300"
                  src={post.profilePic}
                  alt={post.username}
                />
                <p className="font-semibold text-gray-800">{post.username}</p>
              </div>

              {/* Post Content */}
              <div className="bg-black/5">
                {post.fileType === "image" ? (
                  <img
                    src={post.postFile}
                    alt="Post"
                    className="w-full max-h-[500px] object-contain"
                  />
                ) : (
                  <video
                    controls
                    className="w-full max-h-[500px] object-contain"
                  >
                    <source src={post.postFile} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Buttons with Icons */}
              <div className="px-4 py-2 flex gap-6 text-2xl text-gray-700">
                <button className="hover:text-red-500 hover:scale-125 transition">
                  <FaHeart />
                </button>
                <button className="hover:text-blue-500 hover:scale-125 transition">
                  <FaRegComment />
                </button>
              </div>

              {/* Caption */}
              <div className="px-4 pb-4 text-sm text-gray-800">
                <p>
                  <span className="font-semibold">{post.username}</span>{" "}
                  {post.caption}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
