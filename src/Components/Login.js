
import React, { useState } from 'react'

const Login = () => {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const handleInputChange = (event, setter) =>{
    setter(event.target.value)
  }
  const handleSubmit = (event, setter) =>{
    event.preventDefault()
    console.log(login, password)
  }
  return (
    <div className='login-wrapper'>
            <form onSubmit={handleSubmit}>
                <label htmlFor="login">Login:</label>
                <input type="text" name='login' value={login} onChange={(event) =>  handleInputChange(event, setLogin)} />
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