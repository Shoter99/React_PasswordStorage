
import React from 'react'

const Login = () => {
  return (
    <div className='login-wrapper'>
            <form>
                <label htmlFor="login">Login:</label>
                <input type="text" name='login' />
                <br></br>
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" />
                <br></br>
                <input type="submit" value="Log in" />
            </form>
    </div>
  )
}

export default Login