import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Platform,

} from 'react-native'


export default function Header({ titulo = 'EXTENZIO' }) {

    return (
        <View style={styles.container}>
            <Text style={styles.texto}>{titulo}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: '12%',
        alignItems: 'center',
        justifyContent: 'center',

    },
    texto: {
        fontSize: 35,
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

