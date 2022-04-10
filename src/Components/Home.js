import React, { useState } from 'react'
import {getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import GridElement from './GridElement'
const Home = () => {
  const [uid, setUid] = useState("")
  const auth = getAuth()
  let navigate = useNavigate()
  onAuthStateChanged(auth, (user) =>{
    if (user){
      setUid(user.uid)
    }
    else{
      navigate('/login')
    }

  })
  const signOut = () =>{
    auth.signOut()
  }
  return (
    <div>
        <div className='signOut'>
          <button className='btn' onClick={signOut}>Sign out</button>
        </div>
        <div className='add-item-wrapper'>

          <div className='add-item blue-border'>
            <div>Add Item</div>
            <form>
              <input className='btn' type="text" id='item-name' placeholder='Name' />
              <br />
              <input className='btn' type="password" placeholder='Password' />
              <br /><br />
              <div className='submit-wrapper'>
              <input type="submit" value="Add" className='btn' />
              </div>
            </form>
          </div>
        </div>
        <div className="grid-wrapper">
          <GridElement />
          <GridElement />
          <GridElement />
          <GridElement />
        </div>
    </div>
  )
}

export default Home