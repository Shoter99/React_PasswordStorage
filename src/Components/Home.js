import React, { useEffect, useState } from 'react'
import {getAuth, onAuthStateChanged } from 'firebase/auth'
import db from '../index'
import { useNavigate } from 'react-router-dom'
import GridElement from './GridElement'
import { onSnapshot, collection, doc, setDoc, addDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
const Home = () => {
  var CryptoJS = require("crypto-js")
  const salt = '3521853281'
  const [uid, setUid] = useState("")
  const [name, setName] = useState("")
  const [login, setLogin] = useState("")
  const [pass, setPass] = useState("")
  const [data, setData]= useState([])
  const [pin, setPin] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const auth = getAuth()
  let navigate = useNavigate()

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible)
  }


  const generatePassword = () =>{
    //generate password
    var pass = CryptoJS.lib.WordArray.random(10).toString()
    setPass(pass)
    setPasswordVisible(true)
  }


  const encrypt = (text) =>{
    return CryptoJS.DES.encrypt(text, salt).toString()
  }
  
  
  const decrypt = (text) =>{
    return CryptoJS.DES.decrypt(text, salt).toString(CryptoJS.enc.Utf8)
  }
  
  
  const handleInputChange = (event, setter) =>{
    setter(event.target.value)
  }

  //checking if pin exists in database, if not setting up new pin
  const handle_pin = async() =>{
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.data().pin){
       setPin(decrypt(docSnap.data().pin))
       return true
    }
    set_new_pin()
    return false
  }
  
  //setting up new pin
  const set_new_pin = async() =>{
    const docRef = doc(db, 'users', uid)
    var new_pin = window.prompt('Set new PIN: ')
    var data = {pin: encrypt(new_pin)}
    await setDoc(docRef, data)
    setPin(new_pin)

  }
  
  //checking if entered pi is correct
  const check_pin = () => {
    if (pin == '') { 
      handle_pin()
      return false
    }
    var new_pin = window.prompt('Enter PIN: ')
    if (new_pin == pin && new_pin != "") return true

    return false
  }
  
  //checking if user is logged in
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
      login: login,
      password: encrypt(pass)
    }
    await addDoc(collection(db, "users", uid, 'passwords'), newItem)
    setName("")
    setPass("")
    setLogin("")
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
    var editLogin = window.prompt("Enter new name", data.login)

    var editPass = window.prompt("Enter new password", decrypt(data.password))

    if(editName && editLogin && editPass){
      const newData = {name: editName, login: editLogin, password: encrypt(editPass)}
      await setDoc(doc(db, "users", uid, 'passwords', data.id), newData)
    }
    else{
      return
    }
  }
  //fetching data from database if user is logged in
  useEffect(() =>{
    if( uid !== ""){
      onSnapshot(collection(db, 'users', uid, 'passwords'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
        setData(data)

      }
    );
    handle_pin()
  }
  }, [uid])
  
  
  return (
    <div>
        <div className='signOut'>
          <button className='btn' onClick={signOut}>Log out</button>
        </div>
        <div className='add-item-wrapper'>

          <div className='add-item blue-border relative'>
            <div>Add Item</div>
            <form  onSubmit={(event) => addNewItem(event)}>
              <input required className='btn' id="add-item-name" type="text" placeholder='Name' value={name} onChange={(event) => handleInputChange(event, setName)}/>
              <br /><br />
              <input required className='btn' id="add-item-login" type="text" placeholder='Login' value={login} onChange={(event) => handleInputChange(event, setLogin)}/>
              <br /><br />
              <div className='relative'>
              <input required className='btn' type={passwordVisible ? 'text' :"password"} id='add-item-pass' placeholder='Password' value={pass} onChange={(event) => handleInputChange(event, setPass) }/> 
              <button type="button" className='absolute right-3 top-2.5 cursor-pointer' onClick={togglePassword} id="togglePassword">{passwordVisible ? 
                <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}</button>

              </div>
              <div className='text-right px-3 my-2 text-teal-300'>
                <button type='button' onClick={generatePassword}>Generate password</button>
              </div>
              <div className='submit-wrapper'>
              <input type="submit" value="Add" className='btn' />
              </div>
            </form>
          </div>
        </div>
        {/* creating grid of items fetched from db */}
        <div className="grid-wrapper">
          {data.map((item, index) => <GridElement key={index} data={item} deleteItem={deleteItem} check_pin={check_pin} editItem={editItem} decrypt={decrypt}/>)}
        </div>
    </div>
  )
}

export default Home