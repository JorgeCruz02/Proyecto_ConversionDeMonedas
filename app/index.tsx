import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CountryFlag from 'react-native-country-flag';
import axios from 'axios';
import { Endpoints } from '@/constants/Endpoints';

// Mapeo de monedas a códigos de país
const currencyToCountryCode: Record<string, string> = {
  USD: 'US',
  EUR: 'EU',
  GBP: 'GB',
  JPY: 'JP',
  MXN: 'MX',
  CAD: 'CA',
  AUD: 'AU',
  CNY: 'CN',
  INR: 'IN',
  BRL: 'BR',
  KRW: 'KR',
  ZAR: 'ZA',
  // Agregar más monedas según sea necesario
};

const App: React.FC = () => {
  const [amount, setAmount] = useState<string>('1.00'); // Monto a convertir
  const [fromCurrency, setFromCurrency] = useState<string>('USD'); // Moneda de origen
  const [toCurrency, setToCurrency] = useState<string>('EUR'); // Moneda de destino
  const [currencies, setCurrencies] = useState<string[]>([]); // Lista de monedas
  const [exchangeRate, setExchangeRate] = useState<number | null>(null); // Tasa de cambio
  const [convertedAmount, setConvertedAmount] = useState<string>(''); // Valor convertido
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency]);

  const fetchCurrencies = async () => {
    console.log('[INFO]: Solicitando lista de monedas...');
    try {
      const response = await axios.get(Endpoints.DIVISA_DEFAULT);
      const currencyList = Object.keys(response.data.rates);
      setCurrencies(currencyList);
      console.log('[SUCCESS]: Lista de monedas obtenida.');
    } catch (error) {
      console.error('[ERROR]: Error al obtener la lista de monedas', error);
      Alert.alert('Error', 'No se pudo obtener la lista de monedas.');
    }
  };

  const fetchExchangeRate = async () => {
    setIsLoading(true);
    console.log(`[INFO]: Solicitando tasa de cambio de ${fromCurrency} a ${toCurrency}`);
    try {
      const API_URL = Endpoints.DIVISA;
      const response = await axios.get(`${API_URL}${fromCurrency}`);
      const rate = response.data.rates[toCurrency];
      if (rate) {
        setExchangeRate(rate);
        console.log(`[SUCCESS]: Tasa de cambio obtenida: ${rate}`);
      } else {
        console.error('[ERROR]: No se encontró la tasa de cambio para las monedas seleccionadas.');
        Alert.alert('Error', 'No se encontró la tasa de cambio para las monedas seleccionadas.');
      }
    } catch (error) {
      console.error('[ERROR]: Error al obtener datos de la API', error);
      Alert.alert('Error', 'Hubo un problema al obtener los datos de la API.');
    } finally {
      setIsLoading(false);
      console.log('[INFO]: Finalizó la solicitud de la tasa de cambio.');
    }
  };

  const handleConvert = () => {
    if (!exchangeRate) {
      console.error('[ERROR]: Tasa de cambio no disponible. Asegúrate de que las monedas sean válidas.');
      Alert.alert('Error', 'Por favor, selecciona monedas válidas y espera que se cargue la tasa de cambio.');
      return;
    }
    try {
      const result = (parseFloat(amount) * exchangeRate).toFixed(2);
      setConvertedAmount(result);
      console.log(
        `[INFO]: Conversión realizada: ${amount} ${fromCurrency} = ${result} ${toCurrency}`
      );
    } catch (error) {
      console.error('[ERROR]: Error durante la conversión', error);
      Alert.alert('Error', 'Ocurrió un problema durante la conversión.');
    }
  };

  const handleSwapCurrencies = () => {
    // Intercambia monedas
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);

    // Intercambia montos
    if (convertedAmount) {
      const tempAmount = parseFloat(convertedAmount).toFixed(2);
      setAmount(tempAmount);
      setConvertedAmount('');
    }
    console.log('[INFO]: Monedas y montos invertidos');
  };

  const handleAmountChange = (input: string) => {
    // Permitir solo números positivos con hasta dos decimales
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(input)) {
      setAmount(input);
    } else {
      console.log('[WARNING]: Entrada inválida', input);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Convertidor de Divisas</Text>

      <Text style={styles.label}>De</Text>
      <Picker
        selectedValue={fromCurrency}
        onValueChange={(itemValue) => setFromCurrency(itemValue)}
        style={styles.picker}
      >
        {currencies.map((currency) => (
          <Picker.Item
            label={`${currency} `}
            value={currency}
            key={currency}
            style={styles.pickerItem}
          >
            <CountryFlag isoCode={currencyToCountryCode[currency] || 'US'} size={20} />
          </Picker.Item>
        ))}
      </Picker>

      <Text style={styles.label}>Monto</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={handleAmountChange}
        placeholder="Ingresa el monto"
      />

      <Text style={styles.label}>A</Text>
      <Picker
        selectedValue={toCurrency}
        onValueChange={(itemValue) => setToCurrency(itemValue)}
        style={styles.picker}
      >
        {currencies.map((currency) => (
          <Picker.Item
            label={`${currency} `}
            value={currency}
            key={currency}
            style={styles.pickerItem}
          >
            <CountryFlag isoCode={currencyToCountryCode[currency] || 'US'} size={20} />
          </Picker.Item>
        ))}
      </Picker>

      <Text style={styles.label}>Monto Convertido</Text>
      <TextInput
        style={[styles.input, styles.readOnlyInput]}
        value={convertedAmount}
        editable={false}
        placeholder="Resultado"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleSwapCurrencies} style={styles.swapButton}>
          <Text style={styles.swapText}>↔ Invertir</Text>
        </TouchableOpacity>
        <Button
          title={isLoading ? 'Cargando...' : 'Convertir'}
          onPress={handleConvert}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  picker: {
    width: '100%',
    marginBottom: 20,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readOnlyInput: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  swapButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  swapText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App
