import axios from "axios";

// Fetch all posts with pagination
export const getAllPosts = async (limit, page) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/feed/posts?_limit=${limit}&_page=${page}`
    );
    console.log("Posts fetched successfully:", res.data);
    return res?.data; // Return posts data
  } catch (error) {
    console.error("Error while fetching posts:", error);
    return { error: error.message }; // Return error message for better error handling
  }
};

// Create a new post
export const createPost = async (content, files, id) => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("id", id);

  // Append all files to FormData
  files.forEach((file) => formData.append("files", file));

  try {
    const response = await axios.post(
      `http://localhost:8080/feed/create-post`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      }
    );
    console.log("Post created successfully:", response.data);
    return response.data; // Return response data
  } catch (error) {
    console.error("Error while creating post:", error);
    throw error; // Re-throw the error for proper error handling in the component
  }
};

export const getPostofCreator= async(id)=>{
  try {
    const res= await axios.get(`http://localhost:8080/feed/myposts/${id}`);
    return res.data;
    
  } catch (error) {
    
  }
}
