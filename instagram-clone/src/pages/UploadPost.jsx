import React, { useState } from "react";

const UploadPost = ({ addPost }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [fileType, setFileType] = useState(""); // "image" or "video"

  const user = JSON.parse(localStorage.getItem("user"));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const type = selectedFile.type.startsWith("video") ? "video" : "image";
      setFileType(type);
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
      setFileType("");
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!file) {
    alert("Please select an image or video to upload");
    return;
  }

  const newPost = {
    username: user?.username || "anonymous",
    profilePic: user?.profilePic || "https://i.pravatar.cc/40?img=3",
    postFile: preview,
    fileType,
    caption,
  };

  try {
    const token = localStorage.getItem("token");

 const response = await fetch(`http://localhost:5000/api/posts`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(newPost),
});
console.log(import.meta.env);

console.log("API URL:", import.meta.env.VITE_API_URL);



    if (response.ok) {
      setUploadMessage("🎉 Your post has been uploaded!");
      setFile(null);
      setPreview(null);
      setCaption("");
      setFileType("");
      setTimeout(() => setUploadMessage(""), 3000);
    } else {
      setUploadMessage("❌ Failed to upload post.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    setUploadMessage("❌ Something went wrong.");
  }
};


  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Upload New Post</h2>

      {uploadMessage && (
        <div className="text-green-600 font-semibold text-center mb-4 transition-opacity duration-500">
          {uploadMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100"
        />

        {preview && (
          <>
            {fileType === "image" ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto rounded-lg mt-2"
              />
            ) : (
              <video
                controls
                className="w-full h-auto rounded-lg mt-2"
                src={preview}
              />
            )}
          </>
        )}

        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default UploadPost;
