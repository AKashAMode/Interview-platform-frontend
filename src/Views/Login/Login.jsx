
import {User, Mail, Lock,Eye, EyeOff} from 'lucide-react'
import './Login.css';
import GoogleImg from '../../assets/google.png';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


function LoginComponent(){
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(''); 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email:'',
      password:''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
         ...prev,
         [name]:value
        }));
    };


     const handleSubmit = async (e) => {
          e.preventDefault();
 
          if(!formData.email || !formData.password){
            toast.error('Please fill in all fields');
            return; 
          }

          try{

            const response = await axios.post('https://interview-platform-backend-2.onrender.com/api/auth/login', formData);
             
            if(response.data.token){
               localStorage.setItem('token', response.data.token);
               toast.success('Login successful! Redirecting to dashboard...');
               
               setTimeout(() => {
                  navigate("/dashboard");
                 
                  window.dispatchEvent(new Event('storage'));
               }, 1500);
            }

          }catch(err){
            setError(err.response?.data || 'Login failed');
            toast.error(err.response?.data || 'Login failed');
          }

     }

    
    return(
        <>
        <div className="register-container">
          
        <div className="register-card">
        
         <div className="register-header">
            <h2>AI Interview</h2>
            <p>Login Account</p>
         </div>
       
         <div className="register-form">
           <form onSubmit={handleSubmit}>

            <div className="form-group">
            <label>Email Address</label>
            <div className='input-box'>
            <Mail className='input-icon'/>
            <input type="email" 
            placeholder='Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            />
            </div>
            </div>

            <div className="form-group">
            <label>Password</label>
            <div className='input-box'>
            <Lock className='input-icon'/>
            <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder='Password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            />
            <button className='toggle-btn'
            type='button'
            onClick={()=> setShowPassword(!showPassword)}
             >
               {showPassword ? <EyeOff className='toggle-icon'/> : <Eye className='toggle-icon'/>}
                </button>
            </div>
            </div>

             <div className='form-group'>
                <button className='register-btn' type='submit'>
                    Login Account
                </button>
             </div>
             </form>

             <div className='separator '> 
                <hr/>
                <span className='separator-contain'>Or continue with</span>
                <hr/>
             </div>

             <div className='social-google-login'>
                <div className='social-register'>
                    <img src={GoogleImg} className='google-img' alt="google" />
                    <h4>Continue with Google</h4>
                </div>
             </div>


            <div className='form-group'>
             <p className='login-redirect'>Create new Account ?
                 <NavLink to="/register">
                 <button className='login-btn' type='button'>
                    Sign Up
                 </button>
                 </NavLink>
                 </p>
            </div>

         </div>
        </div>
        
        </div>
        <ToastContainer/>  
        </>
    )
}

export default LoginComponent;