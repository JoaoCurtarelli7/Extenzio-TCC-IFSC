import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Keyboard, Text, Image, ScrollView, Modal } from 'react-native';
import { TextInput, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Header2 from '../../components/Header2';
import { Ionicons, AntDesign, FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import firebase from '../../../services/firebase';
import { AuthContext } from '../../contexts/auth';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker'
import { Picker, Icon } from 'native-base';


export default function ProjectAdd() {

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [vag, setVag] = useState(0);
  const [certificate, setCetificate] = useState(false);
  const [bolsa, setBolsa] = useState(false);
  const [modal, setModal] = useState(false);
  const [alimentos, setAlimentos] = useState(false);
  const [mecanica, setMecanica] = useState(false);
  const [informatica, setInformatica] = useState(false);
  const [visible, setVisible] = useState(true)


  const [image, setImage] = useState('data:image/png;base64,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');
  var string = ''
  var url = ''
  var rem = 0
  var cef = 0

  var dNow = new Date();
  var localdate = dNow.getDate() + '/' + (dNow.getMonth() + 1) + '/' + dNow.getFullYear() + 'T' + dNow.getHours() + ':' + dNow.getMinutes();


  async function load() {
    try {
      let response = await firebase.storage().ref('projects').child(string).getDownloadURL();
      console.log('response', response)
      url = response
      salvar()
    } catch (err) {
      console.log('Nenhuma foto foi encontrada.');
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
    const ref = firebase.storage().ref().child('projects/' + string);
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


  async function salvar() {

    console.log(format(new Date(), 'dd/MM/yyyy HH:mm'))
    console.log("Data: ", new Date())
    if (
      titulo !== '' &&
      descricao !== '' &&
      tipo !== ''


    ) {
      let machine = await firebase.database().ref('projects');
      let chave = machine.push().key;

      if (bolsa) {
        rem = 1
      }
      if (certificate) {
        cef = 1
      }

      machine.child(chave).set({
        titulo: titulo,
        descricao: descricao,
        tipo: tipo,
        data: format(new Date(), 'dd/MM/yyyy HH:mm'),
        autor: user.nome,
        likes: 0,
        commentqtd: 0,
        userId: user.uid,
        usuario: user.usuario,
        escola: user.escola,
        id: chave,
        data: localdate,
        url: url,
        vag: vag,
        rem: rem,
        cef: cef

      }).then(() => {
        Keyboard.dismiss();
        setTitulo('');
        setDescricao('');
        setTipo('');
        navigation.navigate('Home');
        console.log("Data abaixo:", data)
      }).catch((error) => { console.log(error) })
    } else {

    }
  }

  function infoChip() {
    if (informatica) {
      return (<TouchableOpacity style={styles.pressedChip} onPress={() => {
        setInformatica(!informatica), setTipo('Informática'), setMecanica(false), setAlimentos(false)
      }}>
        <MaterialIcons name="cancel" size={24} style={{ marginLeft: 10, marginRight: '20%' }} color="#737373" />
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="computer" size={30} color="#737373" />
          <Text style={{ marginLeft: 10 }}>Informática</Text>
        </View>
      </TouchableOpacity>)
    } else {
      return (<TouchableOpacity style={styles.chip} onPress={() => {
        setInformatica(true), setTipo('Informática'), setMecanica(false), setAlimentos(false)
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
        setMecanica(!mecanica), setTipo('Mecânica'), setInformatica(false), setAlimentos(false)
      }}>
        <MaterialIcons name="cancel" size={24} style={{ marginLeft: 10, marginRight: '20%' }} color="#737373" />
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="engineering" size={30} color="#737373" />
          <Text style={{ marginLeft: 10 }}>Mecânica</Text>
        </View>
      </TouchableOpacity>)
    } else {
      return (<TouchableOpacity style={styles.chip} onPress={() => {
        setMecanica(true), setTipo('Mecânica'), setInformatica(false), setAlimentos(false)
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
        setAlimentos(!alimentos), setTipo('Alimentos'), setInformatica(false), setMecanica(false)
      }}>
        <MaterialIcons name="cancel" size={24} style={{ marginLeft: 10, marginRight: '20%' }} color="#737373" />
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="fastfood" size={30} color="#737373" />
          <Text style={{ marginLeft: 10 }}>Alimentos</Text>
        </View>
      </TouchableOpacity>)
    } else {
      return (<TouchableOpacity style={styles.chip} onPress={() => {
        setAlimentos(true), setTipo('Alimentos'), setInformatica(false), setMecanica(false)
      }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="fastfood" size={30} color="#808080" />
          <Text style={{ marginLeft: 10, color: '#808080' }}>Alimentos</Text>
        </View>
      </TouchableOpacity>)
    }
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

    <View
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#420680" />
      <Header2 titulo='Cadastre um Projeto' />
      <TextInput
        mode='outlined'
        theme={{
          colors: {
            underlineColor: '#d6d6d6', background: 'white'
          }, roundness: 8
        }}
        style={styles.TextInt}
        placeholder="Ex: Batata doce como fonte de energia."
        placeholderTextColor="#d6d6d6"
        autoCorrect={false}
        autoCapitalize="sentences"
        label="Título"
        onChangeText={(text) => setTitulo(text)}
      />
      <TextInput
        mode='outlined'
        theme={{
          colors: {
            underlineColor: '#d6d6d6', background: 'white'
          }, roundness: 8
        }}
        style={styles.TextInt2}
        placeholder="Ex: Batata doce é energia pra maromba. Por que não abastecer uma cidade?"
        placeholderTextColor="#d6d6d6"
        autoCorrect={false}
        autoCapitalize="sentences"
        multiline={true}
        label='Descrição'
        onChangeText={(text) => setDescricao(text)}
      />

      <Modal
        visible={modal}
        animationType='slide'
      >
        <StatusBar
          barStyle="light-content"
        />
        <Header2 titulo='Cadastre um Projeto' />
        <View style={styles.modal}>


          <View>
            <TextInput
              mode='outlined'
              theme={{
                colors: {
                  underlineColor: '#d6d6d6', background: 'white'
                }, roundness: 8
              }}
              style={styles.vagasInput}
              keyboardType="numeric"
              placeholder="Ex: 1"
              placeholderTextColor="#d6d6d6"
              autoCorrect={false}
              autoCapitalize="sentences"
              label="Vagas"
              maxLength={5}
              onChangeText={(vag) => setVag(vag)}
            />
          </View>

          <View style={styles.featuresLine}>
            <View style={styles.features}>
              <FontAwesome5 name="certificate" size={34} color="#6d0ad6" />
              <Switch color={'#6d0ad6'} value={certificate} onValueChange={() => { setCetificate(!certificate) }} />
              <Text style={{ color: '#6d0ad6', fontWeight: 'bold' }}>Certificado</Text>
            </View>
            <View style={styles.features}>
              <FontAwesome5 name="coins" size={34} color="#6d0ad6" />
              <Switch color={'#6d0ad6'} value={bolsa} onValueChange={() => { setBolsa(!bolsa) }} />
              <Text style={{ color: '#6d0ad6', fontWeight: 'bold' }}>Bolsa</Text>
            </View>
          </View>
        </View>

        <View style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>

          {infoChip()}
          {mecChip()}
          {foodChip()}

        </View>
        {pub()}
        <TouchableOpacity onPress={() => { setModal(!modal) }} style={styles.closeButton}>
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>
      </Modal>

      <View style={styles.imageSection}>
        <Image
          style={styles.imageBox}
          source={{
            uri: image
          }}></Image>

        <TouchableOpacity style={styles.gBtn} onPress={pickImage}>
          <Text style={styles.txt_b}>Selecionar imagem</Text>
          <Ionicons name="images" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => {
        setModal(true)
      }
      }>

        <MaterialIcons name="navigate-next" size={70} color="#6d0ad6" style={{ top: 50}} />
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1
  },
  TextInt: {
    height: '8%',
    width: '90%',
    marginTop: 10
  },
  TextInt2: {
    height: '60%',
    width: '90%',
  },
  imageBox: {
    width: "43%",
    height: 150,
    top: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  gBtn: {
    height: '20%',
    borderRadius: 15,
    backgroundColor: "#6d0ad6",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    marginLeft: '3%',

  },
  txt_b: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10
  },

  pickerItem: {
    color: 'red'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,

  },
  featuresLine: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  txt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -180
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  vagasInput: {
    height: '8%',
    width: '90%',
    marginTop: 10,
    marginLeft: 20
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
    justifyContent: 'center',
    marginLeft: "16%"
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
    borderColor: '#737373',
    marginLeft: "16%"
  }, botao: {
    backgroundColor: '#ff8940',
    width: '40%',
    height: '5%',
    marginTop: '10%',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'

  }, closeButton: {
    backgroundColor: '#6d0ad6',
    padding: 10,
    borderRadius: 40,
    marginLeft: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    marginLeft: '30%',
    marginTop: 5
  }

})