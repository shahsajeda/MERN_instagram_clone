import { useRef, useState } from "react";

function ProfileImageUploader() {
  const [imagePreview, setImagePreview] = useState(""); // image preview dikhane ke liye
  const fileInputRef = useRef(); // file input ko control karne ke liye

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // file mil gayi
    if (file) {
      const imageURL = URL.createObjectURL(file); // local preview banaya
      setImagePreview(imageURL); // preview set kiya
    }
  };

  return (
    <div className="flex items-center space-x-8">
      {/* Image par click karne se file input chalega */}
      <label htmlFor="fileInput">
        <img
          src={
            imagePreview ||
            "https://render.fineartamerica.com/images/rendered/default/poster/7/8/break/images/artworkimages/medium/3/doremon-deepak-pengoria.jpg"
          }
          alt="Profile"
          className="rounded-full w-32 h-32 object-cover cursor-pointer"
        />
      </label>

      {/* File input hidden rahega, bas click hone pe chalega */}
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageChange}
      />
    </div>
  );
}

export default ProfileImageUploader;
