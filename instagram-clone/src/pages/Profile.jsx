// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const EditProfileCard = ({ onClose }) => {
//   const [bio, setBio] = useState("This is my bio...");
//   const [gender, setGender] = useState("Male");

  

// const handleSave = async () => {
//   try {
//     const token = localStorage.getItem("token"); // JWT token for auth

//     const res = await axios.put(
//       "http://localhost:5000/api/users/update-bio",
//       { bio, gender },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const updatedUser = res.data;
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//     onClose(updatedUser);
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     alert("Failed to update profile");
//   }
// };


//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
//         <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

//         <div className="mb-4">
//           <label className="block font-semibold">Bio:</label>
//           <textarea
//             className="border border-gray-300 w-full rounded p-2 mt-1"
//             value={bio}
//             onChange={(e) => setBio(e.target.value)}
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block font-semibold">Gender:</label>
//           <select
//             className="border border-gray-300 rounded w-full p-2 mt-1"
//             value={gender}
//             onChange={(e) => setGender(e.target.value)}
//           >
//             <option>Male</option>
//             <option>Female</option>
//             <option>Other</option>
//           </select>
//         </div>

//         <div className="flex justify-end space-x-2">
//           <button
//             onClick={handleSave}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Save
//           </button>
//           <button
//             onClick={() => onClose(null)}
//             className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [showEditCard, setShowEditCard] = useState(false);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser);

//       // Check for missing info
//       if (!parsedUser.bio || !parsedUser.gender || !parsedUser.profilePic) {
//         setShowEditCard(true);
//       }
//     }
//   }, []);

//   if (!user) return <div>Loading...</div>;

//   return (
//     <div className="p-7 ml-60">
//       {/* Profile Info */}
//       <div className="flex items-center space-x-8">
//         <img
//           src={
//             user.profilePic ||
//             "https://render.fineartamerica.com/images/rendered/default/poster/7/8/break/images/artworkimages/medium/3/doremon-deepak-pengoria.jpg"
//           }
//           alt="profile"
//           className="rounded-full w-32 h-32 object-cover"
//         />
//         <div>
//           <h1 className="text-2xl font-bold">{user.username}</h1>
//           <p className="text-gray-500">{user.bio || "Your bio goes here..."}</p>
//           <div className="flex space-x-4 mt-2">
//             <p><strong>12</strong> posts</p>
//             <p><strong>340</strong> followers</p>
//             <p><strong>180</strong> following</p>
//           </div>

//           <button
//             onClick={() => setShowEditCard(true)}
//             className="mt-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Edit Profile
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {showEditCard && (
//         <EditProfileCard
//           onClose={(updatedUser) => {
//             if (updatedUser) setUser(updatedUser);
//             setShowEditCard(false);
//           }}
//         />
//       )}

//       {/* Posts */}
//       <div className="grid grid-cols-3 gap-4 mt-8">
//         {[1, 2, 3, 4, 5, 6].map((p) => (
//           <div
//             key={p}
//             className="w-full aspect-square bg-gray-100 flex items-center justify-center"
//           >
//             Post {p}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from "react";
import axios from "axios";

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      fetchUserPosts(parsedUser.username);

      if (!parsedUser.bio || !parsedUser.gender || !parsedUser.profilePic) {
        setShowEditCard(true);
      }
    }
  }, []);

  const fetchUserPosts = async (username) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/user/${username}`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleDeletePost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPosts(posts.filter((post) => post._id !== postId));
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Failed to delete post");
  }
};


  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-7 ml-60">
      {/* Profile Info */}
      <div className="flex items-center space-x-8">
        <img
          src={
            user.profilePic ||
            "https://render.fineartamerica.com/images/rendered/default/poster/7/8/break/images/artworkimages/medium/3/doremon-deepak-pengoria.jpg"
          }
          alt="profile"
          className="rounded-full w-32 h-32 object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-500">{user.bio || "Your bio goes here..."}</p>
          <div className="flex space-x-4 mt-2">
            <p><strong>{posts.length}</strong> posts</p>
            <p><strong>340</strong> followers</p>
            <p><strong>180</strong> following</p>
          </div>

          <button
            onClick={() => setShowEditCard(true)}
            className="mt-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-600"
          >
            Edit Profile
          </button>
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

      {/* Posts */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {/* {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="relative w-full aspect-square bg-gray-100 flex flex-col items-center justify-center rounded overflow-hidden"
            >
              <img
                src={post.postFile}
                alt="Post"
                className="w-full h-full object-cover"
              />
              {post.caption && (
                <p className="absolute bottom-2 left-2 right-2 text-white bg-black bg-opacity-50 text-sm p-1 rounded">
                  {post.caption}
                </p>
              )}
              <button
                onClick={() => handleDeletePost(post._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No posts yet.</p>
        )} */}
        {posts.length > 0 ? (
  posts.map((post) => (
    <div
      key={post._id}
      className="relative w-full aspect-square bg-gray-100 flex flex-col items-center justify-center rounded overflow-hidden"
    >
      {post.postFile.endsWith(".mp4") ? (
        <video controls className="w-full h-full object-cover rounded-lg">
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
        <p className="absolute bottom-2 left-2 right-2 text-white bg-black bg-opacity-50 text-sm p-1 rounded">
          {post.caption}
        </p>
      )}

      <button
        onClick={() => handleDeletePost(post._id)}
        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  ))
) : (
  <p className="col-span-3 text-center text-gray-500">No posts yet.</p>
)}

      </div>
    </div>
  );
};

export default Profile;
