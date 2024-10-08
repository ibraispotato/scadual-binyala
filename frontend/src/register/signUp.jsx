import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye,faEyeSlash,faUser,faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import {Auth} from "../hooks/loginHook"
import "./register.css"
import '../mobileDesign/mobileDesignRegister/mobileDesign.css'
import { Link } from 'react-router-dom'

const SignUp = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [LastName,setLastName] = useState('')
    const [FirstName,setFirstName] = useState('')
    const [next,setNext] = useState(false)
    const [eye,setEye] = useState(false)
    const [error,setError] = useState(null)
    console.log(error)
    const {dispatch} = Auth()
    // console.log(process.env.REACT_APP_APi_LINK)
    // console.log('https://scadual-binyala-backend.vercel.app')
    const signUp = async (e) => {
        e.preventDefault()
        const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/users/signup`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password,LastName,FirstName})
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
    }//this function create ur new account on the database
    setInterval(() => {
        setError(null)
      }, 4000); // it's for the message it pops up and leaves in 4 secounds
  return (
    <div className='all'>
        
        
       <div className='firstBackGround'></div>
        <div className='secoundBackGround'>
            <div className='upperRegister'>
            <h2 className='binYalaText'>{next?<FontAwesomeIcon onClick={() => setNext(false)} className='arrowLeftRegister' icon={faArrowLeft}/> :"بن يعله"}</h2>
            <Link to={"/login"}>
            <button className='binYalaBtn'>Log in</button>
            </Link>
            
        </div>
        </div>
        <form onSubmit={signUp} className=''>
        <div className='allSignUp'>
            <div className='upperText'>
                <div className='iconRegister'>
                    <FontAwesomeIcon icon={faUser}/>
                </div>
                
                <span className='signUpText'>Create a new Account</span>
                
                <span className='paraRegister'>Hello, Please enter your details to get sign up to your account</span>
            </div>
            {!next?
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
                    <button className='signUpRegisterBtn' onClick={() => setNext(email===""||password===""?false:true)}>Register</button>
                </div>
                <div className='gotAnAccountDiv'>
                    <p>Already have an account? 
                        <Link to={'/login'}>
                        <span className='linkLogin'>Log in</span>
                        </Link>
                        
                        
                        </p>
                </div>
                <div className='error'>
                <span className='errorText'>{error&&error}</span>

                </div>
            </div>
            :
            <div className='firstInputs'>
            <div className='inputs'>
                <input disabled={true} className='inputRegister oldInputs' placeholder='Enter email' type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input disabled={true} className='inputRegister oldInputs' placeholder='Password' type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div className='inputs'>
                <input className='inputRegister' placeholder='First name' type='text' name='name' value={FirstName} onChange={(e) => setFirstName(e.target.value)}/>
                <input className='inputRegister' placeholder='Last Name' type='text' name='userName' value={LastName} onChange={(e) => setLastName(e.target.value)}/>
                </div>
                
                <div className='SignUpBtn'>
                    <button className='signUpRegisterBtn'>Sign Up</button>
                </div>
                <div className='gotAnAccountDiv'>
                    <p>Already have an account? 
                        <Link to={'/login'}>
                        <span className='linkLogin'>Log in</span>
                        </Link>
                        
                        
                        </p>
                </div>
                <div className='error'>
                    <span className='errorText'>{error&&error}</span>
                </div>
            </div>
}
        

       </div>
       </form>
    </div>
  )
}

export default SignUp
