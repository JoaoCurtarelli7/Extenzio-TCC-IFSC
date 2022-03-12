import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, StatusBar, FlatList, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { AuthContext } from '../../contexts/auth'
import { useNavigation } from '@react-navigation/native';
import { FAB } from 'react-native-paper'
import Header from '../../components/Header'
import ListaProjetosHome from '../ListaProjetosHome'
import firebase from '../../../services/firebase'

export default function Home() {
    const [proj, setProj] = useState([])
    const navigation = useNavigation()
    const [search, setSearch] = useState('')
    const { user } = useContext(AuthContext)

    console.log(user.initials)

    useEffect(() => {
        async function projectsList() {
            await firebase
                .database()
                .ref('projects')
                .on('value', (snapshot) => {
                    setProj([]);
                    snapshot.forEach((maquina) => {
                        let projeto = {
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
                            vag: maquina.val().vag
                        };

                        var spliteData = projeto.data
                        var spliteData_b

                        spliteData = spliteData.split('T');
                        spliteData_b = spliteData[0].split('/');
                        spliteData = spliteData[1].split(':');

                        var mydate = new Date(spliteData_b[2], spliteData_b[1] - 1, spliteData_b[0], spliteData[0] - 3, spliteData[1]);

                        projeto = {
                            descricao: maquina.val().descricao,
                            nome: maquina.val().autor,
                            likes: maquina.val().likes,
                            usuario: maquina.val().usuario,
                            titulo: maquina.val().titulo,
                            tipo: maquina.val().tipo,
                            id: maquina.val().id,
                            userId: maquina.val().userId,
                            data: mydate,
                            rem: maquina.val().rem,
                            cef: maquina.val().cef,
                            vag: maquina.val().vag
                        };


                        setProj((oldArray) => [...oldArray, projeto]);

                    });
                });
        }
        projectsList()
    }, [])

    function filtro(value) {
        if (user.initials.includes(value.tipo)) {
            if (search === '') {
                return value;
            } else {
                var str = value.descricao
                if (str.match(search)) {
                    return value;
                }
            }
        }
    }

    function compare(a, b) {
        return a.data < b.data;
    }

    const renderItem = ({ item }) => (
        <ListaProjetosHome data={item} />
    );
    return (

        <View style={styles.container}>
            <StatusBar
                backgroundColor={'#420680'}
            />
            <View style={styles.header}>
                <Text style={styles.texto}>Projetos</Text>
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
                    data={proj.filter(filtro).sort(compare)}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />

            </ScrollView>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        display: "flex",
        flexDirection: 'column',
        width: '100%'
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
        borderColor: 'black',
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