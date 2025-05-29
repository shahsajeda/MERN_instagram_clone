import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaHeart, FaRegComment } from "react-icons/fa";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?.id;


  const [users, setUsers] = useState([]);


useEffect(() => {
  fetchPosts();
  fetchUsers(); // <-- call to fetch users
}, []);

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/api/users/all-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data?.users || []);
  } catch (err) {
    console.error("Error fetching users:", err);
    setUsers([]); // fallback to empty array to avoid crash
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // Toggle like/unlike in one request (backend handles like/unlike)
  const handleLike = async (postId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/likeunlike/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedLikes = res.data.likes;

      // Update only the likes of the specific post using backend response
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: updatedLikes } : post
        )
      );
    } catch (err) {
      console.error("Like/Unlike error:", err);
    }
  };



  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text) return;

    try {
      await axios.post(
        `http://localhost:5000/api/posts/comment/${postId}`,
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (err) {
      console.error("Comment error:", err);
    }
  };
  const handleReplySubmit = async (e, postId, commentIndex) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/posts/reply/${postId}/${commentIndex}`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText("");
      setReplyingTo(null);
      fetchPosts();
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const handleLikeComment = async (postId, commentIndex) => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/like-comment/${postId}/${commentIndex}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error("Like comment error:", err);
    }
  };


return (
  <div className="bg-gradient-to-b from-gray-100 to-purple-100 min-h-screen pb-12 pt-2">
    <Navbar />
    <h1 className="text-center text-4xl font-bold mt-8 mb-10 text-purple-800">
      Instagram Clone
    </h1>

    {/* MAIN LAYOUT */}
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6">
      {/* LEFT: POSTS */}
      <div className="flex-1">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet...</p>
        ) : (
          posts.map((post) => {
            const isLiked = post.likes?.includes(currentUserId);

            return (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 mb-6"
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

                {/* Buttons */}
                <div className="px-4 py-2 flex gap-6 items-center text-2xl text-gray-700">
                  <button
                    className={`transition-transform duration-200 ${
                      isLiked ? "text-red-500" : "text-gray-700 hover:text-red-500"
                    } hover:scale-125`}
                    onClick={() => handleLike(post._id)}
                    aria-label="Like post"
                  >
                    <FaHeart />
                  </button>
                  <span className="text-sm text-gray-600">
                    {post.likes?.length || 0} likes
                  </span>

                  <button
                    className="hover:text-blue-500 hover:scale-125 transition ml-4"
                    onClick={() => setActiveCommentPostId(post._id)}
                    aria-label="Open comments"
                  >
                    <FaRegComment />
                  </button>
                  <span className="text-sm text-gray-600">
                    {post.comments?.length || 0} comments
                  </span>
                </div>

                {/* Caption */}
                <div className="px-4 pb-2 text-sm text-gray-800">
                  <p>
                    <span className="font-semibold">{post.username}</span> {post.caption}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT: SUGGESTED USERS */}
      <div className="w-full md:w-1/3 lg:w-1/4">
        <div className="bg-white rounded-xl shadow-md p-4 sticky top-20 md:top-24">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Suggested Users
          </h2>
          <div className="flex flex-col gap-4">
            {users.length === 0 ? (
              <p className="text-gray-500">No users found</p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-purple-50 rounded-md p-2 transition"
                  onClick={() => navigateToProfile(user._id)}
                >
                  <img
                    src={user.profilePic || "/default-profile.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
                  />
                  <p className="text-sm text-purple-700 truncate">{user.username}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>

    {/* COMMENT MODAL */}
    {activeCommentPostId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 relative max-h-[80vh] overflow-auto">
          {/* Close Button */}
          <button
            onClick={() => setActiveCommentPostId(null)}
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            aria-label="Close comments modal"
          >
            ✕
          </button>

          <h2 className="text-xl font-bold mb-4 text-purple-700">Comments</h2>

          {/* Comments */}
          <div className="max-h-64 overflow-y-auto space-y-3 text-sm">
            {posts.find((p) => p._id === activeCommentPostId)?.comments?.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              posts
                .find((p) => p._id === activeCommentPostId)
                ?.comments.map((comment, index) => (
                  <div key={index} className="border-b pb-2">
                    <span className="font-semibold">{comment.username}</span> {comment.text}

                    {/* Like & Reply */}
                    <div className="text-xs text-gray-500 flex items-center gap-3 mt-1 ml-1">
                      <button
                        onClick={() => handleLikeComment(activeCommentPostId, index)}
                        className="hover:text-red-500"
                      >
                        ❤️ {comment.likes?.length || 0}
                      </button>
                      <button
                        onClick={() =>
                          setReplyingTo({ postId: activeCommentPostId, commentIndex: index })
                        }
                        className="text-blue-500 hover:underline"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Reply Input */}
                    {replyingTo?.postId === activeCommentPostId &&
                      replyingTo.commentIndex === index && (
                        <form
                          onSubmit={(e) => handleReplySubmit(e, activeCommentPostId, index)}
                          className="flex gap-2 mt-1"
                        >
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="flex-1 border rounded-full px-3 py-1 text-xs"
                          />
                          <button
                            type="submit"
                            className="text-purple-600 font-semibold text-xs"
                          >
                            Send
                          </button>
                        </form>
                      )}

                    {/* Replies */}
                    <div className="ml-4 mt-1 space-y-1 text-xs">
                      {comment.replies?.map((reply, i) => (
                        <div key={i}>
                          <strong>{reply.username}</strong>: {reply.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Add Comment Form */}
          <form
            onSubmit={(e) => handleCommentSubmit(e, activeCommentPostId)}
            className="flex items-center gap-2 mt-4"
          >
            <input
              type="text"
              value={commentInputs[activeCommentPostId] || ""}
              onChange={(e) =>
                setCommentInputs((prev) => ({
                  ...prev,
                  [activeCommentPostId]: e.target.value,
                }))
              }
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm"
            />
            <button
              type="submit"
              className="text-purple-600 font-semibold hover:underline"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
);


};

export default Home;
