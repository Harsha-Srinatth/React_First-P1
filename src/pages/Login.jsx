import React from 'react';
import { useState } from 'react';
import api from '../services/api';
import {useNavigate} from 'react-router-dom'

const Login =() =>{

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const navigate = useNavigate();

   const navigateTo = ()=>{
    navigate('/register');
   }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userDetails = {email,password}    
    try{
    const response = await api.post("/login",
     userDetails,console.log(userDetails),
     {
     headers:{
         "Content-Type": "applicatiion/json"
     }},
   );
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    navigate('/');
    
    }catch(error){
     if(error.response){
       console.error("registration failed:", error.responce.data.message || "user is not registered");
     }else if(error.request){
       console.error('No responce from server');
     }else {
       console.log("Error:", error.message);
   }
 }
};
  return(
  <>
    <div className='min-h-screen  flex  justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-600 '>
      <div className ="shadow-md w-full max-w-md rounded-xl bg-white p-7" >
        <h1 className='text-2xl font-bold text-center text-black'><i className="fa-solid fa-user px-1"></i>Login</h1>
        <form onSubmit ={handleSubmit} action ="/login" className='mt-6'>
          <div className='mx-4 items-center '>
            <label className='text-black text-xl font-semibold block mb-2'>Email</label>
            <input type="email" name="email" placeholder = "Enter the Email" className="
            w-full px-4 py-2 border-1 rounded-lg focus:outline-none fous:ring-2 focus:ring-black-100"
            onChange={(e) => setEmail(e.target.value)}/>
            <label className='text-black text-xl font-semibold block mb-2 mt-2'>Password</label>
          <input type="password" name="password" placeholder = "Enter the password" className="
            w-full px-4 py-2 border-1 rounded-lg focus:outline-none fous:ring-2 focus:ring-black-100"
            onChange={(e) => setPassword(e.target.value)}/>
          <div className='flex justify-center mt-3'>
            <button className="text-white text-xl font-semibold  bg-gradient-to-r from-purple-500 to-blue-500 border-0 py-1 px-4  hover:from-purple-600 hover: to-blue-600
                focus:outline-none focus:ring focus:ring-purple-300
                active:bg-blue-700 rounded text-base mt-4 md:mt-0" type="submit" >
                    Submit
              {/*  <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg> */}
            </button>
            </div>
          </div>
        </form>
        <div className='flex justify-center mt-2'>
        <p className='text-zinc-950 font-semibold'>You Don't have an Account Register here.!</p>
        </div>
        <div className='flex justify-center text-zinc-950 font-semibold'>
          <a className = " bg-gradient-to-r from-fuchsia-400 to-blue-500 px-3 mt-2 rounded-xl cursor-pointer"
            onClick={navigateTo}>Register</a> 
        </div>
            
        </div>
    </div>
  </>
    );
};
export default Login;
