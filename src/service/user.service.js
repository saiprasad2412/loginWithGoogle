import axios from "axios"

const getProfilePageDataFn=async(id)=>{
    try {
        console.log('f==>f', id);
        
        
        const res= await axios.get(`http://localhost:8080/users/profile/${id}`);
        console.log('res',res.data);
        return res.data;
        
        
    } catch (error) {
        console.log('error while getting profile data');
        
        
    }

}
export {getProfilePageDataFn};