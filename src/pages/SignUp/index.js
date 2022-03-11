import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ToastAndroid, StatusBar, Modal, Image } from 'react-native';
import { RadioButton, TextInput, Chip } from 'react-native-paper';
import { Picker } from 'native-base';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../../services/firebase'
import Header2 from '../../components/Header2';
import { Appbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'

export default function SignUp() {

  const { signUp } = useContext(AuthContext);
  const [checked, setChecked] = useState('');
  const [escola, setEscola] = useState('IFSC Câmpus Xanxerê');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [user_exist, setUser_exist] = useState([]);
  const [modal, setModal] = useState(false);
  const [alimentos, setAlimentos] = useState(false);
  const [mecanica, setMecanica] = useState(false);
  const [informatica, setInformatica] = useState(false);
  const [image, setImage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');

  var local = []
  var url = ''
  var string = ''
  useEffect(() => {
    firebase
      .database()
      .ref('users')
      .on('value', (snapshot) => {
        snapshot.forEach((userAlreadyExists) => {
          setUser_exist((oldArray) => [...oldArray, userAlreadyExists.val().usuario])
        }
        );
      })
  }, [])

  function cadastrar() {
    firebase
      .database()
      .ref('users')
      .on('value', (snapshot) => {
        snapshot.forEach((userAlreadyExists) => {
          setUser_exist((oldArray) => [...oldArray, userAlreadyExists.val().usuario]);
        }
        );
      })



    if (informatica) {
      local.push('Informática')
    }
    if (mecanica) {
      local.push('Mecânica')
    }
    if (alimentos) {
      local.push('Alimentos')
    }

    if (!alimentos && !mecanica && !informatica) {
      ToastAndroid.show("Você precisa escolher ao menos um.", ToastAndroid.LONG);
    }

    if (user_exist.includes(usuario)) {
      ToastAndroid.show("Nome de usuário já em uso.", ToastAndroid.LONG);
    } else if (email !== '' && password !== '' && nome !== '' && escola !== '' && usuario !== '' && checked !== '' && local.length > 0) {
      signUp(email, password, nome, escola, usuario, checked, local, url)
    }

  }



  function infoChip() {
    if (informatica) {
      return (<TouchableOpacity style={styles.pressedChip} onPress={() => {
        setInformatica(!informatica)
      }}>
        <MaterialIcons name="cancel" size={24} style={{ marginLeft: 10, marginRight: '20%' }} color="#737373" />
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="computer" size={30} color="#737373" />
          <Text style={{ marginLeft: 10 }}>Informática</Text>
        </View>
      </TouchableOpacity>)
    } else {
      return (<TouchableOpacity style={styles.chip} onPress={() => {
        setInformatica(true)
      }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="computer" size={30} color="#808080" />
          <Text style={{ marginLeft: 10, color: '#808080' }}>Informática</Text>
        </View>
      </TouchableOpacity>)
    }
  }

  function mecChip() {
    if (mecanica) {
      return (<TouchableOpacity style={styles.pressedChip} onPress={() => {
        setMecanica(!mecanica)
      }}>
        <MaterialIcons name="cancel" size={24} style={{ marginLeft: 10, marginRight: '20%' }} color="#737373" />
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="engineering" size={30} color="#737373" />
          <Text style={{ marginLeft: 10 }}>Mecânica</Text>
        </View>
      </TouchableOpacity>)
    } else {
      return (<TouchableOpacity style={styles.chip} onPress={() => {
        setMecanica(true)
      }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="engineering" size={30} color="#808080" />
          <Text style={{ marginLeft: 10, color: '#808080' }}>Mecânica</Text>
        </View>
      </TouchableOpacity>)
    }
  }

  function foodChip() {
    if (alimentos) {
      return (<TouchableOpacity style={styles.pressedChip} onPress={() => {
        setAlimentos(!alimentos)
      }}>
        <MaterialIcons name="cancel" size={24} style={{ marginLeft: 10, marginRight: '20%' }} color="#737373" />
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="fastfood" size={30} color="#737373" />
          <Text style={{ marginLeft: 10 }}>Alimentos</Text>
        </View>
      </TouchableOpacity>)
    } else {
      return (<TouchableOpacity style={styles.chip} onPress={() => {
        setAlimentos(true)
      }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="fastfood" size={30} color="#808080" />
          <Text style={{ marginLeft: 10, color: '#808080' }}>Alimentos</Text>
        </View>
      </TouchableOpacity>)
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
    const ref = firebase.storage().ref().child('users/' + string);
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

  async function load() {
    console.log('string:', string)
    try {
      let response = await firebase.storage().ref('users').child(string).getDownloadURL();
      console.log('response', response)
      url = response
      cadastrar()
    } catch (err) {
      console.log('Nenhuma foto foi encontrada.');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Header2 titulo={'Cadastro'} />
      <Text style={{ fontSize: 25, marginLeft: 15, color: '#6d0ad6', fontWeight: 'bold' }}>Preencha os campos abaixo</Text>
      <Text style={{ fontSize: 20, marginLeft: 15, color: '#6d0ad6', fontWeight: 'bold' }}>para efetuar o seu cadastro:</Text>

      <StatusBar
        backgroundColor={'#420680'}
      />
      <Modal
        style={styles.modal}
        visible={modal}
        animationType={'fade'}
      >
        <StatusBar
          backgroundColor={'#8812ff'}
        />

        <View style={styles.header}>
          <Appbar.BackAction color={'#fff'} onPress={() => setModal(!modal)} />
          <Text style={styles.headerText}>Interesses:</Text>
          <View></View>
        </View>

        <View style={styles.modalView}>
          <Text style={styles.modalTexte}>Falta pouco! Agora preciso que escolha ao menos uma área de interesse para terminar o seu cadastro.</Text>
          <View style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>

            {infoChip()}
            {mecChip()}
            {foodChip()}

          </View>
          <Text style={styles.modalText}>Tudo bem se você não souber o que escolher agora, você pode mudar depois!</Text>
          <Entypo name="emoji-flirt" size={30} color="#8c8c8c" />
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            style={styles.imageBox}
            source={{
              uri: image
            }}></Image>
          <TouchableOpacity style={styles.gBtn} onPress={pickImage}>
            <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 5 }}>Selecionar a foto de perfil</Text>
            <Ionicons name="images" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.botao} onPress={() => {
          if (image == 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png') {
            ToastAndroid.show("Selecione uma foto de perfil.", ToastAndroid.LONG);
          }else{
            uploadImg()
          }
        }}>
          <MaterialIcons name="check" size={60} color="#6d0ad6" />
        </TouchableOpacity>
      </Modal>

      <TextInput
        style={styles.textint}
        autoCorrect={false}
        autoCapitalize="words"
        placeholder={"Nome completo"}
        onChangeText={(text) => setNome(text)}
      />
      <TextInput
        style={styles.textint}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={"E-mail com @"}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.textint}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={"Usuário"}
        onChangeText={(text) => setUsuario('@' + text)}
      />
      <TextInput
        style={styles.textint}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={"Senha"}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />

      <Text style={{ fontSize: 17, marginTop: 10, marginLeft: 15 }}>Voce é:</Text>
      <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 7 }}>
        <RadioButton
          color='#420680'
          value="Professor"
          status={checked === 'Professor' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('Professor')}
        />
        <Text style={{ marginTop: '2%' }}>Professor(a)</Text>
        <RadioButton
          color='#420680'
          value="Aluno"
          status={checked === 'Aluno' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('Aluno')}
        />
        <Text style={{ marginTop: '2%' }}>Aluno(a)</Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Text style={{ fontSize: 18, marginLeft: '3%' }}>Escola: </Text>
        <Picker
          note
          mode='dialog'
          selectedValue={escola}
          onValueChange={(itemValor, itemIndex) => {
            setEscola(itemValor)
          }}
        >
          <Picker.Item label="IFSC Câmpus Xanxerê" value="ifscxxe" />

        </Picker>
      </View>

      <TouchableOpacity style={styles.botao} onPress={() => {
        if (email !== '' && password !== '' && nome !== '' && escola !== '' && usuario !== '' && checked !== '') {
          setModal(!modal)
        } else {
          setModal(!modal)
          ToastAndroid.show("Preencha os dados para prosseguir.", ToastAndroid.LONG);
        }
      }}>

        <MaterialIcons name="navigate-next" size={60} color="#6d0ad6" />
      </TouchableOpacity>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#8c8c8c',
    width: '80%',
    marginBottom: 4
  },
  modalTexte: {
    fontSize: 20,
    textAlign: 'center',
    color: '#6d0ad6',
    width: '80%',
    marginBottom: 8,
    fontWeight: 'bold'
  },
  modalView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%'
  },
  textint: {
    margin: '3%'
  },
  txt: {
    fontSize: 18,
    marginLeft: '3%',
    marginTop: '3%',
    color: '#000'
  },
  botao: {
    marginTop: '10%',
    alignItems: 'center',
  },
  chip: {
    width: 300,
    height: 50,
    fontSize: 80,
    margin: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#e3e3e3',
    justifyContent: 'center'
  }, pressedChip: {
    width: 300,
    height: 50,
    fontSize: 80,
    margin: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#e3e3e3',
    borderWidth: 1,
    borderColor: '#737373'
  },
  header: {
    width: "100%",
    flexDirection: 'row',
    backgroundColor: '#6d0ad6'
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: '3%',
    color: '#fff'
  }, imageBox: {
    width: 100,
    height: 100,
    borderRadius: 200,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000'
  }, gBtn: {
    height: 40,
    borderRadius: 15,
    backgroundColor: "#6d0ad6",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    width: 200
  }
})