import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


/**
 * Firebase config, details located at `project settings` 
 */
firebase.initializeApp({
  apiKey: "AIzaSyCtKpdlSfknijBnuj-da2bqPjSAsxjl3z0",
  authDomain: "chatme-19183.firebaseapp.com",
  projectId: "chatme-19183",
  storageBucket: "chatme-19183.appspot.com",
  messagingSenderId: "713538237021",
  appId: "1:713538237021:web:030d7452a39c3fd6e113b4"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


// signed in = obj --- signed out = null

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>

      </header>

      <section>
        { user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <buttom onClick={signInWithGoogle}>Sign in with Google</buttom>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}

function ChatRoom(){

  const dummy = useRef();


  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  
  const [messages] = useCollectionData(query, {idField: 'id'});
  
  const [formValue,setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({
      behavior: 'smooth'
    });

  }

  return (
    
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <div ref={dummy}></div>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

      <button type="submit">💬</button>


    </form>
    </main>
  )
}

function ChatMessage(props) {

  const { text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
      </div>
    )
}

export default App;
