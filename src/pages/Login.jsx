import React from 'react';
import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

const Login =() =>{

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const navigate = useNavigate();

   const navigateTo = ()=>{
    navigate('/register');
   }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userDetails = { email, password };
    try {
      const response = await api.post(
        "/login",
        userDetails,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setEmail("")
      setPassword("")
      Cookies.set('token', response.data.token, { expires: 1 }); 
      Cookies.set('user', JSON.stringify(response.data.user), { expires: 1 });
      Cookies.set('userid',JSON.stringify(response.data.user.userId), { expires: 1 });
      navigate('/');
    } catch (error) {
      if (error.response) {
        // Show backend error message if available
        const backendMsg = error.response.data?.message || "Login failed";
        alert(backendMsg);
        console.error("Login failed:", backendMsg);
      } else if (error.request) {
        alert("No response from server");
        console.error('No response from server');
      } else {
        alert("An error occurred");
        console.log("Error:", error.message);
      }
    }
  };
  return (
    <div className='min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-20 pb-10'>
      <div className='w-full max-w-md rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md shadow-2xl p-6 md:p-8'>
        <div className='text-center mb-6'>
          <div className='mx-auto w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3'>
            <svg className='w-7 h-7 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-white tracking-wide'>Welcome back</h1>
          <p className='text-white/70 mt-1'>Log in to continue</p>
        </div>

        <form onSubmit={handleSubmit} action='/login' className='space-y-4'>
          <div>
            <label className='text-white/90 font-medium block mb-2'>Email</label>
            <input
              type='email'
              name='email'
              placeholder='you@example.com'
              className='w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/40 transition'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className='text-white/90 font-medium block mb-2'>Password</label>
            <input
              type='password'
              name='password'
              placeholder='Your password'
              className='w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/40 transition'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type='submit'
            className='w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-white to-gray-100 text-black font-semibold shadow-lg hover:from-gray-100 hover:to-white active:from-gray-200 active:to-gray-200 focus:outline-none focus:ring-2 focus:ring-white/40 transition'
          >
            Sign in
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-white/80'>Don’t have an account?</p>
          <button
            className='mt-2 inline-flex items-center justify-center rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 hover:shadow-white/20 transition'
            onClick={navigateTo}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
