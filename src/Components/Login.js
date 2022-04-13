
import React, { useEffect, useState } from 'react'
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const [email, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const auth = getAuth()
  let navigate = useNavigate()
  const handleInputChange = (event, setter) =>{
    setter(event.target.value)
  }
  const handleSubmit = (event, setter) =>{
    event.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) =>{
        navigate('/')
      })
      .catch((error) =>{
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
        alert(errorMessage)
      })
      
  }
  useEffect(() =>{
    onAuthStateChanged(auth, (user) =>{
      if (user){
        navigate('/')
      }
    }, )}, [])
  return (
    <div className='login-wrapper'>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="text" name='email' value={email} onChange={(event) =>  handleInputChange(event, setLogin)} />
                <br></br>
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" value={password} onChange={(event) => handleInputChange(event, setPassword)} />
                <br></br>
                <input type="submit" value="Log in" />
            </form>
    </div>
  )
}

export default Login