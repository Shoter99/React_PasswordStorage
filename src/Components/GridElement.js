import React, { useState } from 'react'

const GridElement = ({data, deleteItem, editItem, decrypt}) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [copied, setCopied] = useState(true)
  const togglePassword = () => setPasswordVisible(!passwordVisible)

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
      <div className="name">{data.name}</div>
        <br />
        <div className="copypass">
            <button onClick={copyToClipboard}>{copied ? 'Copy Password' : 'Copied'}</button>
        </div>
        <br />
        <div className="show-details">
            <button onClick={togglePassword}>Show Details</button>
        </div>
        <div className="data-password" style={{display: passwordVisible ? 'block' : 'none'}}>{decrypt(data.password)}</div>

    </div>
  )
}

export default GridElement