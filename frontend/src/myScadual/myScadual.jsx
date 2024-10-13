import React, { useEffect, useState, useRef } from 'react'
import {Auth} from "../hooks/loginHook"
import moment from 'moment-timezone';
import { useCalendarApp, ScheduleXCalendar  } from '@schedule-x/react'
import {
  createViewDay,
  createViewWeek,
  createViewMonthAgenda,
  createViewMonthGrid,
  createCalendar
  
} from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import '@schedule-x/theme-default/dist/index.css'
import {Link} from "react-router-dom"
import "../admin/adminScadual/AdminScadual.css"
import {useLOgOut} from "../hooks/logouthook"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faX } from '@fortawesome/free-solid-svg-icons'
import env from "react-dotenv";

const AdminScadual = () => {
const {user} = Auth() 
const [getAlluser,setGetallUser] = useState(null)
const [value, setValue] = useState(moment().utc()); 
const containerRef = useRef(null);
const [addUsers,setAddUsers] = useState([])
const [getMyAccount,setgetMyAccount] = useState([])
const [btnBurgur,setBtnBurgur] = useState(false)

const {logout} = useLOgOut()
value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm:ss')

const getAllUsers = async () => {
  const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/users/getAllUsers`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const json = await response.json()

  if(response.ok){
    setGetallUser(json)
  }
}// to get all the users information
useEffect(() => {
  if (containerRef.current) {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }
}, [getAlluser]);
useEffect(() => {
  getAllUsers()
},[])
const GetAllDays = async () => {
  const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/Scadual/getMyDays`,{
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
  })
  const json = await response.json()
  if(!response.json){
    console.log(json)
  }
  if(response.json){
    setAddUsers(json)
  }
}// to get the Dates Values
useEffect(() => {
    GetAllDays()
},[])
const [calendar, setCalendar] = useState(() => createCalendar({
  views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
  events: addUsers.map((res) => res.dayName).flat(),
  selectedDate: value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm'),
  plugins: [ createEventModalPlugin()]
}));/// the calendar got it from outside compontent and to work it needs specific inforamtions
useEffect(() => {
  setCalendar(createCalendar({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: addUsers.map((res) => res.dayName).flat(),
    selectedDate: value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm'),
    plugins: [createEventModalPlugin()]
  }));
}, [addUsers]);
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
  }
} // to get the user information that logged in
useEffect(() => {
  GetMyUser()
},[])
const logoutFunction = () => {
  logout()
}// logout function
  return (
    <div className='allAdmin adminScadual'>
      <div className={btnBurgur?'BarsDiv MyScadual':"BarsDiv MyScadual"}>
        <p onClick={() => setBtnBurgur(prev => !prev)} className='Bars MyScadual'><FontAwesomeIcon icon={faBars}/></p>
      </div>
      <div className={btnBurgur?'leftAdmin Active':"leftAdmin Disable"}>

        <div>
      <div>
        <img className='imgAdmin' src={user.profilePic}/>
      </div>

      <div>
        <p>Welcome {getMyAccount.FirstName} {getMyAccount.LastName}</p>
      </div>
      </div>

      <div className='divBtnAdmin'>
        
        {user.admin?
        <Link to={'/AdminScadual'}>
        <button className='btnAdmin'>All Schedule</button>
        </Link>:
        ""
      }
        {user.admin? 
        <Link to={'/'}>
        <button className='btnAdmin'>Schedule management</button>
        </Link>
        :
        ""
        }
        <Link to={'/settings'}>
        <button className='btnAdmin'>Settings</button>
        </Link>
        {user.admin? 
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

      <div  onMouseOver={() => (setBtnBurgur(false))} className='rightAdmin Calendar adminScadual'>
{/* <div> */}
      <ScheduleXCalendar className={'calendars'} key={addUsers} calendarApp={calendar} />
      {/* </div> */}
      </div>
      
     
      
    </div>
  )
}

export default AdminScadual
