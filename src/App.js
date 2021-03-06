import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBTbV-ptwnWpqSlR0_ccklfHFnzFyazie8",
  authDomain: "chat-prototype-ea6c5.firebaseapp.com",
  databaseURL: "https://chat-prototype-ea6c5-default-rtdb.firebaseio.com",
  projectId: "chat-prototype-ea6c5",
  storageBucket: "chat-prototype-ea6c5.appspot.com",
  messagingSenderId: "489572636556",
  appId: "1:489572636556:web:36b3cf799c880d8bfea8a9",
  measurementId: "G-4CWLH14ZE2"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;
    
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
  };
  
  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={'message ${messageClass}'}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>
      Sign Out
    </button>
  )
}

export default App;
