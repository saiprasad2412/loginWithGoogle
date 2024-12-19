import axios from "axios"

const getProfilePageDataFn=async(id)=>{
    try {
        const res= await axios.get(`http://localhost:8080/users/profile/${id}`);
        return res.data;
        
        
    } catch (error) {
        console.log('error while getting profile data');
    }

}

const updateProfileDataFn= async(payload , id)=>{
    const data = await axios.put(`http://localhost:8080/users/myprofile/${id}`,payload);
    return data;
}
export {getProfilePageDataFn, updateProfileDataFn};