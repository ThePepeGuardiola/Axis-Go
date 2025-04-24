import React, { useState } from 'react';
import { View, Text, Button, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const BirthdatePicker = () => {
  const [birthdate, setBirthdate] = useState<Date | undefined>(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setBirthdate(selectedDate);
    }
  };

  const formattedDate = birthdate
    ? birthdate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

  return (
    <View>
      <Text>Fecha de nacimiento</Text>
      <TouchableOpacity onPress={() => setShow(true)} style={{ padding: 10, borderWidth: 1 }}>
        <Text>{formattedDate || 'Selecciona una fecha'}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={birthdate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default BirthdatePicker;