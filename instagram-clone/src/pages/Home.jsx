import React, { useState } from "react";
import UploadPost from "./UploadPost";
import Navbar from "../components/Navbar";

const initialPosts = [
  {
    id: 1,
    username: "payal_patil",
    profilePic: "https://i.pravatar.cc/40?img=1",
    postImage: "https://source.unsplash.com/600x400/?nature",
    caption: "Enjoying the beauty of nature 🌿✨",
  },
  {
    id: 2,
    username: "techie_guy",
    profilePic: "https://i.pravatar.cc/40?img=5",
    postImage: "https://source.unsplash.com/600x400/?coding",
    caption: "Another late night coding session 💻🔥",
  },
];

const Home = () => {
    <Navbar/>
  const [posts, setPosts] = useState(initialPosts);

  // Function to add new post from UploadPost component
  // const addPost = (post) => {
  //   setPosts([post, ...posts]);
  // };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <h1 className="text-center text-3xl font-bold mb-8">Instagram Clone</h1>

      {/* Upload post form */}
      {/* <UploadPost addPost={addPost} /> */}

      {/* Feed posts */}
      <div className="max-w-xl mx-auto space-y-8 mt-10">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="flex items-center px-4 py-3">
              <img
                className="h-10 w-10 rounded-full"
                src={post.profilePic}
                alt={post.username}
              />
              <p className="ml-4 font-semibold">{post.username}</p>
            </div>

            {/* Post Image */}
            <img
              src={post.postImage}
              alt="Post"
              className="w-full h-auto object-cover"
            />

            {/* Buttons */}
            <div className="px-4 py-2 flex gap-4 text-xl">
              <button className="hover:scale-110 transition">❤️</button>
              <button className="hover:scale-110 transition">💬</button>
            </div>

            {/* Caption */}
            <div className="px-4 pb-4">
              <p>
                <span className="font-semibold">{post.username}</span> {post.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
