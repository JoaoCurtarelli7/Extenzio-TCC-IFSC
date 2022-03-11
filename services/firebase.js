import firebase from "firebase/app";
import firestore from 'firebase/firestore';
import 'firebase/storage'
import 'firebase/auth';
import 'firebase/database';
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBIRjcIeXMArc97b7vLCQYpSCfyMO0UTvQ",
  authDomain: "extenzio-cd73a.firebaseapp.com",
  databaseURL: "https://extenzio-cd73a-default-rtdb.firebaseio.com",
  projectId: "extenzio-cd73a",
  storageBucket: "extenzio-cd73a.appspot.com",
  messagingSenderId: "829036798564",
  appId: "1:829036798564:web:efc04b1fe4b4d8e47eb571",
  measurementId: "G-DDNLM2Y9QH"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.firestore();
export default firebase;