
import {User, Mail, Lock,Eye, EyeOff} from 'lucide-react'
import './Register.css';
import GoogleImg from '../../assets/google.png';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


function Register(){
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(''); 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        firstName: '',
        lastName: '',
        email:'',
        password:''
    });


    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData(prev => ({ 
            ...prev,
            [name]:value
        }));
    }

    const handleSubmit = async (e) => {
           e.preventDefault();
           
           if(!formData.firstName || !formData.lastName || !formData.email || !formData.password){
            toast.error('Please fill in all fields');
            return; 
           }

          try{

            const response =  await axios.post('https://interview-platform-backend-2.onrender.com/api/auth/register', formData);

            if(response.status === 200){
                toast.success('Registered successfully! Please login to continue.');
            }

            setTimeout(()=> {
                navigate("/login");
            }, 1500);

          }catch(err){
             setError(err.response?.data || 'Registration failed');
             toast.error(err.response?.data || 'Registration failed');
          }
    }

    

    return(
        <>
        <div className="register-container">
          
        <div className="register-card">
        
         <div className="register-header">
            <h2>AI Interview</h2>
            <p>Create Account</p>
         </div>
       
         <div className="register-form">
           <form onSubmit={handleSubmit}>
          <div className='name-fields'>
           
           <div className="form-group">
            <label>First Name</label>
            <div className='input-box'>
            <User className='input-icon'/>
            <input type="text"
             placeholder='First Name'
             name='firstName'
             value={formData.firstName}
             onChange={handleChange}
             />
            </div>
           </div>

           <div className="form-group">
            <label>Last Name</label>
            <div className='input-box'>
            <User className='input-icon'/>
            <input type="text" 
            placeholder='Last Name'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            />
            </div>
           </div>

          </div>

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
                    Create Account
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
             <p className='login-redirect'>Already have an account ?
                 <NavLink to="/login">
                  <button className='login-btn' type='button'>
                    Sign in
                 </button>
                 </NavLink>
                 </p>
            </div>

         </div>
        </div>
        <ToastContainer/>  
        </div>
        </>
    )
}

export default Register;