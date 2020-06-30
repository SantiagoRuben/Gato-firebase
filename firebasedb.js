import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyB9gVgLys7LzbbsdQERw2EBHdEuDpF890Y",
    authDomain: "persona-1b2de.firebaseapp.com",
    databaseURL: "https://persona-1b2de.firebaseio.com",
    projectId: "persona-1b2de",
    storageBucket: "persona-1b2de.appspot.com",
    messagingSenderId: "229033688628",
    appId: "1:229033688628:web:865b95b26680cc9f235461",
    measurementId: "G-V6CQLP1G5W"
  };

  const app = firebase.initializeApp(firebaseConfig);

export default app;