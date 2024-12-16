import axios from "axios";

export const getAllPosts=async( limit ,page)=>{
    try {
        const res=await axios.get(`http://localhost:8080/feed/posts?_limit=${limit}&_page=${page}`);
        console.log('posts',res.data); 
        return res?.data?.posts;
        
    } catch (error) {
        console.log('error while getting Posts ',error);
        return error.message;
    }
}