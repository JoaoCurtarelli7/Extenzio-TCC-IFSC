import React, {useState, createContext, useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../services/firebase';

export const AuthContext = createContext({});

function AuthProvider({children}) {
  const [author, setAuthor] = useState('');
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function loadStorage() {
      const storageUser = await AsyncStorage.getItem('Auth_user');

      if (storageUser) {
        setUser(JSON.parse(storageUser));
      
      }

    }

    loadStorage();
  }, []);


  async function signIn(email, password) {


    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await firebase
          .database()
          .ref('users')
          .child(uid)
          .once('value')
          .then((snapshot) => {
              let data = {
                uid: uid,
                nome: snapshot.val().nome,
                initials: snapshot.val().initials,
                bio: snapshot.val().bio,
                email: value.user.email,
                escola: snapshot.val().escola,
                usuario: snapshot.val().usuario, 
                tipo: snapshot.val().tipo,
                formacao: snapshot.val().formacao,
                senha: snapshot.val().password,
                url: snapshot.val().url,
                likedpost: snapshot.val().likedpost
              };
              setUser(data);
              storageUser(data);
            
      })
      .catch(() => {
      });

  
    })
  }

  async function signUp(email, password, nome, escola, usuario, tipo, initials, url) {
      var likedpost = ['holder']
      await firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(async (value) => {
              let uid = value.user.uid;
              await firebase.database().ref('users').child(uid).set({
                  nome: nome,
                  email: value.user.email,
                  escola: escola,
                  usuario: usuario, 
                  tipo: tipo,
                  formacao: '',
                  senha: password,
                  initials: initials,
                  bio: '',
                  id: uid,
                  url: url, 
                  likedpost: likedpost
                  
              })
                  .then(() => {
                      let data = {
                          uid: uid,
                          nome: nome,
                          email: value.user.email,
                          escola: escola,
                          usuario: usuario, 
                          tipo: tipo,
                          senha: password,
                          initials: initials,
                          bio: '',
                          formacao: '',
                          id: uid,
                          url: url
                      };
                      setUser(data);
                      storageUser(data);
                  })
          })
          .catch((error) => {
              alert(error.code);
          });
  }

  async function storageUser(data) {
    await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
  }

  async function signOut() {
    await firebase.auth().signOut();
    await AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
