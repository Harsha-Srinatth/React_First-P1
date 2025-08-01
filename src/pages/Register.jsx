import React from 'react';
import { useState  } from 'react';
import {useNavigate} from 'react-router-dom'
import api from '../services/api';
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
     try {
    const response = await api.post('/register', {
      fullname,
      username,
      userid,
      email,
      password,
    });
    // handle success, e.g. show a message or redirect
    setFullname("")
    setUsername("")
    setUserid("")
    setEmail("")
    setPassword("")
    alert('Registered successfully');
    navigate('/login')
  } catch (error) {
    if (error.response) {
      // Backend responded with an error
      console.log('Backend error:', error.response.data);
      alert(error.response.data.message || 'Registration failed');
    } else {
      // Network or other error
      console.log('Error:', error.message);
      alert('An error occurred');
    }
  }
};
const navigateTo = () => {
  navigate('/login');
}
  
return(
 <div>  
     <div className='min-h-screen  flex  justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-600 '>
        <div className ="shadow-md w-full max-w-md rounded-xl bg-white p-7" >
          <h1 className='text-2xl font-bold text-center text-black'>Register</h1>
          <form onSubmit ={handleSubmit} action ="/register" className='mt-6'>
            <div className='mx-4 items-center '>
            <label className='text-black text-xl font-semibold block mb-2'>Enter your Name</label>
            <input type="text" value={fullname} name="fullname" placeholder = "Enter Your Name" className='w-full px-4 py-2 border-1 rounded-lg focus:outline-none fous:ring-2 focus:ring-black-100'
              onChange={(e) => setFullname(e.target.value)}/>
            <label className='text-black text-xl font-semibold block mb-2'>Username</label>
            <input type="text" value={username} name="username" placeholder = "Enter Your Name" className='w-full px-4 py-2 border-1 rounded-lg focus:outline-none fous:ring-2 focus:ring-black-100'
              onChange={(e) => setUsername(e.target.value)}/>
            <label className='text-black text-xl font-semibold block mb-2'>Your Reg.No</label>
            <input type="text" value={userid} name="userid" placeholder = "Enter Your RegNo" className='w-full px-4 py-2 border-1 rounded-lg focus:outline-none fous:ring-2 focus:ring-black-100'
              onChange={(e) => setUserid(e.target.value)}/>
              <label className='text-black text-xl font-semibold block mb-2'>Email</label>
              <input type="email" value={email} name="email" placeholder = "Enter the Email" className="
              w-full px-4 py-2 border-1 rounded-lg focus:outline-none fous:ring-2 focus:ring-black-100"
              onChange={(e) => setEmail(e.target.value)}/>
              <label className='text-black text-xl font-semibold block mb-2 mt-2'>Password</label>
            <input type="password" value={password} name="password" placeholder = "Enter the password" className="
              w-full px-4 py-2 border-1 rounded-lg focus:outline-none fous:ring-2 focus:ring-black-100"
              onChange={(e) => setPassword(e.target.value)}/>
            <div className='flex justify-center mt-3'>
              <button className="text-white text-xl font-semibold  bg-gradient-to-r from-purple-500 to-blue-500 border-0 py-1 px-4  hover:from-purple-600 hover: to-blue-600
                active:bg-blue-700 rounded text-base mt-4 md:mt-0" type="submit" >
                      Submit
              </button>
              </div>
            </div>
          </form>
          <div className='flex justify-center mt-2'>
             <p className='text-zinc-950 font-semibold'>Already Have an Account Login here..!</p>
          </div>
          <div className='flex justify-center text-zinc-950 font-semibold'>
            <a className = " bg-gradient-to-r from-fuchsia-400 to-blue-500 px-3 mt-2 rounded-xl cursor-pointer"
              onClick={navigateTo}>Login</a> 
          </div>
       </div>
    </div>
 </div> 
    
    );
};

export default Example;