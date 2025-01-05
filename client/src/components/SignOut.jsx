import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'


const SignOut = () => {
  const navigate=useNavigate();
  const handleSignOut=async()=>{
    try{
      const response=await axios.post('https://tutedude-assign.onrender.com/auth/logout',
        {},
        {
          withCredentials:true //to send cookies
        }
      )
      if(response.data.success){
        console.log(response.data.message)
        navigate('/')
      }else {
        console.error('Logout failed:', response.data.message);
      }
    }catch(error){
      console.error('An error occurred during logout:', error.response?.data || error.message);
    }
  }
  return (
    <button
    className='bg-blue-500'
     onClick={handleSignOut} style={{ padding: "10px 20px", color: "#fff", border: "none", cursor: "pointer" }}>
      Sign Out
    </button>
  )
}

export default SignOut
