import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { LineChart } from 'react-native-svg-charts';
import Header from '../components/common/Header';

const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "abcd1234-1234-1234-1234-abcdef123456";

const WatchScreen = () => {
  const [manager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [bpmData, setBpmData] = useState([]);
  const [spo2Data, setSpo2Data] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        await requestPermissions();
      }
    };
    init();

    return () => {
      if (connectedDevice) {
        connectedDevice.cancelConnection();
      }
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

  const rescanAndConnect = async () => {
    setIsScanning(true);
    try {
      // Assume M5StickC_Heart is paired via phone settings
      const devices = await manager.devices([]);
      const device = devices.find(d => d.name === "M5StickC_Heart");
      if (device) {
        const connected = await device.connect();
        await connected.discoverAllServicesAndCharacteristics();
        setConnectedDevice(connected);

        connected.monitorCharacteristicForService(SERVICE_UUID, CHARACTERISTIC_UUID, (error, characteristic) => {
          if (error) {
            console.log("Erreur de surveillance:", error);
            return;
          }
          if (characteristic.value) {
            const data = characteristic.value;
            const [bpmPart, spo2Part] = data.split(',');
            const bpm = parseInt(bpmPart.split(':')[1]);
            const spo2 = parseInt(spo2Part.split(':')[1]);
            setBpmData(prev => [...prev.slice(-50), bpm]); // Limit to last 50 points
            setSpo2Data(prev => [...prev.slice(-50), spo2]); // Limit to last 50 points
          }
        });
      } else {
        console.log("Appareil M5StickC_Heart non trouvé ou non appairé.");
      }
    } catch (e) {
      console.log("Erreur de connexion:", e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
      <View style={styles.container}>
        <Header title="Watch" />
        <Text style={styles.title}>Données du capteur M5StickC</Text>
        {connectedDevice && (
            <View>
              <Text>Connecté à: {connectedDevice.name}</Text>
              <LineChart
                  style={styles.chart}
                  data={bpmData}
                  svg={{ stroke: 'red' }}
                  contentInset={{ top: 20, bottom: 20 }}
                  yMax={120}
                  yMin={40}
              >
              </LineChart>
              <Text>BPM</Text>
              <LineChart
                  style={styles.chart}
                  data={spo2Data}
                  svg={{ stroke: 'green' }}
                  contentInset={{ top: 20, bottom: 20 }}
                  yMax={100}
                  yMin={90}
              >
              </LineChart>
              <Text>SPO2 (%)</Text>
            </View>
        )}
        <Button
            title={isScanning ? "Recherche en cours..." : "Rescan"}
            onPress={rescanAndConnect}
            disabled={isScanning}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  chart: { height: 200, marginVertical: 10 },
});

export default WatchScreen;
