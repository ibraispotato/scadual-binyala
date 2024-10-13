import React, { useEffect, useState, useRef } from 'react'
import {Auth} from "../hooks/loginHook"
import {Link,Navigate} from "react-router-dom"
import {useNavigate}from "react-router-dom"

import "./settings.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import {useLOgOut} from "../hooks/logouthook"
import "../mobileDesign/mobileDesginScadual/mobileDesginScadual.css"
import { faBars,faX } from '@fortawesome/free-solid-svg-icons'
const AdminScadual = () => {
const {user} = Auth() 
const [emailTrue,setEmailTrue] = useState(true)
const [passwordTrue,setPasswordTrue] = useState(true)
const [nameTrue,setnameTrue] = useState(true)
const [userNameTrue,setUserNameTrue] = useState(true)
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [FirstName,setFirstName] = useState('')
const [LastName,setLastName] = useState('')
const [getMyAccount,setgetMyAccount] = useState([])
const [usersplitFirst,setUserSplitFirst] = useState([]) 
const [usersplitFirst2,setUserSplitFirst2] = useState([])
const [error,setError] = useState(null)
const userSplit2 = usersplitFirst.slice(1,usersplitFirst.length - 1)
const modifiedUserSplit2 = usersplitFirst.map(o => userSplit2.some(v => v === o)?"*":o).join('')
const [btnBurgur,setBtnBurgur] = useState(false)

const nav = useNavigate()
const {logout} = useLOgOut()

const settingsFunction = async (e) => {
  e.preventDefault()
  const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/users/editUserDetails`,{
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body:JSON.stringify({email,password,FirstName,LastName})
  })
  const json = await response.json()
  if(!response.ok){
    setError(json)
  }
  if(response.ok) {
        nav('/')
        setError(null)
  }
  
}//this function for edit ur account information
const GetMyUser = async () => {
  const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/users/getOneUser`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`

    }
  })
  const json = await response.json()

  if(response.ok){
    setgetMyAccount(json)
    setUserSplitFirst(json.email.split('@')[0].split(""))
    setUserSplitFirst2(json.email.split('@')[1])
  }
}// to get the user information that logged in
useEffect(() => {
  GetMyUser()
},[user])
const logoutFunction = () => {
  logout()
}// logout function
  return (
    <div className='allAdmin'>
     <div className={btnBurgur?'BarsDiv MyScadual':"BarsDiv MyScadual"}>
        <p onClick={() => setBtnBurgur(prev => !prev)} className='Bars MyScadual settingsAccount'><FontAwesomeIcon icon={faBars}/></p>
      </div>
      <div className={btnBurgur?'leftAdmin Active':"leftAdmin Disable"}>

        <div>
      <div>
      <img className='imgAdmin' src={user.profilePic}/>
      </div>

      <div>
      <p>Welcome mr {getMyAccount.FirstName} {getMyAccount.LastName}</p>
      </div>
      </div>

      <div className='divBtnAdmin'>
        
        {getMyAccount.admin?
        <Link to={'/AdminScadual'}>
        <button className='btnAdmin'>All Schedule</button>
        </Link>:
        ""
      }
        {getMyAccount.admin? 
        <Link to={'/'}>
        <button className='btnAdmin'>Schedule management</button>
        </Link>
        :
        ""
        }
        <Link to={'/settings'}>
        <button className='btnAdmin'>Settings</button>
        </Link>
        {getMyAccount.admin? 
        <Link to={'/scadualSettings'}>
        <button className='btnAdmin'>Schedule Settings</button>
        </Link>
        :
        ""
        }
        <button onClick={logoutFunction} className='btnAdmin'>LogOut</button>
        
       
      </div>
      </div>
      <div className='borderAdmin'></div>
        
      <div onMouseOver={() => (setBtnBurgur(false))} className='rightAdmin Calendar settings'>
        <div className='Settings'>
        <div className='AccountSettings'>
            <span className='topTextSettings'>Account Settings</span>
            <span className='paraTextSettings'>Manage your account's details</span>
            </div>
            <div className='accountInformation'>
                <p className='accountInfoSettings'>Account Information</p>
            </div>
            <div className='emailAndPasswordSettings'>
                <div className='inputAndText'>
                    <span>Email</span>
                    <div className='a'>
                        <input onChange={(e) => setEmail(e.target.value)}
                         disabled={emailTrue}
                          className={emailTrue?"inputSettings active":'inputSettings'} type='email' 
                          // FirstName===""?nameTrue?user.FirstName:FirstName:FirstName
                        value={email===""?emailTrue?`${modifiedUserSplit2}@${usersplitFirst2}`:email:email} name='email'/>
                        <button onClick={() => setEmailTrue((prev) => !prev)} className='btnActiveInputSettings'><FontAwesomeIcon icon={faPenToSquare}/></button>
                    </div>
                
                </div>
                <div className='inputAndText'> 
                    <span>Password</span>
                    <div className='a'>
                        <input onChange={(e) => setPassword(e.target.value)} 
                        disabled={passwordTrue} className={'inputSettings'} type='password' value={password===""?passwordTrue?user.pas:password:password}/>
                        <button onClick={() => setPasswordTrue((prev) => !prev)} className='btnActiveInputSettings'><FontAwesomeIcon icon={faPenToSquare}/></button>
                    </div>
                    

                </div>
            </div>
            <div className='accountInformation'>
                <p className='accountInfoSettings'>Personal Details</p>
            </div>
            <div className='emailAndPasswordSettings Names'>
                <div className='inputAndText'>
                    <span>First Name</span>
                    <div className='a'>
                    <input onChange={(e) => setFirstName(e.target.value)} disabled={nameTrue} name='password' 
                    className={'inputSettings'} type='text' value={FirstName===""?nameTrue?getMyAccount.FirstName:FirstName:FirstName}/>
                        <button onClick={() => setnameTrue((prev) => !prev)} className='btnActiveInputSettings'><FontAwesomeIcon icon={faPenToSquare}/></button>
                    </div>
                
                </div>
                <div className='inputAndText'>
                    <span>Last Name</span>
                    <div className='a'>
                    <input onChange={(e) => setLastName(e.target.value)} disabled={userNameTrue} 
                    className={'inputSettings'} type='text' value={LastName===""?userNameTrue?getMyAccount.LastName:LastName:LastName}/>
                        <button onClick={() => setUserNameTrue((prev) => !prev)} className='btnActiveInputSettings'><FontAwesomeIcon icon={faPenToSquare}/></button>
                    </div>
                
                </div>
            </div>
            <div className='btnSettings'>
            <form onSubmit={settingsFunction}>
              <button disabled={email===""&&password===""&&FirstName===""&&LastName===""}
              className={email===""&&password===""&&FirstName===""&&LastName===""?'saveChangesSettings disable':'saveChangesSettings'}>Save Changes</button>
            </form>
            <h2>{error===null?"":error.message}</h2>
            {/* <h2>s</h2> */}

            </div>
            
        </div>
            
      </div>
      
      
      
    </div>
  )
}

export default AdminScadual
