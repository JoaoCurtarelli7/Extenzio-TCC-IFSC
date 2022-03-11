import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, StatusBar, FlatList } from 'react-native';
import { TextInput } from 'react-native-paper';
import { AuthContext } from '../../contexts/auth'
import { useNavigation } from '@react-navigation/native';
import { FAB } from 'react-native-paper'
import Header2 from '../../components/Header2'
import ConnectionsList from '../ConnectionsList';
import firebase from '../../../services/firebase'

export default function Connections({ route }) {

    const { id } = route.params
    const [connec, setConnec] = useState([])
    const navigation = useNavigation()
    const [search, setSearch] = useState('')
    const { user } = useContext(AuthContext)

    useEffect(() => {
        async function connectionsList() {
            await firebase
                .database()
                .ref('connections')
                .on('value', (snapshot) => {
                    setConnec([]);
                    snapshot.forEach((maquina) => {
                        if(id == maquina.val().projectId){
                            let connection = {
                                studentId: maquina.val().studentId,
                            }
                            setConnec((oldArray) => [...oldArray, connection])
                        }

                    });
                });
        }
        connectionsList()
    }, [])

    console.log(id)

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
        <ConnectionsList data={item} />
    );
    return (

        <View style={styles.container}>
            <StatusBar
                backgroundColor={'#420680'}
            />
            <Header2 titulo={'Alunos inscritos neste projeto'} />
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
                    data={connec}
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
        marginLeft: '10%'
    }
})