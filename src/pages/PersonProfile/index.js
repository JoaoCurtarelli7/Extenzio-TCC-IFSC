import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Linking, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import Header2 from '../../components/Header2'
import firebase from '../../../services/firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PersonProfile({ route }) {
  const { userId } = route.params
  const [userData, setUserData] = useState([])
  const [nome, setNome] = useState(" ")
  const [u, setU] = useState('')
  const [bio, setBio] = useState(' ')
  const [email, setEmail] = useState(' ')
  const [escola, setEscola] = useState(' ')


  useEffect(() => {
    async function tryData() {
      await firebase
        .database()
        .ref('users')
        .on('value', (snapshot) => {
          setUserData([]);
          snapshot.forEach((maquina) => {

            if (userId === maquina.val().id) {
              let usuario = {
                nome: maquina.val().nome,
                usuario: maquina.val().usuario,
                bio: maquina.val().bio,
                email: maquina.val().email,
                escola: maquina.val().escola,
                url: maquina.val().url,
                bio: maquina.val().bio
              };
              setUserData(usuario)
            }
          });
        });
    }
    tryData()
  }, [])
  return (

    <View style={styles.container}>
      <StatusBar
        backgroundColor={'#420680'}
      />
      <Header2 titulo={userData.nome} />
      <ScrollView style={styles.scroll}>
        <View style={styles.personContainer}>
          <Avatar.Image size={100} source={{ uri: userData.url }} />
          <View style={{ marginLeft: '5%' }}>
            <Text style={styles.name}>{userData.nome}</Text>
            <Text style={styles.user}>{userData.usuario}</Text>
          </View>
        </View>
        <View style={styles.bioContainer}>
          <Text style={{ marginRight: '93%', fontWeight: 'bold', fontSize: 16, color: '#6d0ad6' }}>Bio:</Text>
          <Text style={{textAlign: 'justify'}}>{userData.bio}</Text>
        </View>
        <Text style={{ margin: '3%', fontWeight: 'bold', fontSize: 16, color: '#6d0ad6' }}>Campus atuante e contato:</Text>
        <TouchableOpacity style={styles.info} onPress={() => Linking.openURL('mailto:' + userData.email + '?subject=&body=')}>
          <Ionicons color={'#6d0ad6'} name="mail-outline" size={25} />
          <Text style={{ marginLeft: '1%', fontWeight: 'bold' }}>{userData.email}</Text>
        </TouchableOpacity>
        <View style={styles.info}>
          <Ionicons name="school-outline" color={'#6d0ad6'} size={25} />
          <Text style={{ marginLeft: '1%', fontWeight: 'bold' }}>{userData.escola}</Text>
        </View>

      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 2,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-around'
  },
  scroll: {
    display: 'flex',
    flex: 1,
    width: '100%'
  },
  personContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#6d0ad6',
    padding: '5%'
  }, name: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#6d0ad6'
  }, user: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'black'
  }, info: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '3%'
  }, bioContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#6d0ad6',
    padding: '5%'
  },
})