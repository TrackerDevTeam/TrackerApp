import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { decode } from 'base-64';

// UUIDs du service et de la caractéristique BLE (à adapter selon votre appareil)
const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "abcd1234-1234-1234-1234-abcdef123456";

const WatchScreen = () => {
  // État pour gérer BLE et les données
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [sensorData, setSensorData] = useState(null);

  // Initialisation au montage du composant
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

    // Nettoyage au démontage
    return () => {
      manager.destroy();
    };
  }, []);

  // Demande de permissions BLE sur Android
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

  // Scan des appareils BLE
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

    // Arrêt du scan après 10 secondes
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  // Connexion à un appareil BLE
  const connectToDevice = async (device) => {
    try {
      const connected = await device.connect();
      setConnectedDevice(connected);
      await connected.discoverAllServicesAndCharacteristics();
      connected.monitorCharacteristicForService(SERVICE_UUID, CHARACTERISTIC_UUID, (error, characteristic) => {
        if (error) {
          console.log("Erreur lors de la surveillance:", error);
          connectToDevice(device); // Tentative de reconnexion
          return;
        }
        const data = characteristic.value;
        if (data) {
          try {
            const decodedData = decode(data);
            setSensorData(decodedData);
          } catch (e) {
            console.log("Erreur de décodage:", e);
          }
        }
      });
    } catch (e) {
      console.log("Erreur lors de la connexion:", e);
      setTimeout(() => connectToDevice(device), 2000); // Réessayer après 2 secondes
    }
  };

  // Rendu de l'interface utilisateur
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Appareil BLE trouvé(s) :</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.name || "Nom inconnu"}</Text>
            <Button title="Connecter" onPress={() => connectToDevice(item)} />
          </View>
        )}
      />
      {connectedDevice && (
        <View style={{ marginTop: 20 }}>
          <Text>Connecté à {connectedDevice.name}</Text>
          <Text>Donnée du capteur: {sensorData || "En attente..."}</Text>
        </View>
      )}
      <Button title="Relancer le scan" onPress={scanDevices} />
    </View>
  );
};

export default WatchScreen;