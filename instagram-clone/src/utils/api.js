// // src/utils/api.js
// const BACKEND_URL = "http://localhost:5000";


// export async function searchUsers(query) {
//   const res = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('token')}` // if needed
//     }
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch users');
//   }
//   return res.json();
// }



// export async function followUser(userId) {
//   const res = await fetch(`/api/users/follow/${userId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("token")}`, // if you use auth tokens
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to follow user");
//   }

//   return res.json();
// }
// export const unfollowUser = async (userId) => {
//   const res = await fetch(`/api/users/unfollow/${userId}`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`, // Make sure this is passed properly
//     },
//   });

//   if (!res.ok) {
//     const data = await res.json();
//     throw new Error(data.message || "Unfollow failed");
//   }

//   return await res.json();
// };


const BACKEND_URL = "http://localhost:5000";

// Search users
export async function searchUsers(query) {
  const res = await fetch(`${BACKEND_URL}/api/users/search?query=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
}

// Follow a user
export async function followUser(userId) {
  const res = await fetch(`${BACKEND_URL}/api/users/follow/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({}), // optional: depends on backend expectations
  });

  if (!res.ok) {
    throw new Error("Failed to follow user");
  }

  return res.json();
}

// Unfollow a user
export const unfollowUser = async (userId) => {
  const res = await fetch(`${BACKEND_URL}/api/users/unfollow/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({}), // optional
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Unfollow failed");
  }

  return await res.json();
};

