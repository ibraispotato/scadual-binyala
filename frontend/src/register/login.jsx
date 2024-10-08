import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye,faEyeSlash,faUser } from '@fortawesome/free-solid-svg-icons'
import {Auth} from "../hooks/loginHook"
import "./register.css"
import { Link } from 'react-router-dom'
const SignUp = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [eye,setEye] = useState(false)
    const [error,setError] = useState(null)
    const {dispatch,user} = Auth()
    const Login = async (e) => {
        e.preventDefault()
        const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/users/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password})
        })
        const json = await response.json()

        if(!response.ok){
            console.log(json)
            setError(json.message)
        }
        if(response.ok){
            setError(null)
            localStorage.setItem("user", JSON.stringify(json))
            dispatch({type:'LOGIN',payload:json})
        }
    }//this function takes ur email and password and logging into your account
    setInterval(() => {
        setError(null)
      }, 4000);// it's for the message it pops up and leaves in 4 secounds
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
        <form onSubmit={Login} className=''>
        <div className='allSignUp'>
            <div className='upperText'>
                <div className='iconRegister'>
                    <FontAwesomeIcon icon={faUser}/>
                </div>
                
                <span className='signUpText'>Login to Your Account</span>
                
                <span className='paraRegister'>Hello, Please enter your details to get log up to your account</span>
            </div>
            <div className='firstInputs'>
                <div className='inputs'>
                <input className='inputRegister' placeholder={`✉ Enter email`} type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input className='inputRegister' placeholder='🔓︎ Password' type={!eye?"password":"text"} name='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                {eye?
                        <FontAwesomeIcon icon={faEye} className='eye' onClick={() =>(setEye((prev) => !prev))}/>
                        :
                        <FontAwesomeIcon icon={faEyeSlash} className='eyeSlash' onClick={() =>(setEye((prev) => !prev))}/>
                }
                </div>
                
                <div className='SignUpBtn'>
                    <button className='signUpRegisterBtn'>Login</button>
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
