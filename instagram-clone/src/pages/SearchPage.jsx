import React, { useState, useEffect } from "react";
import { searchUsers, followUser ,unfollowUser} from "../utils/api";
import axios from "axios";


const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loadingFollow, setLoadingFollow] = useState({});
  const [message, setMessage] = useState(null); // For follow success/error messages
const [following, setFollowing] = useState([]); // ✅ Add this state
  const [followers, setFollowers] = useState([]); 


    const loggedInUserId = localStorage.getItem("userId"); // Or get it from auth context


    // ✅ Fetch follow data
  const fetchFollowData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/follow/${loggedInUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFollowers(res.data.followers || []);
      setFollowing(res.data.following || []);
    } catch (error) {
      console.error("Error fetching follow data:", error);
      setFollowers([]);
      setFollowing([]);
    }
  };

  useEffect(() => {
    if (loggedInUserId) {
      fetchFollowData();
    }
  }, [loggedInUserId]);


const handleChange = async (e) => {
  const q = e.target.value;
  setQuery(q);
  setMessage(null);
  if (q.length > 2) {
    try {
      const users = await searchUsers(q);
      setResults(users.map(user => ({
        ...user,
        followed: following.includes(user._id),
      })));
    } catch (error) {
      setMessage({ type: "error", text: "Failed to search users" });
    }
  } else {
    setResults([]);
  }
};

const handleFollow = async (userId) => {
  setLoadingFollow((prev) => ({ ...prev, [userId]: true }));
  setMessage(null);
  try {
    await followUser(userId);
    setResults((prevResults) =>
      prevResults.map((user) =>
        user._id === userId ? { ...user, followed: true } : user
      )
    );
    setFollowing(prev => [...prev, userId]); // Update following state
    setMessage({ type: "success", text: "User followed successfully!" });
  } catch (error) {
    if (error.message.includes("Already following")) {
      setMessage({ type: "error", text: "You are already following this user." });
      setResults((prevResults) =>
        prevResults.map((user) =>
          user._id === userId ? { ...user, followed: true } : user
        )
      );
      setFollowing(prev => [...prev, userId]);
    } else {
      setMessage({ type: "error", text: "Failed to follow user" });
    }
    console.error("Failed to follow user:", error);
  } finally {
    setLoadingFollow((prev) => ({ ...prev, [userId]: false }));
  }
};

const handleUnfollow = async (userId) => {
  setLoadingFollow((prev) => ({ ...prev, [userId]: true }));
  setMessage(null);
  try {
    await unfollowUser(userId);
    setResults(prevResults =>
      prevResults.map(user =>
        user._id === userId ? { ...user, followed: false } : user
      )
    );
    setFollowing(prev => prev.filter(id => id !== userId));
    setMessage({ type: "success", text: "User unfollowed successfully!" });
  } catch (error) {
    setMessage({ type: "error", text: error.message || "Failed to unfollow user" });
    console.error("Unfollow error:", error);
  } finally {
    setLoadingFollow((prev) => ({ ...prev, [userId]: false }));
  }
};

 return (
  <div className="max-w-xl mx-auto px-4 py-6">
    <input
      type="text"
      placeholder="Search users..."
      value={query}
      onChange={handleChange}
      className="w-full p-3 border border-gray-300 rounded-md mb-6 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />

    {/* Message area */}
    {message && (
      <div
        className={`mb-4 p-3 rounded ${
          message.type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {message.text}
      </div>
    )}

    <ul className="space-y-4">
      {results.map((user) => (
        <li
          key={user._id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md hover:shadow-lg transition-shadow duration-300 bg-white"
        >
          <span className="mb-2 sm:mb-0 text-gray-900 font-semibold text-base sm:text-lg">
            {user.name}{" "}
            <span className="text-gray-500 text-sm sm:text-base font-normal">
              (@{user.username})
            </span>
          </span>

          {loadingFollow[user._id] ? (
            <button
              disabled
              className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 text-sm sm:text-base cursor-wait"
            >
              Loading...
            </button>
          ) : user.followed ? (
            <button
              onClick={() => handleUnfollow(user._id)}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm sm:text-base"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => handleFollow(user._id)}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
            >
              Follow
            </button>
          )}
        </li>
      ))}
    </ul>
  </div>
);

};

export default SearchPage;