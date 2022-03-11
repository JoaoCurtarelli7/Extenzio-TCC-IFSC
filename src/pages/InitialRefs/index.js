import React, { useState } from 'react';
import { View } from 'react-native';
import { Chip } from 'react-native-paper'

export default function InitialRefs() {
  const [IntS, setIntS] = useState([]);
 return (
   <View>
        <Chip icon="information" onPress={() => console.log('Pressed')}>Example Chip</Chip>
   </View>
  );
}