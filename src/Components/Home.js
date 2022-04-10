import React, { useState } from 'react'
import {getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
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
  return (
    <div>
        {uid}
    </div>
  )
}

export default Home