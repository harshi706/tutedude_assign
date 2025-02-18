import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate=useNavigate();
  const[formData,setFormData]=useState({
    username:"",password:""
})
  const handleChange=(e)=>{
    const { name, value } = e.target;
        setFormData({ ...formData, 
          [name]: value });
      };
    
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      const response=await axios.post("https://tutedude-assign.onrender.com/auth/login",formData,{
        withCredentials: true, //for cookies
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log("User logged in",response.data)
      navigate('/home');
      setFormData({
        username:"",
        password:""
      })

    }catch(error){
      console.error("Submission Failed:", error.response?.data || error.message);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login User</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username:
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
          Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
