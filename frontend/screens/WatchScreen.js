import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Alert, TouchableOpacity } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer'; // Importer Buffer
import Header from '../components/common/Header';

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
      if (!allGranted) {
        console.warn("Certaines permissions Bluetooth n'ont pas été accordées.");
      }
      return allGranted;
    } catch (err) {
      console.warn("Erreur lors de la demande de permissions :", err);
      return false;
    }
  };

  const enableDataCollection = async (device) => {
    try {
      // Envoyer la valeur 1 encodée en Base64
      const value = Buffer.from([1]).toString('base64');

      // Utiliser writeCharacteristicWithoutResponseForDevice
      await device.writeCharacteristicWithoutResponseForDevice(
          SERVICE_UUID,
          CONTROL_CHARACTERISTIC_UUID,
          value
      );
      console.log("Collecte de données activée");
    } catch (error) {
      console.log("Erreur lors de l'activation de la collecte:", error.message);
    }
  };


  const parseData = (data) => {
    try {
      console.log("Données reçues avant parsing:", data);
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
        console.log("Scan en cours...", device ? device.name : "Pas d'appareil");

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
          console.log("Appareil trouvé:", device.name);

          device.connect()
              .then((connected) => {
                console.log("Connecté à:", connected.name);
                setConnectionStatus('Connecté à ' + connected.name);
                return connected.discoverAllServicesAndCharacteristics();
              })
              .then((connected) => {
                setConnectedDevice(connected);
                enableDataCollection(connected); // Activer la collecte automatiquement

                // Configurer la notification pour recevoir les données
                return connected.monitorCharacteristicForService(
                    SERVICE_UUID,
                    CHARACTERISTIC_UUID,
                    (error, characteristic) => {
                      if (error) {
                        console.log("Erreur de surveillance:", error.message);
                        return;
                      }
                      console.log("Caractéristique surveillée, valeur brute:", characteristic?.value);
                      if (characteristic && characteristic.value) {
                        const decodedValue = Buffer.from(characteristic.value, 'base64').toString('utf8');
                        const parsed = parseData(decodedValue);
                        if (parsed) {
                          if (parsed.bpm >= 40 && parsed.bpm <= 220) {
                            setBpm(parsed.bpm);
                            console.log("BPM mis à jour:", parsed.bpm);
                          }
                          if (parsed.spo2 >= 70 && parsed.spo2 <= 100) {
                            setSpo2(parsed.spo2);
                            console.log("SpO2 mis à jour:", parsed.spo2);
                          }
                        }
                      } else {
                        console.log("Aucune valeur reçue ou caractéristique invalide");
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
          console.log("Appareil M5Stack_BLE non trouvé après 10s.");
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
        setConnectionStatus('Déconnecté');
      } catch (error) {
        console.log("Erreur lors de la déconnexion:", error.message);
      }
    }
  };

  return (
      <View style={styles.container}>
        <Header title="Watch" />
        <Text style={styles.title}>Données du capteur M5StickC</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Status: {connectionStatus}</Text>
        </View>

        {connectedDevice && (
            <View style={styles.dataContainer}>
              <View style={styles.cardContainer}>
                <Text style={styles.cardTitle}>Fréquence cardiaque</Text>
                <Text style={styles.dataValue}>{bpm !== null ? bpm : '--'}</Text>
                <Text style={styles.dataUnit}>BPM</Text>
              </View>
              <View style={styles.cardContainer}>
                <Text style={styles.cardTitle}>Saturation en oxygène</Text>
                <Text style={styles.dataValue}>{spo2 !== null ? spo2 : '--'}</Text>
                <Text style={styles.dataUnit}>%</Text>
              </View>
            </View>
        )}

        {connectedDevice && (
            <TouchableOpacity
                style={styles.disconnectButton}
                onPress={disconnectDevice}
            >
              <Text style={styles.disconnectButtonText}>Déconnecter</Text>
            </TouchableOpacity>
        )}

        {!connectedDevice && !isConnecting && (
            <TouchableOpacity
                style={styles.connectButton}
                onPress={connectToDevice}
            >
              <Text style={styles.connectButtonText}>Rechercher M5Stack</Text>
            </TouchableOpacity>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center'
  },
  statusContainer: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center'
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    flex: 0.48,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  dataValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333'
  },
  dataUnit: {
    fontSize: 16,
    color: '#888',
    marginTop: 5
  },
  connectButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  disconnectButton: {
    backgroundColor: '#FF5252',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  disconnectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default WatchScreen;