import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import api from '../services/api';
import Swal from 'sweetalert2';
//import {Link} from 'react-router-dom'

const Example = () =>{

const [fullname,setFullname] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [username,setUsername] = useState("")
const [userid, setUserid] = useState("")
const navigate = useNavigate();
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trimmed values
    const tFullname = (fullname || '').trim();
    const tUsername = (username || '').trim();
    const tUserid = (userid || '').trim();
    const tEmail = (email || '').trim();

    // Basic required validation aligned with backend
    if (!tFullname || !tUsername || !tUserid || !tEmail || !password) {
      Swal.fire({ icon: 'error', title: 'Missing details', text: 'All fields are required.' });
      return;
    }

    // Simple email check
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailRegex.test(tEmail)) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address.' });
      return;
    }

    // Password length
    if (password.length < 6) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Password must be at least 6 characters long.' });
      return;
    }

    // Transform values (optional UX)
    const transformedFullname = tFullname ? tFullname[0].toUpperCase() + tFullname.slice(1) : tFullname;
    const transformedUserid = tUserid.toUpperCase();

    try {
      const response = await api.post('/register', {
        fullname: transformedFullname,
        username: tUsername,
        userid: transformedUserid,
        email: tEmail,
        password,
      });

      setFullname('');
      setUsername('');
      setUserid('');
      setEmail('');
      setPassword('');

      Swal.fire({ icon: 'success', title: 'Registered successfully', showConfirmButton: false, timer: 1500 });
      navigate('/login');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Registration failed';
      Swal.fire({ icon: 'error', title: 'Registration failed', text: message });
    }
  };
const navigateTo = () => {
  navigate('/login');
}
  
 return (
   <div className='min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-20 pb-10'>
     <div className='w-full max-w-md rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md shadow-2xl p-6 md:p-8'>
       <div className='text-center mb-6'>
         <div className='mx-auto w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3'>
           <svg className='w-7 h-7 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
             <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4' />
           </svg>
         </div>
         <h1 className='text-3xl font-bold text-white tracking-wide'>Create your account</h1>
         <p className='text-white/70 mt-1'>It only takes a minute</p>
       </div>

       <form onSubmit={handleSubmit} action='/register' className='space-y-4'>
         <div>
           <label className='text-white/90 font-medium block mb-2'>Full name</label>
           <input
             type='text'
             value={fullname}
             name='fullname'
             placeholder='John Doe'
             className='w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/40 transition'
             onChange={(e) => setFullname(e.target.value)}
           />
         </div>
         <div>
           <label className='text-white/90 font-medium block mb-2'>Username</label>
           <input
             type='text'
             value={username}
             name='username'
             placeholder='@johndoe'
             className='w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/40 transition'
             onChange={(e) => setUsername(e.target.value)}
           />
         </div>
         <div>
           <label className='text-white/90 font-medium block mb-2'>Reg. No</label>
           <input
             type='text'
             value={userid}
             name='userid'
             placeholder='REG1234'
             className='w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/40 transition'
             onChange={(e) => setUserid(e.target.value)}
           />
         </div>
         <div>
           <label className='text-white/90 font-medium block mb-2'>Email</label>
           <input
             type='email'
             value={email}
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
             value={password}
             name='password'
             placeholder='Minimum 6 characters'
             className='w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/40 transition'
             onChange={(e) => setPassword(e.target.value)}
           />
         </div>

         <button
           type='submit'
           className='w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-white to-gray-100 text-black font-semibold shadow-lg hover:from-gray-100 hover:to-white active:from-gray-200 active:to-gray-200 focus:outline-none focus:ring-2 focus:ring-white/40 transition'
         >
           Create account
         </button>
       </form>

       <div className='mt-6 text-center'>
         <p className='text-white/80'>Already have an account?</p>
         <button
           className='mt-2 inline-flex items-center justify-center rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 hover:shadow-white/20 transition'
           onClick={navigateTo}
         >
           Sign in
         </button>
       </div>
     </div>
   </div>
 );
};

export default Example;