import React, { useState } from 'react'

const GridElement = ({data, deleteItem, editItem, decrypt, check_pin}) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [showErrorMessage, setErrorMessage] = useState(false)
  const [copied, setCopied] = useState(true)
  const togglePassword = () => {
    if (passwordVisible) { 
      setPasswordVisible(false)
      return
    }
    if(check_pin()) {
      setPasswordVisible(!passwordVisible)
    }
    else {
      setErrorMessage(true)
      setTimeout(() => {
        setErrorMessage(false)
      }, 2000)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decrypt(data.password))
    setCopied(false)
    setTimeout(() => setCopied(true), 2000)
  }

  return (
    <div className='grid-element blue-border'>
      <div className='options-wrapper'>
      <div className="edit">
        <button onClick={() => editItem(data)}>Edit</button></div>
      <div className="delete">
        <button onClick={() => deleteItem(data.id)}>X</button></div>
      </div>
      <div className="name">{(data.name).slice(0,17)}</div>
        <br />
        <div className="copypass">
            <button onClick={copyToClipboard}>{copied ? 'Copy Password' : 'Copied'}</button>
        </div>
        <br />
        <div className="show-details">
            <button onClick={togglePassword}>{!passwordVisible ? 'Show Details' : 'Hide Details'}</button>
        </div>
        <div className="data-password" style={{display: passwordVisible ? 'block' : 'none'}}>{data.login}</div>
        <div className="data-password" style={{display: passwordVisible ? 'block' : 'none'}}>{decrypt(data.password)}</div>
        {showErrorMessage && <div className="text-red-600">Wrong PIN</div>}
    </div>
  )
}

export default GridElement