import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Platform,

} from 'react-native'

import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'

export default function Header({titulo='EXTENZIO'}) {
        const navigation = useNavigation();
        return(
            <View style={styles.container}>
                <Appbar.BackAction color={'#fff'} onPress={() => navigation.goBack()}/>
                <Text style={styles.texto}>{titulo}</Text>
                <View></View>
            </View>
        )
        }

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: 'row',
        backgroundColor: '#6d0ad6'
    },
    texto: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: '3%',
        color: '#fff'
    }

})

