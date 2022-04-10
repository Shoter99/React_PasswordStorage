import React, { useEffect, useState } from 'react'
import {getAuth, onAuthStateChanged } from 'firebase/auth'
import db from '../index'
import { useNavigate } from 'react-router-dom'
import GridElement from './GridElement'
import { onSnapshot, collection, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore'
const Home = () => {
  var CryptoJS = require("crypto-js")
  const salt = '3521853281'
  const [uid, setUid] = useState("")
  const [name, setName] = useState("")
  const [pass, setPass] = useState("")
  const [data, setData]= useState([])
  const auth = getAuth()
  let navigate = useNavigate()
  const encrypt = (text) =>{
    return CryptoJS.DES.encrypt(text, salt).toString()
  }
  const decrypt = (text) =>{
    return CryptoJS.DES.decrypt(text, salt).toString(CryptoJS.enc.Utf8)
  }
  const handleInputChange = (event, setter) =>{
    setter(event.target.value)
  }

  onAuthStateChanged(auth, (user) =>{
    if (user){
      setUid(user.uid)
    }
    else{
      navigate('/login')
    }

  })
  const signOut = () =>{
    auth.signOut()
  }
  const addNewItem = async(event) => {
    event.preventDefault()
    const newItem = {
      name: name,
      password: encrypt(pass)
    }
    await addDoc(collection(db, "users", uid, 'passwords'), newItem)
    setName("")
    setPass("")
  }
  const deleteItem = async(id) => {
    var conf = window.confirm("Are you sure you want to delete this item?")
    if(conf)
    {
      await deleteDoc(doc(db, "users", uid, 'passwords', id))
    }else{
      return
    }
  }
  const editItem = async(data) => {
    var editName = window.prompt("Enter new name", data.name)
    var editPass = window.prompt("Enter new password", decrypt(data.password))

    if(editName && editPass){
      const newData = {name: editName, password: encrypt(editPass)}
      await setDoc(doc(db, "users", uid, 'passwords', data.id), newData)
    }
    else{
      return
    }
  }
  useEffect(() =>{
    if( uid !== ""){
      onSnapshot(collection(db, 'users', uid, 'passwords'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
        setData(data)

      }
    );
  }
  }, [uid])
  return (
    <div>
        <div className='signOut'>
          <button className='btn' onClick={signOut}>Log out</button>
        </div>
        <div className='add-item-wrapper'>

          <div className='add-item blue-border'>
            <div>Add Item</div>
            <form onSubmit={(event) => addNewItem(event)}>
              <input required className='btn' id="add-item-name" type="text" placeholder='Name' value={name} onChange={(event) => handleInputChange(event, setName)}/>
              <br /><br />
              <input required className='btn' type="password" id='add-item-pass' placeholder='Password' value={pass} onChange={(event) => handleInputChange(event, setPass) }/>
              <br /><br />
              <div className='submit-wrapper'>
              <input type="submit" value="Add" className='btn' />
              </div>
            </form>
          </div>
        </div>
        <div className="grid-wrapper">
          {data.map((item, index) => <GridElement key={index} data={item} deleteItem={deleteItem} editItem={editItem} decrypt={decrypt}/>)}
        </div>
    </div>
  )
}

export default Home