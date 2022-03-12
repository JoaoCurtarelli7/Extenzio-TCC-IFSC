import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, TextInput } from 'react-native-paper';
import Header2 from '../../components/Header2'
import firebase from '../../../services/firebase'
import { Ionicons, AntDesign, FontAwesome5, Feather, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth';
import CommentList from '../CommentList';
import { useNavigation } from '@react-navigation/native';

export default function FullTopic({ route }) {

  const { user } = useContext(AuthContext);
  const { id, userId } = route.params
  const [topicData, setTopicData] = useState([])
  const [commentModal, setCommentModal] = useState(false)
  const [comment, setComment] = useState('');
  const [results, setResults] = useState([]);
  const [postArray, setPostArray] = useState([])
  const [connectionsData, setConnectionsData] = useState([])


  const navigation = useNavigation()
  var urid;
  var qtd;
  var liked = [];

  console.log(id)

  useEffect(() => {
    async function tryData() {
      await firebase
        .database()
        .ref('topics')
        .on('value', (snapshot) => {
          setTopicData([]);
          snapshot.forEach((maquina) => {
            if (id === maquina.val().id) {
              let topic = {
                descricao: maquina.val().descricao,
                nome: maquina.val().autor,
                likes: maquina.val().likes,
                usuario: maquina.val().usuario,
                titulo: maquina.val().titulo,
                id: maquina.val().id,
                userId: maquina.val().userId,
                data: maquina.val().data,
                url: maquina.val().url,
                commentqtd: maquina.val().commentqtd
              };
              setTopicData(topic)
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
            if (topicData.id == machine.val().id) {
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
                qtd: topicData.commentqtd
              }
              urid = cheese.userId


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

   
    tryData()
    tryUser()
    tryComment()
  }, [])

  function likedOrNot() {
    if (postArray.indexOf(topicData.id) > -1 && topicData.likes > 0) {
      return (
        <View>
          <TouchableOpacity onPress={updateToDown} style={styles.likebutton}>
            <Ionicons name="heart" size={20} color="#fff" />
            <Text style={{ color: 'white', marginLeft: 5, fontWeight: 'bold' }}>{topicData.likes}</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (postArray.includes(topicData.id) == false) {
      return (
        <View>
          <TouchableOpacity onPress={updateToUp} style={styles.likebutton}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
            <Text style={{ color: 'white', marginLeft: 5, fontWeight: 'bold' }}>{topicData.likes}</Text>
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
    console.log(topicData.id)
    await firebase.database().ref('topics').child(topicData.id).update({ likes: topicData.likes + 1 })
      .then(() => { console.log('Likes atualizados.') })
    console.log('PostArray 1:', postArray)
    var arry = postArray;
    arry.push(id)
    setPostArray(arry)
    await firebase.database().ref('users').child(user.uid).update({ likedpost: postArray })
      .then(() => { console.log('Posts curtidos atualizados.') })
  }

  async function updateToDown() {
    await firebase.database().ref('topics').child(topicData.id).update({ likes: topicData.likes - 1 })
      .then(() => { console.log('Likes atualizados.') })
    var estados = postArray;
    var buscar = topicData.id;
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
      id: topicData.id,
      comment: comment,
      data: localdate,
      cId: chave
    }).then(() => {
      firebase.database().ref('topics').child(topicData.id).update({ commentqtd: topicData.commentqtd + 1 })

    }).catch((error) => { console.log('err', error) })

  }

  function mineOrNot() {
    if (topicData.userId == user.uid) {
      return (

        <TouchableOpacity onPress={() => {
          firebase.database().ref('topics').child(topicData.id).remove().then(() => {
            navigation.navigate('Home')
          })
        }}>
          <MaterialIcons name="delete" size={24} color="#6d0ad6" />
        </TouchableOpacity>
      )
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
            placeholder="Ex: Boa ideia!"
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
        <Header2 titulo={"Tópicos"} />
          <Card style={styles.card}>
            <Card.Content>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text>{topicData.nome}</Text>
                  <Text>{topicData.usuario}</Text>
                </View>
                {mineOrNot()}
              </View>
              <Title style={{ color: '#6d0ad6' }}>{topicData.titulo}</Title>
              <Paragraph>{topicData.descricao}</Paragraph>
            </Card.Content>
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                style={styles.imageBox}
                source={{
                  uri: topicData.url
                }}></Image>
            </View>
          
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>
              <TouchableOpacity onPress={() => { setCommentModal(!commentModal) }} style={styles.likebutton}>
                <FontAwesome name="comment" size={24} color="white" />
                <Text style={{ color: 'white', marginLeft: 5, fontWeight: 'bold' }}>{topicData.commentqtd}</Text>
              </TouchableOpacity>
              {likedOrNot()}
            </View>
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
  }, likebutton: {
    marginTop: 10,
    marginLeft: 10,
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
    width: 375,
    height: 40,
    margin: 10,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})