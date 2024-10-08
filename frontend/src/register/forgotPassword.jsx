import React, { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye,faEyeSlash,faUser,faLock } from '@fortawesome/free-solid-svg-icons'
import {Auth} from "../hooks/loginHook"
import "./register.css"
import { Link } from 'react-router-dom'
const SignUp = () => {
    const [email,setEmail] = useState('')
    const [error,setError] = useState(null)
    const {dispatch,user} = Auth()
    const ForgotPassword = async (e) => {
        e.preventDefault()
        const response = await fetch(`http://localhost:4000/binYala/users/forgetPassword`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email})
        })
        const json = await response.json()

        if(!response.ok){
            console.log(json)
            setError(json.message)
        }
        if(response.ok){
            setError(json.message)
            console.log(json)
        }
    }//this function for Send ur Request to ur email address
    useEffect(() => {
        const time = setInterval(() => {
            setError(null)
          
        }, 4000);
        return ()=>clearTimeout(time)
        },[])// it's for the message it pops up and leaves in 4 secounds
  return (
    <div className='all'>
        
        
       <div className='firstBackGround'></div>
        <div className='secoundBackGround'>
            <div className='upperRegister'>
            <h2 className='binYalaText'>بن يعله</h2>
            <Link to={"/signUp"}>
            <button className='binYalaBtn'>Sign up</button>
            </Link>
            
        </div>
        </div>
        <form onSubmit={ForgotPassword} className=''>
        <div className='allSignUp'>
            <div className='upperText'>
                <div className='iconRegister'>
                    <FontAwesomeIcon icon={faLock}/>
                </div>
                
                <span className='signUpText'>Trouble logging in?</span>
                
                <span className='paraRegister'>Enter your email and we'll send you a link to get back into your account.
                </span>
            </div>
            <div className='firstInputs'>
                <div className='inputs'>
                <input className='inputRegister' placeholder={`✉ Enter email`} type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                
                <div className='SignUpBtn'>
                    <button className='signUpRegisterBtn'>Submit</button>
                </div>
                <div className='gotAnAccountDiv'>
                    
                        <Link className='forgotPassword' to={'/forgotPassword'}>
                        <span className='linkLogin'>Forgot password?</span>
                        </Link>
                        
                        
                        
                        
                </div>
                <div className='error'>
                <span className='errorText'>{error&&error}</span>

                </div>
            </div>
        
        

       </div>
       </form>
    </div>
  )
}

export default SignUp
