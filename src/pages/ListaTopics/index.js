import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Input, Item } from "native-base";


export default function ListaTopics({ data }) {
    const navigation = useNavigation()
    console.log('id:',data.id)
    function fulltopic() {
        navigation.navigate('FullTopic', {
            id: data.id
        })
    }
    function profiles() {
        navigation.navigate('PersonProfile', { userId: data.userId })
    }


    var desc = data.descricao
    var tres = '...'
    desc = desc.substring(0, 105)
    if (desc.length >= 105) {
        desc = desc.concat(tres)
    }



    return (
        <View>
            <Card style={styles.card}>
                <Card.Content>
                    <TouchableOpacity onPress={fulltopic}>
                        <Title style={{ color: '#6d0ad6' }}>{data.titulo}</Title>
                        <Text style={styles.txt}>{data.descricao}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={profiles}>
                        <Text style={styles.txt_b}>{data.nome}</Text>
                        <Text style={styles.txt_b2}>{data.usuario}</Text>
                    </TouchableOpacity>
                </Card.Content>
            </Card>

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '93%',
        marginLeft: '3%',
        marginTop: '1.5%',
        marginBottom: '1.5%',
        borderWidth: 0.5,
        borderColor: '#c9c9c9',

    },
    txt: {
        fontSize: 15,
    },
    txt_b: {
        fontSize: 15,
        fontStyle: 'italic',
        fontWeight: 'bold'

    },
    txt_b2: {
        fontSize: 10,
        fontStyle: 'italic',

    },

})