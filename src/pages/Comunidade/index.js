import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, StatusBar, FlatList, Text } from 'react-native';
import { AuthContext } from '../../contexts/auth'
import { useNavigation } from '@react-navigation/native';
import { FAB } from 'react-native-paper'
import Header from '../../components/Header'
import ListaTopics from '../ListaTopics';
import firebase from '../../../services/firebase'
import { TextInput } from 'react-native-paper';


export default function Comunidade() {

  const [topics, setTopics] = useState([])
  const navigation = useNavigation()
  const [search, setSearch] = useState('')



  useEffect(() => {
    async function topicList() {
      await firebase
        .database()
        .ref('topics')
        .on('value', (snapshot) => {
          setTopics([]);
          snapshot.forEach((maquina) => {
            let topic = {
              nome: maquina.val().autor,
              usuario: maquina.val().usuario,
              titulo: maquina.val().titulo,
              descricao: maquina.val().descricao,
              userId: maquina.val().userId,
              id: maquina.val().id
            };
            setTopics((oldArray) => [...oldArray, topic]);

          });
        });
    }
    topicList()
  }, [])

  function filtro(value) {
    if (search === '') {
      return value;
    } else {
      var str = value.nome
      if (str.match(search)) {
        return value;
      }
    }
  }

  function compare(a, b) {
    return a.data < b.data;
  }

  const renderItem = ({ item }) => (
    <ListaTopics data={item} />
  );

  return (

    <View style={styles.container}>
      <StatusBar
        backgroundColor={'#420680'}
      />
      <View style={styles.header}>
        <Text style={styles.texto}>Comunidade</Text>
      </View>
      <TextInput

        style={styles.txtInput}
        mode='outlined'
        theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
        autoCorrect={false}
        placeholder="Buscar"
        autoCapitalize="sentences"
        outlineColor="white"
        selectionColor="black"
        onChangeText={(text) => setSearch(text)}
      >

      </TextInput>
      <ScrollView>
        <FlatList
          data={topics.filter(filtro).sort(compare)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />

      </ScrollView>
      <FAB
        style={styles.fab}
        big
        icon="plus"
        color='white'
        theme={{ colors: { accent: '#6d0ad6' } }}
        onPress={() => navigation.navigate('TopicsAdd')}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  TextInt: {
    color: 'black',
    backgroundColor: 'white',
    height: '8%',
    width: '60%',
    marginLeft: '20%',
    marginTop: '50%',
  },
  fab: {
    position: 'absolute',
    margin: 30,
    right: 0,
    bottom: 0,
    borderColor: '#6d0ad6',
    borderWidth: 1,
  },
  txtInput: {
    width: 340,
    height: 50,
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'center',
  },
  
  header: {
    width: "100%",
    flexDirection: 'row',
    backgroundColor: '#6d0ad6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  texto: {
    fontSize: 28,
    textAlign: 'center',
    margin: '3%',
    color: '#fff',
    fontWeight: 'bold'
  }
})