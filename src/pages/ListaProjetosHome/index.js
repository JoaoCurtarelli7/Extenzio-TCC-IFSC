import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, AntDesign, FontAwesome5 } from '@expo/vector-icons';

export default function ListaProjetosHome({ data }) {
    const navigation = useNavigation()


    function fullproject() {
        navigation.navigate('FullProject', { id: data.id, userId: data.userId })
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

    function bolsa() {
        if (data.rem == 1) {
            return (<FontAwesome5 style={{ marginLeft: 0, marginRight: 10, marginTop: 10 }} name="coins" size={20} color="#ff8940" />)
        }
    }

    function certificate() {
        if (data.cef == 1) {
            return (<FontAwesome5 style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }} name="certificate" size={20} color="#ff8940" />)
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={fullproject}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={{color: '#6d0ad6'}}>{data.titulo}</Title>
                        <Paragraph>{desc}</Paragraph>
                        <TouchableOpacity onPress={profiles}>
                            <Text style={styles.txt}>{data.nome}</Text>
                            <Text style={styles.txt_b}>{data.usuario}</Text>
                        </TouchableOpacity>
                        <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                            {bolsa()}
                            {certificate()}
                            <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10, display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{color: '#ff8940', fontWeight: 'bold'}}>{data.vag}</Text>
                                <FontAwesome5 style={{ marginLeft: 5}} name="user-graduate" size={20} color="#ff8940" />
                            </View>
                            <View style={{ marginLeft:'58%' , marginTop: 10, display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{color: '#ff8940', fontWeight: 'bold'}}>{data.likes}</Text>
                                <FontAwesome5 style={{ marginLeft: 5 }} name="hand-holding-heart" size={20} color="#ff8940" />
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        </View>
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
    },
    txt: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    txt_b: {
        fontSize: 10,
        fontStyle: 'italic'
    }
})