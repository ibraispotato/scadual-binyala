import React, { useEffect, useState, useRef } from 'react'
import {Auth} from "../hooks/loginHook"
import "./admin.css"
import "../mobileDesign/mobileDesginScadual/mobileDesginScadual.css"
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import moment from 'moment-timezone';
import { useCalendarApp, ScheduleXCalendar  } from '@schedule-x/react'
import {
  createViewDay,
  createViewWeek,
  createViewMonthAgenda,
  createViewMonthGrid,
  createCalendar
  
} from '@schedule-x/calendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faX } from '@fortawesome/free-solid-svg-icons'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import '@schedule-x/theme-default/dist/index.css'
import {Link} from "react-router-dom"
import {useLOgOut} from "../hooks/logouthook"
const HomeAdmin = () => {
const {user} = Auth() 
const [selectTime,setSelectTime] = useState('')
const [getAlluser,setGetallUser] = useState(null)
const [firstTime,setFirstTime] = useState('')
const [descriptions,setDescription] = useState('')
const [value, setValue] = useState(moment().utc()); 
const [time,setTime] = useState('')
const [message,SetMessage] = useState(null)
const containerRef = useRef(null);
const [addUsers,setAddUsers] = useState([])
const [getMyAccount,setgetMyAccount] = useState([])
const [btnBurgur,setBtnBurgur] = useState(false)
const {logout} = useLOgOut()
value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm:ss')
useEffect(() => {
  if(selectTime==="Morning"){
    return setFirstTime(value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm').split(' ')[0] + ' 08:00')
  }else if(selectTime==="Afternoon"){
    return setFirstTime(value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm').split(' ')[0] + ' 14:30')
  }else if(selectTime==="Off"){
    return setFirstTime(value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm').split(' ')[0] + ' 00:00')
  }else if(selectTime==="VAC"){
    return setFirstTime(value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm').split(' ')[0] + ' 00:00')
  }
  else if(selectTime==="BREAKE"){
    return setFirstTime(value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm').split(' ')[0] + ` ${time.end.split(' ')[1].split('').splice(0,5).join("")}`)
  }
  else if(selectTime==="AFTERBREAKE"){
    return setFirstTime(value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm').split(' ')[0] + ` ${time.end.split(' ')[1].split('').splice(0,5).join("")}`)
  }
  },[value,selectTime]) // theres an if condition if it a morning value the time will be at 8 AM and so on
  useEffect(() => {
    if(selectTime==="Morning"){
      return setDescription(selectTime)
    }else if(selectTime==="Afternoon"){
      return setDescription(selectTime)
    }else if(selectTime==="Off"){
      return setDescription(selectTime)
    }else if(selectTime==="VAC"){
      return setDescription(selectTime)
    }else if(selectTime==="BREAKE"){
      return setDescription(selectTime)
    }
    else if(selectTime==="AFTERBREAKE"){
      return setDescription(selectTime)
    }
    },[value,selectTime])
const getAllUsers = async () => {
  const response = await fetch(`${process.env.REACT_APP_APi_LINK}/binYala/users/getAllUsers`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const json = await response.json()

  if(response.ok){
    setGetallUser(json)
  }
} // to get all the users information
useEffect(() => {
  if (containerRef.current) {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }
}, [getAlluser]);
useEffect(() => {
  getAllUsers()
},[]) //render the getAllUsers function
const add = (e) => {
  setAddUsers(prev => {
    const updatedUsers = [
      ...prev,
      {
        id: e._id,
        title: 1,
        start: firstTime,
        end: value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm'),
        people: [`${e.FirstName} ${e.LastName}`],
        description: descriptions
      }
    ];
    console.log(updatedUsers);
    return updatedUsers;
  });

}// the Calendar needs an specific id user, title, firstTime, endTime so i made a array of an object that adds these informations
const remove = (e) => {
  setAddUsers(prev => prev.filter((w) => w.id!==e._id))
} // to delete an array of the ond of the calendar
// console.log(value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm:ss'))
const [calendar, setCalendar] = useState(() => createCalendar({
  views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
  events: addUsers,
  selectedDate: value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm'),
  plugins: [createDragAndDropPlugin(), createResizePlugin(), createEventModalPlugin()]
}));/// the calendar got it from outside compontent and to work it needs specific inforamtions
useEffect(() => {
  setCalendar(createCalendar({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: addUsers,
    selectedDate: value.tz('Asia/Riyadh').format('YYYY-MM-DD HH:mm'),
    plugins: [createDragAndDropPlugin(), createResizePlugin(), createEventModalPlugin()]
  }));
}, [addUsers]);
useEffect(() => {
  const time = setInterval(() => {
    SetMessage(null)
    
  }, 4000);
  return ()=>clearTimeout(time)
  },[])// it's for the message it pops up and leaves in 4 secounds

const postADate = async (e) => {
  e.preventDefault()
  const response = await fetch(`${process.env.REACT_APP_APi_LINK}/binYala/Scadual/sendWeeksAndDays`,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addUsers)
  })
  const json = await response.json()
  if(!response.json){
    console.log(json)
  }
  if(response.json){
    SetMessage('Scadual have been saved')
    setAddUsers([])
    setTime(json[0])
  }
} // this function adds an the dates and time on the database
const GetMyUser = async () => {
  const response = await fetch(`${process.env.REACT_APP_APi_LINK}/binYala/users/getOneUser`,{
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
    <div className='allAdmin'>
     
      <div className={btnBurgur?'BarsDiv Disable':"BarsDiv"}>
        <p onClick={() => setBtnBurgur(prev => !prev)} className='Bars'><FontAwesomeIcon icon={faBars}/></p>
      </div>
      
      <div className={btnBurgur?'leftAdmin Active':"leftAdmin Disable"}>
      
    
        <div>
      <div>
        <img className='imgAdmin' src={user.profilePic}/>
      </div>

      <div>
      <p className='nameAdmin'>Welcome {getMyAccount.FirstName} {getMyAccount.LastName}</p>

      </div>
      </div>

      <div className='divBtnAdmin'>
        <Link to={'/MyScadual'}>
        <button className='btnAdmin'>Schedule</button>
        </Link>
        
        <Link to={'/AdminScadual'}>
        <button className='btnAdmin'>All Schedule</button>
        </Link>
        <Link to={'/settings'}>
        <button className='btnAdmin'>Settings</button>
        </Link>
        <Link to={'/scadualSettings'}>
        <button className='btnAdmin'>Schedule Settings</button>
        </Link>
        <button onClick={logoutFunction} className='btnAdmin'>LogOut</button>
      </div>
      </div>
      <div className='borderAdmin'></div>

      <div onMouseOver={() => (setBtnBurgur(false))} className='rightAdmin mini'>
        <div>
        <div>
        <LocalizationProvider dateAdapter={AdapterMoment}>
      <DemoContainer 
        components={[
          'StaticDateTimePicker',
        ]}
      >
          <DemoItem>
                <StaticDateTimePicker className='timeAdmin'
                  onChange={(newValue) => setValue(moment(newValue).utc())} // Ensure value is in UTC
                  value={value}
                  style={{fontSize:'1.5rem'}}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className='timeDiv'>
          {/* <label>Choose a time</label> */}
          <select className={`selectOption ${selectTime}`} onChange={(e) => setSelectTime(e.target.value)}>
          <option value={""}>Choose an option:</option>
            <option className='Morning' value={"Morning"}>Morning</option>
            <option className='Afternoon' value={'Afternoon'}>Afternoon</option>
            <option className='Off' value={'Off'}>Off</option>
            <option className='VAC' value={"VAC"}>VAC</option>
            <option className='BREAKE' value={"BREAKE"}>BREAKE</option>
            <option className='AFTERBREAKE' value={"AFTERBREAKE"}>AFTERBREAKE</option>
          </select>
        </div>

        <form onSubmit={postADate}>
          <button disabled={addUsers.length===0&&firstTime===""} className={addUsers.length===0||firstTime===""?'saveBtnAdmin disableAdmin':"saveBtnAdmin"}>Save</button>
        </form>

        </div>
        <div ref={containerRef} className='usersAdmin'>
        {getAlluser?.map((res) => (
          <div className='insideUsersAdmin'>
            <div className='imgAndNameUsersAdmin'>
            <div>
            <img className='profileUsersAdmin' src={res.profilePic}/>
            </div>
            <div>
              <span className='nameOfPeopleAdmin'>{res.FirstName} {res.LastName}</span> 
              {/* <span></span>  */}
            </div>
            </div>
            <div>
              {addUsers.map((re) => re.id).includes(res._id)?
              <button onClick={() => remove(res)} className='addUsersAdmin'>Remove</button>:
              <button onClick={() => add(res)} className='addUsersAdmin'>Add</button>
              }
              
            </div>
            </div>
          
        ))}
        </div>

      </div>
      <div className={'AdminCalendar'}>
      <ScheduleXCalendar key={addUsers} calendarApp={calendar} />
      </div>
      {message&&<div className={'message mini'}>
        <p className={'messageText'}>{message}</p>
      </div>}
      
    </div>
  )
}

export default HomeAdmin
