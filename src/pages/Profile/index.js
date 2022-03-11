import React, { useContext, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, ScrollView, Modal, TouchableOpacity, Linking, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header2 from '../../components/Header2'
import * as ImagePicker from 'expo-image-picker'
import { Avatar, Divider, Button, TextInput } from 'react-native-paper';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth'
import firebase from '../../../services/firebase';


export default function Profile() {

    const { user } = useContext(AuthContext)
    const { signOut } = useContext(AuthContext);
    const navigation = useNavigation()

    const [image, setImage] = useState(user.url)
    const [bio1, setBio1] = useState(user.bio);
    const [formacao1, setFormacao1] = useState(user.formacao);
    const [show, setShow] = useState(true);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPassword_b, setNewPassword_b] = useState('')
    const [local, setLocal] = useState(user.initials)

    var url = ''
    var array = []
    var string = ''

    const changeShow = () => {
        setShow(previousState => !previousState);
    }




    // function infoChip() {

    //     if (local.indexOf('Informática') > -1) {
    //         return (<TouchableOpacity style={styles.pressedChip} onPress={() => {

    //             array = local 

    //             console.log('Antes: ',array);

    //             const index = array.indexOf('Informática');
    //             if (index > -1) {
    //                 array.splice(index, 1);
    //             }

    //             console.log('Depois: ',array)
    //             setLocal(array)
    //             console.log('Local', local)
    //         }}>
    //             <MaterialIcons name="cancel" size={24} style={{ marginLeft: 10, marginRight: '20%' }} color="#737373" />
    //             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    //                 <MaterialIcons name="computer" size={30} color="#737373" />
    //                 <Text style={{ marginLeft: 10 }}>Informática</Text>
    //             </View>
    //         </TouchableOpacity>)
    //     } else {
    //         return (<TouchableOpacity style={styles.chip} onPress={() => {

    //             array = local

    //             console.log(array);

    //             array.push('Informática')

    //             console.log(array);

    //             setLocal(array)
    //         }}>
    //             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    //                 <MaterialIcons name="computer" size={30} color="#808080" />
    //                 <Text style={{ marginLeft: 10, color: '#808080' }}>Informática</Text>
    //             </View>
    //         </TouchableOpacity>)
    //     }
    // }

    // function mecChip() {
    //     if (mecanica) {
    //         return (<TouchableOpacity style={styles.pressedChip} onPress={() => {
    //             setMecanica(!mecanica)
    //         }}>
    //             <MaterialIcons name="cancel" size={24} style={{ marginLeft: 10, marginRight: '20%' }} color="#737373" />
    //             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    //                 <MaterialIcons name="engineering" size={30} color="#737373" />
    //                 <Text style={{ marginLeft: 10 }}>Mecânica</Text>
    //             </View>
    //         </TouchableOpacity>)
    //     } else {
    //         return (<TouchableOpacity style={styles.chip} onPress={() => {
    //             setMecanica(true)
    //         }}>
    //             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    //                 <MaterialIcons name="engineering" size={30} color="#808080" />
    //                 <Text style={{ marginLeft: 10, color: '#808080' }}>Mecânica</Text>
    //             </View>
    //         </TouchableOpacity>)
    //     }
    // }

    // function foodChip() {
    //     if (alimentos) {
    //         return (<TouchableOpacity style={styles.pressedChip} onPress={() => {
    //             setAlimentos(!alimentos)
    //         }}>
    //             <MaterialIcons name="cancel" size={24} style={{ marginLeft: 10, marginRight: '20%' }} color="#737373" />
    //             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    //                 <MaterialIcons name="fastfood" size={30} color="#737373" />
    //                 <Text style={{ marginLeft: 10 }}>Alimentos</Text>
    //             </View>
    //         </TouchableOpacity>)
    //     } else {
    //         return (<TouchableOpacity style={styles.chip} onPress={() => {
    //             setAlimentos(true)
    //         }}>
    //             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    //                 <MaterialIcons name="fastfood" size={30} color="#808080" />
    //                 <Text style={{ marginLeft: 10, color: '#808080' }}>Alimentos</Text>
    //             </View>
    //         </TouchableOpacity>)
    //     }
    // }

    function addedOrPart() {
        if (user.tipo == 'Professor') {
            return (
                <TouchableOpacity onPress={() => { navigation.navigate('MyProjects') }} style={styles.button}>
                    <Text style={{ marginTop: '1%', fontWeight: 'bold', color: 'white' }}>Projetos que cadastrei</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => { navigation.navigate('MyProjects') }} style={styles.button}>
                    <Text style={{ marginLeft: '1%', fontWeight: 'bold', color: 'white' }}>Projetos que me inscrevi</Text>
                </TouchableOpacity>
            )
        }
    }

    const alterarInfo = () => {
        if (bio1 !== '' && formacao1 !== '') {
            firebase
                .database()
                .ref("users")
                .once("value", (snapshot) => {
                    snapshot.forEach((usuario) => {

                        if (user.id === usuario.val().uid) {
                            firebase.database().ref(`users/${user.id}`).update({
                                bio: bio,
                                formacao: formacao
                            });
                            alert(`DADOS ATUALIZADOS ${user.nome}`)
                        }
                    });
                })
            changeShow();
        } else {
            alert('Preencha todos os campos')
        }
    }





    async function load() {
        try {
            let response = await firebase.storage().ref('users').child(string).getDownloadURL();
            console.log('response', response)
            url = response
            firebase.database().ref('users').child(user.uid).update({
                nome: name,
                url: url,
                bio: bio
            })
            setModal(!modal)
            signOut()
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



    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={'#420680'}
            />
            <Header2 titulo={user.nome} />
            <ScrollView style={styles.scroll}>
                <View style={styles.personContainer}>
                    <Avatar.Image size={100} source={{ uri: user.url }} />
                    <View style={{ marginLeft: '5%' }}>
                        <Text style={styles.name}>{user.nome}</Text>
                        <Text style={styles.user}>{user.usuario}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { setModal(!modal) }} style={{ backgroundColor: '#6d0ad6', padding: 10, borderRadius: 40, marginLeft: '20%' }}>
                        <Feather name="edit" size={14} color="white" />
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={modal}
                    animationType={'slide'}

                >


                    <ScrollView>

                        <View style={styles.header}>
                            <Text style={styles.texto}>Editando o perfil</Text>
                        </View>


                        <TextInput
                            mode='outlined'
                            theme={{
                                colors: {
                                    underlineColor: '#d6d6d6', background: 'white'
                                }, roundness: 8
                            }}
                            style={styles.TextInt}
                            placeholder="Ex: Gledisvaldo"
                            placeholderTextColor="#d6d6d6"
                            autoCorrect={false}
                            autoCapitalize="sentences"
                            label="Nome"
                            defaultValue={user.name}
                            onChangeText={(text) => setName(text)}
                        />

                        <TextInput
                            mode='outlined'
                            theme={{
                                colors: {
                                    underlineColor: '#d6d6d6', background: 'white'
                                }, roundness: 8
                            }}
                            style={styles.TextInt}
                            placeholder="Ex: Se você não tem bio, coloque aqui!"
                            placeholderTextColor="#d6d6d6"
                            autoCorrect={false}
                            autoCapitalize="sentences"
                            label="Bio"
                            defaultValue={user.bio}
                            onChangeText={(text) => setBio(text)}
                        />



                        <View style={styles.imageSection}>
                            <Image
                                style={styles.imageBox}
                                source={{
                                    uri: user.url
                                }}></Image>

                            <TouchableOpacity style={styles.gBtn} onPress={pickImage}>
                                <Text style={styles.txt_b}>Selecionar imagem</Text>
                                <Ionicons name="images" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* <TextInput
                            mode='outlined'
                            theme={{
                                colors: {
                                    underlineColor: '#d6d6d6', background: 'white'
                                }, roundness: 8
                            }}
                            style={styles.TextInt}
                            placeholder="Digite aqui sua senha antiga para salvar as alterações!"
                            placeholderTextColor="#d6d6d6"
                            autoCorrect={false}
                            autoCapitalize="sentences"
                            label="Senha antiga"
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                        />

                        <TextInput
                            mode='outlined'
                            theme={{
                                colors: {
                                    underlineColor: '#d6d6d6', background: 'white'
                                }, roundness: 8
                            }}
                            style={styles.TextInt}
                            placeholder="Se você não deseja alterar, não escreva nada!"
                            placeholderTextColor="#d6d6d6"
                            autoCorrect={false}
                            autoCapitalize="none"
                            label="Nova senha"
                            secureTextEntry={true}
                            onChangeText={(text) => setNewPassword(text)}
                        />

                        <TextInput
                            mode='outlined'
                            theme={{
                                colors: {
                                    underlineColor: '#d6d6d6', background: 'white'
                                }, roundness: 8
                            }}
                            style={styles.TextInt}
                            placeholder="Se você não deseja alterar, não escreva nada!"
                            placeholderTextColor="#d6d6d6"
                            autoCorrect={false}
                            autoCapitalize="none"
                            label="Confirme a nova senha"
                            secureTextEntry={true}
                            onChangeText={(text) => setNewPassword_(text)}
                        /> */}

                        {/* {infoChip()} */}
                        {/* {mecChip()}
                        {foodChip()} */}
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => { setModal(!modal) }} style={styles.closeButton}>
                                <Feather name="x" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { uploadImg() }} style={styles.closeButton}>
                              <Feather name="check" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
                <View style={styles.bioContainer}>
                    <Text style={{ marginRight: '93%', fontWeight: 'bold', fontSize: 16, color: '#6d0ad6' }}>Bio:</Text>
                    <Text style={{ textAlign: 'left', marginLeft: '-92%' }}>{user.bio}</Text>
                </View>
                <View style={{
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#6d0ad6',
                    paddingBottom: 10
                }}>
                    <Text style={{ margin: '3%', fontWeight: 'bold', fontSize: 16, color: '#6d0ad6' }}>Campus atuante e contato:</Text>
                    <TouchableOpacity style={styles.info} onPress={() => Linking.openURL('mailto:' + user.email + '?subject=&body=')}>
                        <Ionicons color={'#6d0ad6'} name="mail-outline" size={25} />
                        <Text style={{ marginLeft: '1%', fontWeight: 'bold' }}>{user.email}</Text>
                    </TouchableOpacity>
                    <View style={styles.info}>
                        <Ionicons name="school-outline" color={'#6d0ad6'} size={25} />
                        <Text style={{ marginLeft: '1%', fontWeight: 'bold' }}>{user.escola}</Text>
                    </View>
                </View>
                {addedOrPart()}
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
    }, closeButton: {
        backgroundColor: '#6d0ad6',
        padding: 10,
        borderRadius: 40,
        marginLeft: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        marginRight: -80,
        marginTop: 5
      
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
        fontSize: 24,
        textAlign: 'center',
        margin: '3%',
        color: '#fff',
        fontWeight: 'bold'
    }, button: {
        backgroundColor: '#6d0ad6',
        padding: 10,
        borderRadius: 40,
        marginTop: '5%',
        marginLeft: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%'
    },
    TextInt: {
        height: '8%',
        width: '90%',
        marginTop: 10,
        marginLeft: '5%'
    }, gBtn: {
        height: '100%',
        borderRadius: 15,
        backgroundColor: "#6d0ad6",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10,
        marginLeft: '3%',

    },
    imageBox: {
        width: 200,
        height: 200,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
    },
    imageSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    }, txt_b: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 10
    }, chip: {
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
    }
})