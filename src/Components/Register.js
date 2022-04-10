import React, { useState } from 'react'

const Register = () => {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [repassword, setRepassword] = useState("")
  const [email, setEmail] = useState("")

  const handleInputChange = (event, setter) =>{
    setter(event.target.value)
  }
  const handleSubmit = (event, setter) =>{
    event.preventDefault()
    console.log(login, email, password)
  }
  return (
    <div className='login-wrapper'>
            <form onSubmit={handleSubmit}>
                <label htmlFor="login">Login:</label>
                <input required type="text" id='login' name='login' value={login} onChange={(event) =>  handleInputChange(event, setLogin)} />
                <br></br>
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