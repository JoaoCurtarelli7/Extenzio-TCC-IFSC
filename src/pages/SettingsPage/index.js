import React, { useState, useContext, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../../services/firebase';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsPage() {
  const { signOut } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  return (
    <>
      <View style={styles.containerB}>
        <Text style={styles.texto}>Configurações</Text>
        <View></View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => {
          firebase.database().ref('users').child(user.id).remove(), signOut()
        }}>
          <Text style={{ color: '#fff', fontSize: 20 }}>Deletar conta</Text>
          <MaterialIcons name="delete" size={35} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
          onPress={signOut}>
          <Text style={{ color: '#fff', fontSize: 20, marginRight: 10 }}>Sair</Text>
          <MaterialIcons name="logout" size={35} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  txt: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 220,
    height: 75,
    backgroundColor: '#1171EC',
    borderRadius: 10,
    margin: 10
  },
  containerB: {
    width: "100%",
    flexDirection: 'row',
    backgroundColor: '#6d0ad6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  texto: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: '3%',
    color: '#fff',
    margin: 20,
    fontWeight: 'bold'
  },
  deleteButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 220,
    height: 75,
    backgroundColor: '#DA6161',
    borderRadius: 10
  }
})

