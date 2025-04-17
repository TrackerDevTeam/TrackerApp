import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import Header from '../../components/common/Header';
import { LineChart } from 'react-native-chart-kit';
import styles from '../styles/WatchScreen.styles';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

// UUIDs correspondant à ceux dans bluetooth.cpp
const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "abcd1234-1234-1234-1234-abcdef123456";
const CONTROL_CHARACTERISTIC_UUID = "123e4567-e89b-12d3-a456-426614174000";

const WatchScreen = () => {
  const [manager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [bpm, setBpm] = useState(null);
  const [spo2, setSpo2] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Déconnecté');
  const [bpmData, setBpmData] = useState([]);
  const [spo2Data, setSpo2Data] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        const granted = await requestPermissions();
        if (!granted) {
          Alert.alert("Permissions requises", "Veuillez accorder les permissions Bluetooth et Localisation.");
        }
      }
    };
    init();

    return () => {
      if (connectedDevice) {
        console.log("Déconnexion de l'appareil...");
        connectedDevice.cancelConnection();
      }
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const allGranted = Object.values(granted).every(
          value => value === PermissionsAndroid.RESULTS.GRANTED
      );
      return allGranted;
    } catch (err) {
      console.warn("Erreur lors de la demande de permissions :", err);
      return false;
    }
  };

  const enableDataCollection = async (device) => {
    try {
      const value = Buffer.from([1]).toString('base64');
      const services = await device.services();
      const controlService = services.find(service => service.uuid === SERVICE_UUID);

      if (!controlService) {
        throw new Error("Service non trouvé");
      }

      const characteristics = await controlService.characteristics();
      const controlCharacteristic = characteristics.find(char => char.uuid === CONTROL_CHARACTERISTIC_UUID);

      if (!controlCharacteristic) {
        throw new Error("Caractéristique de contrôle non trouvée");
      }

      await controlCharacteristic.writeWithResponse(value);
      console.log("Collecte de données activée");
    } catch (error) {
      console.log("Erreur lors de l'activation de la collecte:", error.message);
    }
  };

  const parseData = (data) => {
    try {
      const parts = data.split(",");
      const bpmPart = parts.find(part => part.startsWith("BPM:"));
      const spo2Part = parts.find(part => part.startsWith("SPO2:"));
      if (bpmPart && spo2Part) {
        const newBpm = parseInt(bpmPart.replace("BPM:", ""));
        const newSpo2 = parseInt(spo2Part.replace("SPO2:", ""));
        return { bpm: newBpm, spo2: newSpo2 };
      }
    } catch (e) {
      console.log("Erreur de parsing:", e.message);
    }
    return null;
  };

  const connectToDevice = async () => {
    setIsConnecting(true);
    setConnectionStatus('Recherche en cours...');
    console.log("Démarrage du scan d'appareils...");

    try {
      let deviceFound = false;

      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log("Erreur de scan:", error.message);
          setConnectionStatus('Erreur de scan: ' + error.message);
          setIsConnecting(false);
          return;
        }

        if (device && device.name === "M5Stack_BLE") {
          deviceFound = true;
          manager.stopDeviceScan();
          setConnectionStatus('Appareil trouvé, connexion en cours...');

          device.connect()
              .then((connected) => {
                setConnectionStatus('Connecté à ' + connected.name);
                return connected.discoverAllServicesAndCharacteristics();
              })
              .then((connected) => {
                setConnectedDevice(connected);
                enableDataCollection(connected);

                return connected.monitorCharacteristicForService(
                    SERVICE_UUID,
                    CHARACTERISTIC_UUID,
                    (error, characteristic) => {
                      if (error) {
                        console.log("Erreur de surveillance:", error.message);
                        return;
                      }
                      if (characteristic && characteristic.value) {
                        const decodedValue = Buffer.from(characteristic.value, 'base64').toString('utf8');
                        const parsed = parseData(decodedValue);
                        if (parsed) {
                          if (parsed.bpm >= 40 && parsed.bpm <= 220) {
                            setBpm(parsed.bpm);
                            setBpmData(prev => [...prev, parsed.bpm].slice(-10));
                          }
                          if (parsed.spo2 >= 70 && parsed.spo2 <= 100) {
                            setSpo2(parsed.spo2);
                            setSpo2Data(prev => [...prev, parsed.spo2].slice(-10));
                          }
                          setLabels(prev => [...prev, new Date().toLocaleTimeString()].slice(-10));
                        }
                      }
                    }
                );
              })
              .catch((e) => {
                console.log("Erreur de connexion:", e.message);
                setConnectionStatus('Échec de connexion: ' + e.message);
              })
              .finally(() => {
                setIsConnecting(false);
              });
        }
      });

      setTimeout(() => {
        if (!deviceFound) {
          manager.stopDeviceScan();
          setConnectionStatus('Appareil non trouvé');
          setIsConnecting(false);
        }
      }, 10000);
    } catch (e) {
      console.log("Erreur lors de la tentative de connexion:", e.message);
      setConnectionStatus('Erreur: ' + e.message);
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        setBpm(null);
        setSpo2(null);
        setBpmData([]);
        setSpo2Data([]);
        setLabels([]);
        setConnectionStatus('Déconnecté');
      } catch (error) {
        console.log("Erreur lors de la déconnexion:", error.message);
      }
    }
  };

  const chartConfig = {
    backgroundColor: '#000000',
    backgroundGradientFrom: '#1C2526',
    backgroundGradientTo: '#000000',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#FFFFFF',
    },
    withHorizontalLabels: false, // Hide X-axis labels
  };

  return (
      <View style={styles.container}>
        <Header title="Watch" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Moniteur de Santé</Text>

          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Statut: {connectionStatus}</Text>
          </View>

          <View style={styles.dataContainer}>
            <View style={[styles.cardContainer, { backgroundColor: '#FF6B6B' }]}>
              <Text style={styles.cardTitle}>Fréquence Cardiaque</Text>
              <Text style={styles.dataValue}>{bpm !== null ? bpm : '--'}</Text>
              <Text style={styles.dataUnit}>BPM</Text>
            </View>
            <View style={[styles.cardContainer, { backgroundColor: '#4ECDC4' }]}>
              <Text style={styles.cardTitle}>Saturation en Oxygène</Text>
              <Text style={styles.dataValue}>{spo2 !== null ? spo2 : '--'}</Text>
              <Text style={styles.dataUnit}>%</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Fréquence Cardiaque (BPM)</Text>
            <LineChart
                data={{
                  labels: labels.length > 0 ? labels : ['--'],
                  datasets: [
                    {
                      data: bpmData.length > 0 ? bpmData : [0],
                      color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                      strokeWidth: 3,
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 32}
                height={200}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
            />
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Saturation en Oxygène (SpO2)</Text>
            <LineChart
                data={{
                  labels: labels.length > 0 ? labels : ['--'],
                  datasets: [
                    {
                      data: spo2Data.length > 0 ? spo2Data : [0],
                      color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                      strokeWidth: 3,
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 32}
                height={200}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
            />
          </View>

          {connectedDevice ? (
              <TouchableOpacity style={styles.disconnectButton} onPress={disconnectDevice}>
                <Text style={styles.buttonText}>Déconnecter</Text>
              </TouchableOpacity>
          ) : (
              <TouchableOpacity
                  style={[styles.connectButton, isConnecting && styles.disabledButton]}
                  onPress={connectToDevice}
                  disabled={isConnecting}
              >
                <Text style={styles.buttonText}>
                  {isConnecting ? 'Connexion...' : 'Connecter à M5Stack'}
                </Text>
              </TouchableOpacity>
          )}
        </ScrollView>
      </View>
  );
};

export default WatchScreen;