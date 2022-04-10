import React from 'react'
import { useNavigate } from 'react-router-dom'
const NavigationBtn = ({path, name}) => {
    let navigate = useNavigate()
    return (
        <button className='navBtn' onClick={() => navigate(`${path}`)}>{name}</button>
    )
}

export default NavigationBtn