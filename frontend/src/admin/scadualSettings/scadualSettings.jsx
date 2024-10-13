import React, { useEffect, useState } from 'react';
import { Auth } from "../../hooks/loginHook";
import { Link, useNavigate } from "react-router-dom";
import { useLOgOut } from "../../hooks/logouthook";
import "./scadualSettings.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faBars,faX } from '@fortawesome/free-solid-svg-icons'
const AdminScadual = () => {
    const { user } = Auth(); 
    const [getMyAccount, setGetMyAccount] = useState([]);
    const [getAllUsers, setGetAllUsers] = useState([]);
    const [addUsers, setAddUsers] = useState([]);
    const [firstDates, setFirstDates] = useState([]); // Array for input values
    const [firstDateTrue, setFirstDateTrue] = useState([]); // Array for edit states
    const [EndDates, setEndDates] = useState([]); // Array for input values
    const [EndDateTrue, setEndDateTrue] = useState([]); // Array for edit states
    const [ActiveScadualuser,setActiveScadualuser] = useState('');
    const [firstDateValue,setFirstDatesValue] = useState('');
    const [endDateValue,setEndDatesValue] = useState('');
    const [message,setMessage] = useState(null);
const [btnBurgur,setBtnBurgur] = useState(false)

    const { logout } = useLOgOut();

    const GetMyUser = async () => {
        const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/users/getOneUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();
        if (response.ok) {
            setGetMyAccount(json);
        }
    };// to get the user information that logged in

    useEffect(() => {
        GetMyUser();
    }, [user]);

    const getAllUsersFunction = async () => {
        const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/users/getAllUsers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();
        if (response.ok) {
            setGetAllUsers(json);
        }
    };// to get all the users information

    useEffect(() => {
        getAllUsersFunction();
    }, []);

    const GetAllDays = async (e) => {
        const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/Scadual/getMyDaysScadualSettings/${e}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        });
        const json = await response.json();
        if (response.ok) {
            setAddUsers(json);
            setFirstDates(json.flatMap(res => res.dayName.map(day => day.start || ''))); // Initialize with starts
            setFirstDateTrue(new Array(json.length).fill(true)); // Initialize edit states
        }
    }; // to get the Dates Values

    

   
    const handleInputChange = (index, value,RealValue) => {
        const newFirstDates = [...firstDates];
        newFirstDates[index] = value; // Update specific index
        setFirstDates(newFirstDates);
        setFirstDatesValue(RealValue);
    };// this function for edit the first Date
    const handleInputChangeEnd = (index, value,RealValue) => {
      const newEndDates = [...EndDates];
      newEndDates[index] = value; // Update specific index
      setEndDates(newEndDates);
      setEndDatesValue(RealValue)
  }; // this function for edit the end Date

  const toggleEdit = (index) => {
    const newFirstDateTrue = [...firstDateTrue];
    newFirstDateTrue[index] = !newFirstDateTrue[index]; // Toggle specific index
    setFirstDateTrue(newFirstDateTrue);
};// this function for disable first Date button
  const toggleEditEnd = (index) => {
      const newEndDateTrue = [...EndDateTrue];
      newEndDateTrue[index] = !newEndDateTrue[index]; // Toggle specific index
      setEndDateTrue(newEndDateTrue);
  };// this function for disable end Date button
    const getDayName = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = new Date(date).getDay();
        return days[dayIndex];
    };// this function for changing day value to days names
    const dayNames = addUsers.flatMap(res => res.dayName.map(day => getDayName(day.start)));
    const deleteDate = async (e,id,userId) => {
        e.preventDefault()
        const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/Scadual/deleteScadual/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await response.json()
        if(response.ok){
            
            GetAllDays(userId)
            setMessage('Delete Success')
        }
    } // this function for deleting the days 
    const UpdateValuefunction = async(e,id,index) => {
        e.preventDefault()
        const dayName = id.dayName[0]
        const updatedDate = [{
            description:dayName.description,
            end:endDateValue===""?dayName.end:endDateValue,
            id:dayName.id,
            people:dayName.people,
            start:firstDateValue===""?dayName.start:firstDateValue,
            title:dayName.title
        }]
        const response = await fetch(`${'https://scadual-binyala-backend.vercel.app'}/binYala/Scadual/updateDay/${id._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({updatedDate})
        });
        const json = await response.json()
        if(response.ok){
            console.log(json)
            setMessage(json.message)
            setFirstDates([])
            setEndDates("")
            setFirstDatesValue('')
            setEndDatesValue('')
            
            const newFirstDateTrue = [...firstDateTrue];
            newFirstDateTrue[index] = !newFirstDateTrue[index]; // Toggle specific index
            setFirstDateTrue(newFirstDateTrue);
            const newLasttDateTrue = [...EndDateTrue];
            newLasttDateTrue[index] = !newLasttDateTrue[index]; // Toggle specific index
            setEndDateTrue(newLasttDateTrue);
            
        }
        
    } // this function for Update the Dates
    useEffect(() => {
        const time = setInterval(() => {
            setMessage(null)
          
        }, 4000);
        return ()=>clearTimeout(time)
        },[])// it's for the message it pops up and leaves in 4 secounds
    return (
        <div className='allAdmin adminScadual'>
            <div className={btnBurgur?'BarsDiv MyScadual':"BarsDiv MyScadual"}>
        <p onClick={() => setBtnBurgur(prev => !prev)} className='Bars MyScadual scadualSettin'><FontAwesomeIcon icon={faBars}/></p>
      </div>
      <div className={btnBurgur?'leftAdmin Active':"leftAdmin Disable"}>

                <img className='imgAdmin' src={user.profilePic} alt="Profile" />
                <p>Welcome mr {getMyAccount.FirstName} {getMyAccount.LastName}</p>
                <div className='divBtnAdmin'>
                    {getMyAccount.admin && (
                        <>
                            <Link to={'/AdminScadual'}>
                                <button className='btnAdmin'>All Schedule</button>
                            </Link>
                            <Link to={'/'}>
                                <button className='btnAdmin'>Schedule management</button>
                            </Link>
                            <Link to={'/settings'}>
                                <button className='btnAdmin'>Settings</button>
                            </Link>
                            <Link to={'/scadualSettings'}>
                                <button className='btnAdmin'>Schedule Settings</button>
                            </Link>
                        </>
                    )}
                    <button onClick={logout} className='btnAdmin'>LogOut</button>
                </div>
            </div>
            <div className='borderAdmin'></div>
            <div onMouseOver={() => (setBtnBurgur(false))} className='rightAdmin Calendar settings scadual'>
                <div className='Settings scadual'>
                    <div className='usersAdmin scadualSettings'>
                        {getAllUsers?.map((res) => (
                            <div onClick={() => GetAllDays(res._id)} className={ActiveScadualuser.includes(res._id)?'insideUsersAdmin Active':'insideUsersAdmin'} key={res._id}>
                                <div onClick={() => setActiveScadualuser(res._id)} className={'imgAndNameUsersAdmin'}>
                                    <img className='profileUsersAdmin' src={res.profilePic} alt="User" />
                                    <span>{res.FirstName} {res.LastName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='rightAdmin Calendar settings scadual'>
                <div className='Settings scadual'>
                    <div className='usersAdmin scadualSettings'>
                        {addUsers.map((res) => res.dayName).flat().map((res, index) => (
                            <div className='MotherOfTheDay' key={index}>
                                <div className='NameOfTheDay'>
                                    <p>{dayNames[index]}</p>
                                </div>
                                <div className='AllDatesAndBtns'>
                                
                                <div className='Dates'>
                                
                                <div className='BeganOfTheDayByDate'>
                                    <p>The beginning of the day:</p>
                                    <div className='a'>
                                        <input
                                            onChange={(e) => handleInputChange(index, e.target.value, e.target.value)}
                                            disabled={firstDateTrue[index]}
                                            className={'inputSettings'}
                                            type='text'
                                            value={firstDates[index] || res.start}
                                        />
                                        <button onClick={() => toggleEdit(index)} className='btnActiveInputSettings'>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                    </div>
                                </div>
                                <div className='EndOfTheDayByDate'>
                                    <p>End of the day:</p>
                                    <div className='a'>
                                        <input
                                            onChange={(e) => handleInputChangeEnd(index, e.target.value, e.target.value)}
                                            disabled={!EndDateTrue[index]}
                                            className={'inputSettings'}
                                            type='text'
                                            value={EndDates[index] || res.end}
                                        />
                                        <button onClick={() => toggleEditEnd(index)} className='btnActiveInputSettings'>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                    </div>
                                </div>
                                </div>
                                <div className='BtnScadualSettings'>
                                    {console.log(firstDateTrue[index]&&!EndDateTrue[index]===false?true:false)}
                                    <form className='btnScadualSettings' onSubmit={(e) => UpdateValuefunction(e,addUsers.map((res) => res)[index],index)}>
                                        <button disabled={firstDateTrue[index]&&!EndDateTrue[index]} className={firstDateTrue[index]&&!EndDateTrue[index]?'saveChangesSettings ScadualSettings disableScadual':"saveChangesSettings ScadualSettings"}>Save</button>
                                        </form>
                                    <form className='btnScadualSettings' onSubmit={(e) => deleteDate(e,addUsers.map((res) => res._id)[index],ActiveScadualuser)}>
                                        <button className='saveChangesSettings ScadualSettings'>Delete</button>
                                        </form>
                                    
                                </div>
                            </div>
                            </div>
                        ))}
                        
                    </div>
                </div>
                    
            </div>
            {message&&<div className={'message mini scadualSett'}>
        <p className={'messageText scadualSett'}>{message}</p>
      </div>}
        </div>
    );
};

export default AdminScadual;

