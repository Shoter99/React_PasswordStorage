import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import db from "../index";
import { useNavigate } from "react-router-dom";
import GridElement from "./GridElement";
import {
  onSnapshot,
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faGear,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Notification, Switch, Tooltip } from "@mantine/core";
import { Check, X } from "tabler-icons-react";

const Home = () => {
  var CryptoJS = require("crypto-js");

  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [pin, setPin] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [settingsVisible, setSettingVisible] = useState(false);
  const [salt, setSalt] = useState("");
  const [tempSalt, setTempSalt] = useState("");
  const [pink, setPink] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showError, setShowError] = useState(false);
  const auth = getAuth();

  let navigate = useNavigate();

  const handleConfirm = (e) => {
    e.preventDefault();
    localStorage.setItem("salt", JSON.stringify(tempSalt));
    setSalt(tempSalt);
    setShowError(false);
    setShowConfirm(true);
    setTimeout(() => {
      setShowConfirm(false);
    }, 2000);
  };

  const handleColorChange = () => {
    setPink(!pink);
    localStorage.setItem("pink", JSON.stringify(!pink));
  };

  const changeColors = () => {
    var r = document.querySelector(":root");
    if (pink) {
      r.style.setProperty("--color-bg", "#ffe4fc");
      r.style.setProperty("--color-primary", "#fd9ef0");
      r.style.setProperty("--color-secondary", "#ff85c8");
      r.style.setProperty("--color-text", "#70284a");
    } else {
      r.style.setProperty("--color-bg", "#16161a");
      r.style.setProperty("--color-primary", "#272731");
      r.style.setProperty("--color-secondary", "#0f9e9e");
      r.style.setProperty("--color-text", "#ffffff");
    }
  };

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const generatePassword = () => {
    //generate password
    var pass = CryptoJS.lib.WordArray.random(10).toString();
    setPass(pass);
    setPasswordVisible(true);
  };
  const hash = (pin) => {
    var hash = CryptoJS.HmacSHA256(pin, "32817321");
    return hash.toString(CryptoJS.enc.Hex);
  };
  const encrypt = (text) => {
    return CryptoJS.DES.encrypt(text, salt).toString();
  };

  const decrypt = (text) => {
    try {
      return CryptoJS.DES.decrypt(text, salt).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.log(e);
    }
  };

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
  };

  //checking if pin exists in database, if not setting up new pin
  const handle_pin = async () => {
    if (localStorage.getItem("pin")) {
      setPin(localStorage.getItem("pin"));
      return true;
    }
    set_new_pin();
    return false;
  };
  //setting up new pin
  const set_new_pin = () => {
    var new_pin = window.prompt("Set new PIN: ");
    localStorage.setItem("pin", JSON.stringify(hash(new_pin)));
    setPin(hash(new_pin));
  };

  //checking if entered pi is correct
  const check_pin = () => {
    if (pin === "") {
      handle_pin();
      return false;
    }
    var new_pin = window.prompt("Enter PIN: ");
    if (hash(new_pin) === pin && new_pin !== "") return true;

    return false;
  };

  //checking if user is logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUid(user.uid);
    } else {
      navigate("/login");
    }
  });

  const signOut = () => {
    auth.signOut();
    setUid('')
    localStorage.clear();
  };

  const addNewItem = async (event) => {
    event.preventDefault();
    const newItem = {
      name: name,
      login: encrypt(login),
      password: encrypt(pass),
    };
    await addDoc(collection(db, "users", uid, "passwords"), newItem);
    setName("");
    setPass("");
    setLogin("");
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "users", uid, "passwords", id));
  };

  const editItem = async (editName, editLogin, editPass, id) => {
    const newData = {
      name: editName,
      login: encrypt(editLogin),
      password: encrypt(editPass),
    };
    await setDoc(doc(db, "users", uid, "passwords", id), newData);
  };

  //check if color is in memory
  useEffect(() => {
    try {
      if (localStorage.getItem("salt")) {
        setTempSalt(JSON.parse(localStorage.getItem("salt")));
        setSalt(JSON.parse(localStorage.getItem("salt")));
      } else {
        setShowError(true);
        setSalt("");
        setTempSalt("");
      }
      if (localStorage.getItem("data"))
        setData(JSON.parse(localStorage.getItem("data")));
      if (localStorage.getItem("pin"))
        setPin(JSON.parse(localStorage.getItem("pin")));
      else {
        handle_pin();
      }
      const local_pink = localStorage.getItem("pink");
      if (local_pink === "true") {
        setPink(true);
      } else {
        setPink(false);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  //changing colors
  useEffect(() => {
    changeColors();
  }, [pink]);
  //fetching data from database if user is logged in
  useEffect(() => {
    if (uid !== "") {
      onSnapshot(collection(db, "users", uid, "passwords"), (snapshot) => {
        const fetched_data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        if (fetched_data !== data) {
          setData(fetched_data);
          localStorage.setItem("data", JSON.stringify(fetched_data));
        }
      });
    }
  }, [uid]);

  return (
    <div>
      <Modal
        title="Settings"
        opened={settingsVisible}
        onClose={() => setSettingVisible(false)}
        classNames={{ modal: "modal-overlay" }}
      >
        <div>
          <div
            className="p-5 cursor-pointer text-center btn "
            onClick={handleColorChange}
          >
            Page Color:
            <FontAwesomeIcon className="px-3" icon={pink ? faSun : faMoon} />
          </div>
          <div className="p-5">
            <form onSubmit={(e) => handleConfirm(e)}>
              <label htmlFor="Salt" className="p-3 pl-0 text-[1.2rem]">
                Key:
              </label>
              <br />
              <input
                required
                type="text"
                id="Salt"
                className="btn"
                value={tempSalt}
                onChange={(event) => handleInputChange(event, setTempSalt)}
              />
              <br />
              <input type="submit" className="btn my-3" value="Save" />
            </form>
          </div>
        </div>
      </Modal>

      <div className="signOut">
        <Tooltip
          classNames={{ body: "tooltip", arrow: "tooltip" }}
          label="Open Settings"
          withArrow
          position="bottom"
          placement="center"
        >
          <button
            className="px-5"
            onClick={() => {
              setSettingVisible(!settingsVisible);
            }}
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
        </Tooltip>
        <button className="btn" onClick={signOut}>
          Log out
        </button>
      </div>
      <div className="add-item-wrapper">
        <div className="add-item blue-border relative">
          <div>Add Item</div>
          <form onSubmit={(event) => addNewItem(event)}>
            <input
              required
              className="btn"
              id="add-item-name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(event) => handleInputChange(event, setName)}
            />
            <br />
            <br />
            <input
              required
              className="btn"
              id="add-item-login"
              type="text"
              placeholder="Login"
              value={login}
              onChange={(event) => handleInputChange(event, setLogin)}
            />
            <br />
            <br />
            <div className="relative">
              <input
                required
                className="btn"
                type={passwordVisible ? "text" : "password"}
                id="add-item-pass"
                placeholder="Password"
                value={pass}
                onChange={(event) => handleInputChange(event, setPass)}
              />
              <Tooltip
                classNames={{
                  root: "absolute right-3 top-2.5 cursor-pointer",
                  body: "tooltip",
                  arrow: "tooltip",
                }}
                label={passwordVisible ? "Hide" : "Show"}
                withArrow
                position="bottom"
                placement="center"
              >
                <button
                  type="button"
                  className=""
                  onClick={togglePassword}
                  id="togglePassword"
                >
                  {passwordVisible ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </button>
              </Tooltip>
            </div>
            <div className="text-right px-3 my-2 generate">
              <button type="button" onClick={generatePassword}>
                Generate password
              </button>
            </div>
            <div className="submit-wrapper">
              <input type="submit" value="Add" className="btn" />
            </div>
          </form>
        </div>
      </div>
      {/* creating grid of items fetched from db */}
      <div className="grid-wrapper">
        {data.map((item, index) => (
          <GridElement
            key={index}
            data={item}
            deleteItem={deleteItem}
            check_pin={check_pin}
            editItem={editItem}
            decrypt={decrypt}
          />
        ))}
      </div>

      <Notification
        icon={<X size={18} />}
        className={`fixed right-6 bottom-3 w-48 border-none ${
          showError ? "visible" : "hidden"
        }`}
        color="red"
        title="Salt is empty!"
        onClose={() => setShowError(false)}
      >
        Please enter key!
      </Notification>
      <Notification
        icon={<Check size={18} />}
        className={`fixed right-6 bottom-3 w-48 border-none ${
          showConfirm ? "visible" : "hidden"
        }`}
        color="teal"
        title="Salt saved"
      ></Notification>
    </div>
  );
};

export default Home;
