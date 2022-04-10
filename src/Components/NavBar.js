import React from 'react'
import NavigationBtn from './NavigationBtn'

const NavBar = () => {
  return (
    <nav className='navbar'>
        <div>Password Storage</div>
        <div>
            <NavigationBtn path='/' name='Home' />
            <NavigationBtn path='/about' name='About' />
            <NavigationBtn path='/login' name='Login' />
            <NavigationBtn path='/register' name='Register' />
        </div>
    </nav>
  )
}



export default NavBar