import React, { useState } from "react";
import axios from "axios";

const UpdateProfilePic = ({ token }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/update-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profile picture updated!");
      // Optionally update user context or local state
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload
      </button>
    </form>
  );
};

export default UpdateProfilePic;
