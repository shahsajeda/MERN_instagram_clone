import React, { useEffect, useState } from "react";
import axios from "axios";
import { searchUsers, followUser ,unfollowUser} from "../utils/api";
import { useParams } from "react-router-dom";

const EditProfileCard = ({ onClose }) => {
  const [bio, setBio] = useState("This is my bio...");
  const [gender, setGender] = useState("Male");

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/users/update-bio",
        { bio, gender },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = res.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onClose(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <div className="mb-4">
          <label className="block font-semibold">Bio:</label>
          <textarea
            className="border border-gray-300 w-full rounded p-2 mt-1"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Gender:</label>
          <select
            className="border border-gray-300 rounded w-full p-2 mt-1"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => onClose(null)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showEditCard, setShowEditCard] = useState(false);
  
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = loggedInUser?._id;
  const { userId } = useParams();


  
  // useEffect(() => {
  //   const userData = localStorage.getItem("user");
  //   if (userData) {
  //     const parsedUser = JSON.parse(userData);
  //     setUser(parsedUser);
  //     fetchUserPosts(parsedUser.username);

  //     if (!parsedUser.bio || !parsedUser.gender || !parsedUser.profilePic) {
  //       setShowEditCard(true);
  //     }
  //   }
  // }, []);
// useEffect(() => {
//   const fetchProfile = async () => {
//     try {
//       const loggedInUser = JSON.parse(localStorage.getItem("user"));
//       if (!loggedInUser) return;

//       const token = localStorage.getItem("token");
//       const res = await axios.get(`http://localhost:5000/api/users/profile/${loggedInUser.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const fetchedUser = res.data;

//       setUser(fetchedUser);

//       fetchUserPosts(fetchedUser.username);

//       if (!fetchedUser.bio || !fetchedUser.gender || !fetchedUser.profilePic) {
//         setShowEditCard(true);
//       }
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//     }
//   };

//   fetchProfile();
// }, []);
useEffect(() => {
 const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
   const loggedInUserId = loggedInUser?._id || loggedInUser?.id;

console.log("loggedInUserId: ",loggedInUserId);


    if (!loggedInUserId) return;

    const res1 = await axios.get(
      `http://localhost:5000/api/users/profile/${loggedInUserId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const profile1 = res1.data;

    if (userId && userId !== loggedInUserId) {
      const res2 = await axios.get(
        `http://localhost:5000/api/users/profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      

      const profile2 = res2.data;
      setUser(profile2);
      fetchUserPosts(profile2.username);

      if (
        loggedInUserId === profile2._id &&
        (!profile2.bio || !profile2.gender || !profile2.profilePic)
      ) {
        setShowEditCard(true);
      }
      
    } 
    
    else {
      setUser(profile1);
      fetchUserPosts(profile1.username);

      if (
        !profile1.bio || !profile1.gender || !profile1.profilePic
      ) {
        setShowEditCard(true);
      }
    }
    
  } 
  
  catch (err) {
    console.error("Error fetching profile:", err);
  }
};


  fetchProfile();
}, [userId]);





  const fetchUserPosts = async (username) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/user/${username}`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };


  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/uploads/update-profile-pic",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedUser = res.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Profile picture updated!");
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      alert("Failed to upload profile picture.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };
  


  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-4 sm:p-8 lg:ml-60">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8 space-y-4 sm:space-y-0">
        <label className="cursor-pointer relative group">
         
          <img
            src={user.profilePic || "https://render.fineartamerica.com/images/rendered/default/poster/7/8/break/images/artworkimages/medium/3/doremon-deepak-pengoria.jpg"}
            alt="profile"
            className="rounded-full w-32 h-32 object-cover border-2 border-gray-300 group-hover:opacity-60 transition"
          />
          
          <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            Change Photo
          </span>
          
           {loggedInUserId === user._id &&(
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
          )}
        </label>

        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-600 mt-1">{user.bio || "Your bio goes here..."}</p>

          <div className="flex justify-center sm:justify-start space-x-6 mt-3">
  <p><strong>{posts.length}</strong> posts</p>
  <p><strong>{user.followers?.length || 0}</strong> followers</p>
  <p><strong>{user.following?.length || 0}</strong> following</p>
</div>



        {loggedInUserId === user._id && (
  <button
    onClick={() => setShowEditCard(true)}
    className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
  >
    Edit Profile
  </button>
)}

        </div>
      </div>

      {/* Edit Modal */}
      {showEditCard && (
        <EditProfileCard
          onClose={(updatedUser) => {
            if (updatedUser) setUser(updatedUser);
            setShowEditCard(false);
          }}
        />
      )}

      {/* Posts Grid */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Your Posts</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="relative w-full aspect-square bg-gray-100 rounded overflow-hidden shadow-md"
            >
              {post.fileType === "video" ? (
                <video controls className="w-full h-full object-cover">
                  <source src={post.postFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={post.postFile}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              )}
              {post.caption && (
                <p className="absolute bottom-0 left-0 right-0 text-white bg-black bg-opacity-50 text-xs p-1 truncate">
                  {post.caption}
                </p>
              )}
             {loggedInUserId == user._id && (
  <button
    onClick={() => handleDeletePost(post._id)}
    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
  >
    Delete
  </button>
)}

            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
