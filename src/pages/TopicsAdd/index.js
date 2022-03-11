import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Keyboard, Text, Image, KeyboardAvoidingView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Header2 from '../../components/Header2'
import { Ionicons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import firebase from '../../../services/firebase'
import { AuthContext } from '../../contexts/auth'
import { format } from 'date-fns'
import * as ImagePicker from 'expo-image-picker'



export default function TopicsAdd({ data }) {

  const navigation = useNavigation()
  const { user } = useContext(AuthContext)
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [image, setImage] = useState('data:image/png;base64,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');
  const [visible, setVisible] = useState(true)
  var url = ''


  async function salvar() {
    console.log(format(new Date(), 'dd/MM/yyyy HH:mm'))
    if (
      titulo !== '' &&
      descricao !== ''


    ) {
      let machine = await firebase.database().ref('topics');
      let chave = machine.push().key;


      machine.child(chave).set({
        titulo: titulo,
        descricao: descricao,
        data: format(new Date(), 'dd/MM/yyyy HH:mm'),
        autor: user.nome,
        likes: 0,
        userId: user.uid,
        usuario: user.usuario,
        id: chave,
        url: url,
        commentqtd: 0


      }).then(() => {
        Keyboard.dismiss();
        setTitulo('');
        setDescricao('');
        this.clearData();
        navigation.navigate('Comunidade');
      }).catch((error) => { console.log(error) })
      navigation.navigate('Comunidade');
    } else {
    }

  }



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  async function load() {
    try {
      let response = await firebase.storage().ref('topics').child(string).getDownloadURL();
      console.log('response', response)
      url = response
      salvar()
    } catch (err) {
      console.log('Nenhuma foto foi encontrada.');
    }
  }
  const uploadImg = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);

      };
      xhr.onerror = function () {
        reject(new TypeError('Request falhou.'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    });

    string = new Date().toISOString()
    const ref = firebase.storage().ref().child('topics/' + string);
    let img = ref.fullPath.split('/');

    const snapshot = ref.put(blob);

    snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {

    }, (error) => {

      console.log(error)
      blob.close();
      return
    }, () => {
      load()
      snapshot.ref.getDonwloadURl().then((url) => {
        console.log('download', url);
        blob.close();
        return url;
      })
    });
  }

  function pub() {
    if (visible) {
      return (
        <TouchableOpacity style={styles.botao} onPress={() => {
          uploadImg(), setVisible(false)
        }}>
          <Text style={styles.txt}>Publicar</Text>
        </TouchableOpacity>
      )
    } else {

    }
  }


  return (

    <View style={styles.container}>
       
      <StatusBar
        barStyle="light-content"
        backgroundColor={'#420680'} />
      <Header2 titulo='Cadastre um Tópico' />


      <TextInput
        mode='outlined'
        theme={{ colors: { primary: 'black', underlineColor: 'transparent', } }}
        style={styles.TextInt}
        placeholder="Título do Tópicos"
        placeholderTextColor="black"
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={(text) => setTitulo(text)}
      />

      <TextInput
        mode='outlined'
        theme={{ colors: { primary: 'black', underlineColor: 'transparent', } }}
        style={styles.TextInt2}
        multiline={true}
        placeholder="Descrição"
        placeholderTextColor="black"
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={(text) => setDescricao(text)}
      />
      <View style={styles.imageSection}>
        <View>
          <TouchableOpacity style={styles.gBtn} onPress={pickImage}>
            <Text style={styles.txt_b}>Selecionar imagem</Text>
            <Ionicons name="images" size={24} color="white" />
          </TouchableOpacity>

        </View>
        <Image
          style={styles.imageBox}
          source={{
            uri: image
          }}></Image>
      </View>
      {pub()}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },

  imageSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: -150
  },

  gBtn: {
    height: 55,
    width: 140,
    marginLeft: '12%',
    borderRadius: 15,
    backgroundColor: "#6d0ad6",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },

  txt_b: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10
  },

  imageBox: {
    width: 160,
    height: 150,
    borderRadius: 10,
    marginLeft: "-2%",
    borderWidth: 1,
    borderColor: '#000'
  },

  botao: {
    backgroundColor: '#ff8940',
    width: '40%',
    height: '5%',
    marginTop: '10%',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'

  },
  TextInt: {
    color: 'black',
    backgroundColor: 'white',
    height: '8%',
    width: '85%',
    marginLeft: '8%',
    marginTop: '5%',


  },
  TextInt2: {
    color: 'black',
    backgroundColor: 'white',
    height: '60%',
    width: '85%',
    marginLeft: '8%',
    marginTop: '5%',

  },



  picker: {
    width: '60%',
    marginLeft: '20%',
    bottom: '18%',

  },
})