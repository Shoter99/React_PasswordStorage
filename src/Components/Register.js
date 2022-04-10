import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import {useNavigate} from 'react-router-dom'
const Register = () => {
  const [password, setPassword] = useState("")
  const [repassword, setRepassword] = useState("")
  const [email, setEmail] = useState("")
  const auth = getAuth()
  let navigate = useNavigate()
  const handleInputChange = (event, setter) =>{
    setter(event.target.value)

  }
  const handleSubmit = (event) =>{
    event.preventDefault()
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) =>{
        const user=userCredentials.user
        navigate('/login')
      })
      .catch((error) =>{
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
        alert(errorMessage)
      })
    

    
  }
  return (
    <div className='login-wrapper'>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input required type="email" id='email' name='email' value={email} onChange={(event) =>  handleInputChange(event, setEmail)} />
                <br></br>
                <label htmlFor="password">Password:</label>
                <input required type="password" name="password" id="password" value={password} onChange={(event) => handleInputChange(event, setPassword)} />
                <br></br>
                <label htmlFor="repassword">Repeat Password:</label>
                <input required type="password" name="repassword" id="repassword" value={repassword} onChange={(event) => handleInputChange(event, setRepassword)} />
                <br></br>
                <input  type="submit" value="Register"  disabled={password === repassword && password !== "" ? false : true}/>
            </form>
    </div>
  )

}

export default Register