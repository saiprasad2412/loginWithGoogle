import axios from "axios";

// Fetch all posts with pagination
export const getAllPosts = async (limit, page) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/feed/posts?_limit=${limit}&_page=${page}`
    );
    return res?.data;
  } catch (error) {
    console.error("Error while fetching posts:", error);
    return { error: error.message };
  }
};

// Create a new post
export const createPost = async (content, files, id) => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("id", id);

  files.forEach((file) => formData.append("files", file));

  try {
    const response = await axios.post(
      `http://localhost:8080/feed/create-post`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while creating post:", error);
    throw error;
  }
};

export const getPostofCreator= async(id)=>{
  try {
    const res= await axios.get(`http://localhost:8080/feed/myposts/${id}`);
    return res.data;
    
  } catch (error) {
    
  }
}

export const handleLikeFn= async(postId, userId)=>{  
  const res=await axios.put(`http://localhost:8080/feed/posts/:${postId}/like`,{userId});
  return res;
}
