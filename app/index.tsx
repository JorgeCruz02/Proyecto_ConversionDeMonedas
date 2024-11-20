import React, { useState, useEffect } from 'react';
import { View,  StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card, Divider, Provider as PaperProvider, configureFonts, DefaultTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Endpoints } from '@/constants/Endpoints';

// Mapeo de monedas a nombres y códigos de país
const currencyData: Record<string, { name: string; countryCode: string }> = {
  USD: { name: "Dólar estadounidense", countryCode: "US" },
  EUR: { name: "Euro", countryCode: "EU" },
  JPY: { name: "Yen japonés", countryCode: "JP" },
  GBP: { name: "Libra esterlina", countryCode: "GB" },
  MXN: { name: "Peso mexicano", countryCode: "MX" },
  CAD: { name: "Dólar canadiense", countryCode: "CA" },
  AUD: { name: "Dólar australiano", countryCode: "AU" },
  CNY: { name: "Yuan chino", countryCode: "CN" },
  INR: { name: "Rupia india", countryCode: "IN" },
};

const App: React.FC = () => {
  const [amount, setAmount] = useState<string>('1.00'); // Monto a convertir
  const [fromCurrency, setFromCurrency] = useState<string>('USD'); // Moneda de origen
  const [toCurrency, setToCurrency] = useState<string>('EUR'); // Moneda de destino
  const [exchangeRate, setExchangeRate] = useState<number | null>(null); // Tasa de cambio
  const [convertedAmount, setConvertedAmount] = useState<string>(''); // Valor convertido

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency, amount]); // Actualiza la conversión en tiempo real

  const fetchExchangeRate = async () => {
    console.log(`[INFO]: Solicitando tasa de cambio de ${fromCurrency} a ${toCurrency}`);
    try {
      const API_URL = Endpoints.DIVISA;
      const response = await axios.get(`${API_URL}${fromCurrency}`);
      const rate = response.data.rates[toCurrency];
      if (rate) {
        setExchangeRate(rate);
        calculateConvertedAmount(rate);
        console.log(`[SUCCESS]: Tasa de cambio obtenida: ${rate}`);
      } else {
        console.error('[ERROR]: No se encontró la tasa de cambio para las monedas seleccionadas.');
        Alert.alert('Error', 'No se encontró la tasa de cambio para las monedas seleccionadas.');
      }
    } catch (error) {
      console.error('[ERROR]: Error al obtener datos de la API', error);
      Alert.alert('Error', 'Hubo un problema al obtener los datos de la API.');
    }
  };

  const calculateConvertedAmount = (rate: number) => {
    if (!rate || !amount) {
      setConvertedAmount('');
      return;
    }
    try {
      const result = (parseFloat(amount) * rate).toFixed(2);
      setConvertedAmount(result);
      console.log(`[INFO]: Conversión realizada: ${amount} ${fromCurrency} = ${result} ${toCurrency}`);
    } catch (error) {
      console.error('[ERROR]: Error durante la conversión', error);
    }
  };

  const handleAmountChange = (input: string) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(input)) {
      setAmount(input);
    } else {
      console.log('[WARNING]: Entrada inválida', input);
    }
  };

  const handleSwapCurrencies = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);

    if (convertedAmount) {
      setAmount(convertedAmount);
      setConvertedAmount('');
    }
    console.log('[INFO]: Monedas y montos invertidos');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Convertidor de Divisas</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Monto</Text>
          <TextInput
            mode="outlined"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="Ingresa el monto"
          />

          <Text style={styles.label}>De</Text>
          <Picker
            selectedValue={fromCurrency}
            onValueChange={(itemValue) => setFromCurrency(itemValue)}
            style={styles.picker}
          >
            {Object.entries(currencyData).map(([code, { name }]) => (
              <Picker.Item label={`${name} (${code})`} value={code} key={code} />
            ))}
          </Picker>

          <Text style={styles.label}>A</Text>
          <Picker
            selectedValue={toCurrency}
            onValueChange={(itemValue) => setToCurrency(itemValue)}
            style={styles.picker}
          >
            {Object.entries(currencyData).map(([code, { name }]) => (
              <Picker.Item label={`${name} (${code})`} value={code} key={code} />
            ))}
          </Picker>

          <Divider style={styles.divider} />
          <Text style={styles.convertedAmountLabel}>Monto Convertido:</Text>
          <Text style={styles.convertedAmount}>{convertedAmount || '---'}</Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonRow}>
        <Button icon="swap-horizontal" mode="contained" onPress={handleSwapCurrencies}>
          Invertir Monedas
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    paddingTop: 30,
  },
  card: {
    marginVertical: 20,
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  picker: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginVertical: 10,
  },
  divider: {
    marginVertical: 10,
  },
  convertedAmountLabel: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  convertedAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007bff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});


export default App;
