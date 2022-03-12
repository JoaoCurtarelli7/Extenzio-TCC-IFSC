import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, TextInput } from 'react-native-paper';
import Header2 from '../../components/Header2'
import firebase from '../../../services/firebase'
import { Ionicons, AntDesign, FontAwesome5, Feather, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth';
import CommentList from '../CommentList';
import { useNavigation } from '@react-navigation/native';

export default function FullProject({ route }) {

  const { user } = useContext(AuthContext);
  const { id, userId } = route.params
  const [projectData, setProjectData] = useState([])
  const [commentModal, setCommentModal] = useState(false)
  const [comment, setComment] = useState('');
  const [results, setResults] = useState([]);
  const [postArray, setPostArray] = useState([])
  const [connectionsData, setConnectionsData] = useState([])


  const navigation = useNavigation();

  useEffect(() => {
    async function tryData() {
      await firebase
        .database()
        .ref('projects')
        .on('value', (snapshot) => {
          setProjectData([]);
          snapshot.forEach((maquina) => {
            if (id === maquina.val().id) {
              let projecto = {
                descricao: maquina.val().descricao,
                nome: maquina.val().autor,
                likes: maquina.val().likes,
                usuario: maquina.val().usuario,
                titulo: maquina.val().titulo,
                tipo: maquina.val().tipo,
                id: maquina.val().id,
                userId: maquina.val().userId,
                data: maquina.val().data,
                rem: maquina.val().rem,
                cef: maquina.val().cef,
                vag: maquina.val().vag,
                url: maquina.val().url,
                commentqtd: maquina.val().commentqtd
              };
              setProjectData(projecto)
            }
          });
        });
    }

    async function tryComment() {
      await firebase
        .database()
        .ref('comments')
        .on('value', (snapshot) => {
          setResults([]);
          snapshot.forEach((machine) => {
            if (projectData.id == machine.val().id) {
              let cheese = {
                comment: machine.val().comment,
                data: machine.val().data,
                id: machine.val().id,
                userId: machine.val().userId,
                cId: machine.val().cId
              };
              var spliteData = cheese.data
              var spliteData_b

              spliteData = spliteData.split('T');
              spliteData_b = spliteData[0].split('/');
              spliteData = spliteData[1].split(':');

              var mydate = new Date(spliteData_b[2], spliteData_b[1] - 1, spliteData_b[0], spliteData[0] - 3, spliteData[1]);



              cheese = {
                comment: cheese.comment,
                data: mydate,
                id: cheese.id,
                userId: cheese.userId,
                cId: cheese.cId,
                qtd: projectData.commentqtd
              }
             


              setResults((oldArray) => [...oldArray, cheese]);
            }

          });
        });

    }
    async function tryUser() {
      await firebase
        .database()
        .ref('users')
        .on('value', (snapshot) => {
          snapshot.forEach((machine) => {
            if (user.uid === machine.val().id) {
              let user = {
                likedpost: machine.val().likedpost
              };
              setPostArray(user.likedpost)
            }
          });
        });
    }

    async function tryConnections() {
      await firebase
        .database()
        .ref('connections')
        .on('value', (snapshot) => {
          snapshot.forEach((machine) => {
            if (projectData.id === machine.val().projectId) {
              let condata = {
                studentId: machine.val().studentId,
                teacherId: machine.val().teacherId,
                cId: machine.val().cId
              };
              setConnectionsData(condata)
            }
          });
        });
    }
    tryData()
    tryUser()
    tryConnections()
    tryComment()
  }, [])

  function likedOrNot() {
    if (postArray.indexOf(projectData.id) > -1 && projectData.likes > 0) {
      return (
        <View>
          <TouchableOpacity onPress={updateToDown} style={styles.likebutton}>
            <Ionicons name="heart" size={20} color="#fff" />
            <Text style={{ color: 'white', marginLeft: 5, fontWeight: 'bold' }}>{projectData.likes}</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (postArray.includes(projectData.id) == false) {
      return (
        <View>
          <TouchableOpacity onPress={updateToUp} style={styles.likebutton}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
            <Text style={{ color: 'white', marginLeft: 5, fontWeight: 'bold' }}>{projectData.likes}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  const renderItem = ({ item }) => (
    console.log(item),
    <CommentList data={item} />
  );

  async function updateToUp() {
    console.log(projectData.id)
    await firebase.database().ref('projects').child(projectData.id).update({ likes: projectData.likes + 1 })
      .then(() => { console.log('Likes atualizados.') })
    console.log('PostArray 1:', postArray)
    var arry = postArray;
    arry.push(id)
    setPostArray(arry)
    await firebase.database().ref('users').child(user.uid).update({ likedpost: postArray })
      .then(() => { console.log('Posts curtidos atualizados.') })
  }

  async function updateToDown() {
    await firebase.database().ref('projects').child(projectData.id).update({ likes: projectData.likes - 1 })
      .then(() => { console.log('Likes atualizados.') })
    var estados = postArray;
    var buscar = projectData.id;
    var indice = estados.indexOf(buscar);
    estados.splice(indice)
    setPostArray(estados)
    await firebase.database().ref('users').child(user.uid).update({ likedpost: postArray })
      .then(() => { console.log('Posts curtidos atualizados!') })
  }

  function compare(a, b) {
    return a.data < b.data;
  }

  var dNow = new Date();
  var localdate = dNow.getDate() + '/' + (dNow.getMonth() + 1) + '/' + dNow.getFullYear() + 'T' + dNow.getHours() + ':' + dNow.getMinutes();
  async function publishComment() {
    setCommentModal(!commentModal)
    let machine = await firebase.database().ref('comments');
    let chave = machine.push().key;
    machine.child(chave).set({
      userId: user.uid,
      id: projectData.id,
      comment: comment,
      data: localdate,
      cId: chave
    }).then(() => {
      firebase.database().ref('projects').child(projectData.id).update({ commentqtd: projectData.commentqtd + 1 })

    }).catch((error) => { console.log('err', error) })

  }

  function bolsa() {
    if (projectData.rem == 1) {
      return (<FontAwesome5 style={{ marginLeft: 0, marginRight: 10, marginTop: 10 }} name="coins" size={20} color="#ff8940" />)
    }
  }

  function certificate() {
    if (projectData.cef == 1) {
      return (<FontAwesome5 style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }} name="certificate" size={20} color="#ff8940" />)
    }
  }

  function mineOrNot() {
    if (projectData.userId == user.uid) {
      return (

        <TouchableOpacity onPress={() => {
          firebase.database().ref('projects').child(projectData.id).remove().then(() => {
            navigation.navigate('Home')
          })
        }}>
          <MaterialIcons name="delete" size={24} color="#6d0ad6" />
        </TouchableOpacity>
      )
    }
  }

  function imon() {
    if (user.tipo == 'Aluno') {
      if (connectionsData.studentId == user.uid) {
        return (
          <TouchableOpacity style={styles.botao} onPress={() => {
            firebase.database().ref('connections').child(connectionsData.cId).remove()
          }}>
            <Text style={{ color: 'white' }}>Remover candidatura</Text>
          </TouchableOpacity>

        )
      } else {
        return (<TouchableOpacity style={styles.botao} onPress={() => {
          var cNow = new Date();
          var cdate = cNow.getDate() + '/' + (cNow.getMonth() + 1) + '/' + cNow.getFullYear() + 'T' + cNow.getHours() + ':' + cNow.getMinutes();
          let machine = firebase.database().ref('connections');
          let chave = machine.push().key;
          machine.child(chave).set({
            studentId: user.uid,
            teacherId: projectData.userId,
            projectId: projectData.id,
            data: cdate,
            cId: chave
          }).then(() => {
            console.log('conexão criada.')

          }).catch((error) => { console.log('err', error) })
        }}>
          <Text style={{ color: 'white' }}>Cadastrar interesse</Text>
        </TouchableOpacity>)
      }


    } else {
      if (user.uid == projectData.userId) {
        return (
          <TouchableOpacity style={styles.botao} onPress={() => {

            navigation.navigate('Connections', { id: id })
          }}>
            <Text style={{ color: 'white' }}>Ver inscritos</Text>
          </TouchableOpacity>

        )
      }
    }
  }

  return (
    <>
      <Modal
        visible={commentModal}
        animationType={'slide'}
      >
        <Header2 titulo={"Adicione um comentário"} />
        <View
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <TextInput
            mode='outlined'
            theme={{
              colors: {
                underlineColor: '#d6d6d6', background: 'white'
              }, roundness: 8
            }}
            style={styles.TextInt}
            placeholder="Ex: Projeto legal!"
            placeholderTextColor="#d6d6d6"
            autoCorrect={false}
            autoCapitalize="sentences"
            label="Comentário"
            maxLength={200}
            multiline={true}
            onChangeText={(comment) => setComment(comment)}
          />
          <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => { publishComment() }} style={styles.likebutton}>
              <Entypo name="check" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setCommentModal(!commentModal) }} style={styles.likebutton}>
              <Feather name="x" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <Header2 titulo={"Projeto"} />
        <Card style={styles.card}>
          <Card.Content>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text>{projectData.nome}</Text>
                <Text>{projectData.usuario}</Text>
              </View>
              {mineOrNot()}
            </View>
            <Title style={{ color: '#6d0ad6' }}>{projectData.titulo}</Title>
            <Paragraph>{projectData.descricao}</Paragraph>
          </Card.Content>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              style={styles.imageBox}
              source={{
                uri: projectData.url
              }}></Image>
          </View>
          <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', padding: 10, marginLeft: 5 }}>
            {bolsa()}
            {certificate()}
            <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10, display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={{ color: '#ff8940', fontWeight: 'bold' }}>{projectData.vag}</Text>
              <FontAwesome5 style={{ marginLeft: 5 }} name="user-graduate" size={20} color="#ff8940" />
            </View>
            <View style={{ marginLeft: 220, marginRight: 10, marginTop: 10, display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={{ color: '#ff8940', fontWeight: 'bold' }}>{projectData.likes}</Text>
              <FontAwesome5 style={{ marginLeft: 5 }} name="hand-holding-heart" size={20} color="#ff8940" />
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>
            <TouchableOpacity onPress={() => { setCommentModal(!commentModal) }} style={styles.likebutton}>
              <FontAwesome name="comment" size={24} color="white" />
              <Text style={{ color: 'white', marginLeft: 5, fontWeight: 'bold' }}>{projectData.commentqtd}</Text>
            </TouchableOpacity>
            {likedOrNot()}
          </View>
          {imon()}
        </Card>
        <FlatList
          data={results.sort(compare)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  card: {
    width: '94%',
    marginLeft: '3%',
    marginTop: '1.5%',
    marginBottom: '1.5%',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#c9c9c9'
  }, imageBox: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    margin: 10
  },
  
  likebutton: {
    marginTop: 10,
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    height: 50,
    width: 80,
    borderRadius: 200,
    backgroundColor: '#852eff',
    marginBottom: 10
  }, commentModal: {
    backgroundColor: 'white',
    padding: 20
  }, TextInt: {
    height: '8%',
    width: '90%',
    marginTop: 10

  }, botao: {
    backgroundColor: '#ff8940',
    width: "50%",
    height: 40,
    margin: 10,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  }
})