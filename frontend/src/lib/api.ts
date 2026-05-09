// import axios from "axios";

// const API = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default API;


// src/lib/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default API;