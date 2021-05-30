import logo from './images/logo2.png';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

function App() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignerIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
  })

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const facebookProvider = new firebase.auth.FacebookAuthProvider();

  const handleGoogleSignIN = () => {
    // console.log('handleGoogleSignIN');
    firebase.auth().signInWithPopup(googleProvider)
      .then(res => {
        // console.log(res);
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSignerIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(errorCode, errorMessage, email, credential)
      });
  }

  const handleFacebookSignIN = () => {
    firebase.auth().signInWithPopup(facebookProvider)
      .then(res => {
        console.log(res);
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSignerIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(errorCode, errorMessage, email, credential)
      });
  }

  const handleBlur = (event) => {
    // console.log(event.target.name, event.target.value);
    let isFieldValid = true;
    if(event.target.name == 'email'){
      isFieldValid= /\S+@\S+\.\S+/.test(event.target.value);
    }
    if(event.target.name == 'password'){
      const passwordLength = event.target.value.length > 6;
      const passwordHasValid = /\d{1}/.test(event.target.value)
      isFieldValid = passwordLength && passwordHasValid;
    }
    if(isFieldValid){
      const newUserInfo = {...user}
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo)
    }
  }

  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);

        updateUserName(user.name)
      })
      .catch((error) => {
        // console.log(res);
        const newUserInfo = {...user}
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);

        console.log('Sign in User SuccessFully', res.user);
      })
      .catch((error) => {
        const newUserInfo = {...user}
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    e.preventDefault()
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(function() {
      console.log('Update User Name Succesfully')
    }).catch(function(error) {
      console.log(error)
    });
  }
  return (
    <div className="App">
      <div className="form-inner">
        <img src={logo} alt="" />
        
          <div className="formCheckbox">
             <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
             <label htmlFor="newUser">New User Sign Up</label>
          </div>

        <form action="" onSubmit={handleSubmit}>
          {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Name" />}
          <br />
          <input type="text" name="email" onBlur={handleBlur} placeholder="Email" />
          <br />
          <input type="password" name="password" onBlur={handleBlur} placeholder="Password" />
          <br />
          {newUser && <input type="password" name="password" onBlur={handleBlur} placeholder="Confirm Password" />}
          <br />
          <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
        </form>
        
        <p style={{color: 'red'}}>{user.error}</p>
        { user.success && <p style={{color: 'green'}}>User {newUser ? 'Create' : 'LogIn'} A Succesfully</p>}

          <br />
        {newUser && <button onClick={handleGoogleSignIN}><FontAwesomeIcon icon={faGooglePlus} /> Google Sign In</button>}
        <br />
        {newUser && <button onClick={handleFacebookSignIN}><FontAwesomeIcon icon={faFacebook} /> Facebook Sign In</button>}

         {/* google , facebook
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <img src={user.photo} alt="" /> */}
      </div>
    </div>
  );
}

export default App;
