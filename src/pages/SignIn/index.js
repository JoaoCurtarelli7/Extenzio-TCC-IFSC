import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView, StatusBar } from 'react-native';
import { TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth'
import { Entypo } from '@expo/vector-icons';

export default function SignIn() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);
  function logar() {
    signIn(email, password)
  }



  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={'#5e35b1'}
      >
      </StatusBar>

      <KeyboardAvoidingView behavior>

      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Entypo name="network" size={200} color="white" />
      </View>

      <Text style={styles.text}>Bem-vindo! <Text style={styles.text2}>Faça Login</Text></Text>
      <Text style={styles.text3}>com suas credenciais.</Text>

      <TextInput
        style={styles.TextInt}
        placeholder="E-mail"
        placeholderTextColor="black"
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        >
      </TextInput>

      <TextInput
        style={styles.TextInt_b}
        placeholder="Senha"
        placeholderTextColor="black"
        onChangeText={(text) => setPassword(text)}
        autoCorrect={false}
        autoCapitalize="none"
        secureTextEntry={visible} 
        right={
          <TextInput.Icon color={'#5e35b1'} onPress={() => {setVisible(!visible)}} name="eye" />
        }
        />

      <TouchableOpacity style={styles.btn} onPress={logar}>
        <Text style={styles.text4}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.text5}>Ainda nao tem uma conta?</Text>
        <Text style={styles.text5}>Cadastre-se aqui.</Text>
      </TouchableOpacity>

          </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5e35b1',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center'
  },
  TextInt: {
    color: 'white',
    backgroundColor: 'white',
    height: '8%',
    width: '60%',
    marginLeft: '20%',
    marginTop: '3%',
  },
  TextInt_b: {
    color: 'black',
    backgroundColor: 'white',
    height: '8%',
    width: '60%',
    marginLeft: '20%',
    marginTop: '3%',
    marginBottom: '3%',
  },

  logo: {
    marginBottom: '10%',
    marginTop: '20%',
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },
  text2: {
    fontWeight: 'normal',
    fontSize: 18,
    color: 'white'
  },
  text3: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white'
  },
  btn: {
    display: 'flex',
    backgroundColor: '#280680',
    alignItems: 'center',
    borderRadius: 5,
    height: '8%',
    width: '30%',
    justifyContent: 'center',
    marginLeft: '35%'
  },
  text4: {
    color: 'white',
    fontSize: 17
  },
  text5: {
    textAlign: 'center',
    color: 'white'
  },
  btn2: {
    marginTop: '3%'
  }
})