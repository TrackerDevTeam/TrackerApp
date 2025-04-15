import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { decode } from 'base-64';
import Header from '../components/common/Header';
import styles from './styles/WatchScreen.styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UUIDs du service et de la caractéristique BLE
const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "abcd1234-1234-1234-1234-abcdef123456";

const WatchScreen = () => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [spo2, setSpo2] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        await requestPermissions();
      }

      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          scanDevices();
          subscription.remove();
        }
      }, true);
    };

    init();

    return () => {
      manager.destroy();
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      const allGranted = Object.values(granted).every(value => value === PermissionsAndroid.RESULTS.GRANTED);
      if (!allGranted) {
        console.warn("Certaines permissions Bluetooth n'ont pas été accordées.");
      }
    } catch (err) {
      console.warn("Erreur lors de la demande de permissions :", err);
    }
  };

  const scanDevices = () => {
    setDevices([]);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Erreur du scan:", error);
        return;
      }
      if (device && device.name && device.name.includes("M5Stack")) {
        setDevices(prevDevices => {
          if (!prevDevices.find(d => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  const connectToDevice = async (device) => {
    try {
      const connected = await device.connect();
      setConnectedDevice(connected);
      await connected.discoverAllServicesAndCharacteristics();
      connected.monitorCharacteristicForService(SERVICE_UUID, CHARACTERISTIC_UUID, (error, characteristic) => {
        if (error) {
          console.log("Erreur lors de la surveillance:", error);
          connectToDevice(device);
          return;
        }
        const data = characteristic.value;
        if (data) {
          try {
            const decodedData = decode(data);
            let sensorValues;
            try {
              sensorValues = JSON.parse(decodedData);
            } catch (e) {
              console.log("Erreur de parsing JSON:", e);
              return;
            }
            setHeartRate(sensorValues.hr || null);
            setSpo2(sensorValues.spo2 || null);
          } catch (e) {
            console.log("Erreur de décodage:", e);
          }
        }
      });
    } catch (e) {
      console.log("Erreur lors de la connexion:", e);
      setTimeout(() => connectToDevice(device), 2000);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        console.log("Déconnexion réussie");
      } catch (error) {
        console.log("Erreur lors de la déconnexion:", error);
      }
      setConnectedDevice(null);
      setHeartRate(null);
      setSpo2(null);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Montre" />
      <View style={styles.contentContainer}>
        <Text style={styles.textBLE}>Appareil(s) BLE trouvé(s) :</Text>
        <FlatList
          data={devices}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.deviceItem}>
              <Text style={styles.deviceText}>{item.name || "Nom inconnu"}</Text>
              <Button title="Connecter" onPress={() => connectToDevice(item)} />
            </View>
          )}
        />
        {connectedDevice && (
          <View style={styles.connectedSection}>
            <Text style={styles.connectedText}>Connecté à {connectedDevice.name}</Text>
            <Text style={styles.sensorStatus}>
              Données du capteur: {heartRate || spo2 ? "Reçues" : "En attente..."}
            </Text>
            <Button title="Déconnecter" onPress={disconnectDevice} color="#FF6347" />
          </View>
        )}
        <Button title="Lancer le scan" onPress={scanDevices} />
        <View style={styles.healthSection}>
          <Text style={styles.titlePage}>ETAT DE SANTE</Text>
          <View style={styles.dataItem}>
            <Ionicons name="heart" size={24} color="#FF6347" style={styles.icon} />
            <Text style={styles.dataText}>
              Fréquence cardiaque : {heartRate ? `${heartRate} bpm` : "N/A"}
            </Text>
          </View>
          <View style={styles.dataItem}>
            <Ionicons name="pulse" size={24} color="#FF6347" style={styles.icon} />
            <Text style={styles.dataText}>
              SpO2 : {spo2 ? `${spo2} %` : "N/A"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WatchScreen;