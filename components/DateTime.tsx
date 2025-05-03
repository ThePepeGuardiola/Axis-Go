import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import './DateTime.css';

type BirthdatePickerProps = {
  value: Date | undefined;
  onChange: (date: Date) => void;
};

const BirthdatePicker = ({ value, onChange }: BirthdatePickerProps) => {
  const [show, setShow] = useState(false);

  const formattedDate =
    value instanceof Date && !isNaN(value.getTime())
      ? value.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '';

  if (Platform.OS === 'web') {
    return (
      <div className='input-container'>
        <input
          className="date-input"
          value={value ? value.toISOString().split('T')[0] : ''}
          onChange={e => {
            const date = new Date(e.target.value);
            if (!isNaN(date.getTime())) onChange(date);
          }}
        />
      </div>
    );
  }

  return (
    <View style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: '47%' }}>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={styles.input}
      >
        <Text style={{ fontSize: 16 }}>{formattedDate || 'Selecciona una fecha'}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFEEF1',
    height: 65,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderWidth: 0,
    width: '100%',
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    color: '#000',
  }
});

export default BirthdatePicker;