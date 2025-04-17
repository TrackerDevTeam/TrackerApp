import React, { useState, useEffect } from 'react';
import { Button, View, Text, ScrollView, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/common/Header';
import styles from './styles/SleepScreen.styles';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import { saveSimulatedDataToAsyncStorage } from '../utils/saveSimulatedData';
import { analyzeAndUploadSleepData } from '../utils/analyzeAndUpload';

const SleepScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-04-10');
  const [showCalendar, setShowCalendar] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [sleepData, setSleepData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [last7Days, setLast7Days] = useState([]);
  const navigation = useNavigation();

  const formatDate = (isoDate) => {
    const [y, m, d] = isoDate.split('-');
    return `${y}-${m}-${d}`;
  };

  const formatFullDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', options);
  };

  const loadSleepData = async (date) => {
    setLoading(true);
    try {
      const ref = doc(db, 'users', 'Nico', formatDate(date), 'sommeil');
      const snapshot = await getDoc(ref);
      setSleepData(snapshot.exists() ? snapshot.data() : null);
    } catch (err) {
      console.error('Erreur Firebase :', err);
      setSleepData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSleepData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const loadLast7DaysData = async () => {
      const today = new Date(selectedDate);
      today.setDate(today.getDate() - 1); // ⬅️ on exclut le jour actuel
      const days = [];
    
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const iso = date.toISOString().split('T')[0];
        const docId = formatDate(iso);
    
        let entry = { date: iso, totalMinutes: null, efficiency: null };
    
        try {
          const ref = doc(db, 'users', 'Nico', docId, 'sommeil');
          const snapshot = await getDoc(ref);
          if (snapshot.exists()) {
            const data = snapshot.data();
            const total = calculateTimeInBed(data.start, data.end);
            // ⬅️ on calcule les durées du jour `data` et pas avec les variables globales !
            const { lightSleepDuration, deepSleepDuration } = calculateSleepDurations(data.phases);
            const efficiency = parseFloat(
              calculateSleepEfficiency(lightSleepDuration, deepSleepDuration, data.start, data.end)
            );
            entry.totalMinutes = total;
            entry.efficiency = efficiency;
          }          
        } catch (e) {
          console.warn(`Erreur récupération données ${iso}`, e);
        }
    
        days.push(entry);
      }
    
      setLast7Days(days);
    };    
    loadLast7DaysData();
  }, [selectedDate]);

  const simulateAndReload = async () => {
    await saveSimulatedDataToAsyncStorage(selectedDate);
    await analyzeAndUploadSleepData(selectedDate);
    await loadSleepData(selectedDate);
  };

  const calculatePhaseDuration = (start, end) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const startTime = new Date(2025, 0, 1, sh, sm);
    const endTime = new Date(2025, 0, 1, eh, em);
    if (endTime < startTime) endTime.setDate(endTime.getDate() + 1);
    return (endTime - startTime) / 60000;
  };

  const getAvgBPMForPhase = (start, end) => {
    const toMinutes = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    const samples = sleepData?.raw?.filter(d => {
      const date = new Date(d.timestamp);
      const min = date.getUTCHours() * 60 + date.getUTCMinutes();
      return min >= startMin && min <= endMin;
    }) || [];
    const avg = samples.length
      ? Math.round(samples.reduce((sum, d) => sum + d.bpm, 0) / samples.length)
      : 65;
  
    return avg;
  };

  const getAvgSpO2ForPhase = (start, end) => {
    const toMinutes = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
  
    const samples = sleepData?.raw?.filter(d => {
      const date = new Date(d.timestamp);
      const min = date.getUTCHours() * 60 + date.getUTCMinutes();
      return min >= startMin && min <= endMin;
    }) || [];
  
    const avg = samples.length
      ? Math.round(samples.reduce((sum, d) => sum + d.spo2, 0) / samples.length)
      : 98; // valeur par défaut réaliste
  
    return avg;
  };
  
  
  const getMovementLabelForPhase = (start, end) => {
    const toMinutes = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
  
    const samples = sleepData?.raw?.filter(d => {
      const date = new Date(d.timestamp);
      const min = date.getUTCHours() * 60 + date.getUTCMinutes();
      return min >= startMin && min <= endMin;
    }) || [];
  
    const avgActivity = samples.length
      ? samples.reduce((sum, d) => {
          const acc = Math.sqrt(d.ax ** 2 + d.ay ** 2 + d.az ** 2);
          const gyr = Math.sqrt(d.gx ** 2 + d.gy ** 2 + d.gz ** 2);
          return sum + (acc + gyr);
        }, 0) / samples.length
      : 0;
  
    if (avgActivity > 6) return '🤸 Beaucoup de mouvements';
    if (avgActivity > 1.5) return '🧘 Quelques mouvements';
    return '😴 Pas de mouvements';
  };
  

  const calculateSleepDurations = (phases) => {
    let awake = 0, light = 0, deep = 0;
    phases.forEach(({ type, start, end }) => {
      const dur = calculatePhaseDuration(start, end);
      if (type === 'Réveillé') awake += dur;
      if (type === 'Léger') light += dur;
      if (type === 'Lourd') deep += dur;
    });
    return { awakeDuration: awake, lightSleepDuration: light, deepSleepDuration: deep };
  };

  const calculateWakeups = (phases) => phases.filter(p => p.type === 'Réveillé').length;
  const calculateTimeInBed = (start, end) => calculatePhaseDuration(start, end);
  const convertToHoursMinutes = (min) => `${Math.floor(min / 60)}h ${min % 60}min`;
  const calculateSleepEfficiency = (light, deep, start, end) => {
    const totalInBed = calculateTimeInBed(start, end);
    return ((light + deep) / totalInBed * 100).toFixed(1);
  };

  const getQualityLabel = (eff, wakeups) => {
    const e = parseFloat(eff);
    if (e >= 90 && wakeups <= 1) return 'Excellent sommeil';
    if (e >= 80 && wakeups <= 3) return 'Bon sommeil';
    if (e >= 60) return 'Sommeil moyen';
    return 'Mauvais sommeil';
  };

  const getSleepEmoji = (quality) =>
    quality === 'Excellent sommeil' ? '🌟' : quality === 'Bon sommeil' ? '😴' : quality === 'Sommeil moyen' ? '😐' : '😵';

  const getSleepQualityColor = (quality) =>
    quality === 'Excellent sommeil' ? '#2C6B2F' : quality === 'Bon sommeil' ? '#66C266' : quality === 'Sommeil moyen' ? '#FFA500' : '#FF6347';

  const { awakeDuration, lightSleepDuration, deepSleepDuration } = calculateSleepDurations(sleepData?.phases || []);
  const totalDuration = calculateTimeInBed(sleepData?.start || '00:00', sleepData?.end || '00:00');
  const efficiency = calculateSleepEfficiency(lightSleepDuration, deepSleepDuration, sleepData?.start || '', sleepData?.end || '');
  const wakeups = calculateWakeups(sleepData?.phases || []);
  const quality = getQualityLabel(efficiency, wakeups);

  const hourLabels = (() => {
    if (!sleepData?.start || !sleepData?.end) return [];
    const labels = [];
    let [sh, sm] = sleepData.start.split(':').map(Number);
    let [eh, em] = sleepData.end.split(':').map(Number);
    let current = new Date(2025, 0, 1, sh, sm);
    const end = new Date(2025, 0, 1, eh, em);
    if (end <= current) end.setDate(end.getDate() + 1);
    while (current <= end) {
      labels.push(`${current.getHours().toString().padStart(2, '0')}h`);
      current.setHours(current.getHours() + 2);
    }
    return labels;
  })();

  return (
    <LinearGradient colors={['#e6f0ff', '#fdfdfd']} style={styles.container}>
      <Header title="Sommeil" />

      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 }}>
        <Icon name="power-sleep" size={28} color="#66C266" onPress={() => navigation.navigate('StartSleep')} />
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#333', fontWeight: 'bold' }}>
            {formatFullDate(selectedDate)}
          </Text>
        </View>

        <Icon name="calendar-month" size={28} color="#66C266" onPress={() => setShowCalendar(!showCalendar)} />
      </View>

      <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
        <Button title="🛌 Simuler une nuit (brut)" onPress={simulateAndReload} color="#66C266" />
      </View>

      {showCalendar && (
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: '#66C266' } }}
          style={{ marginBottom: 10, borderRadius: 10 }}
          theme={{
            selectedDayBackgroundColor: '#66C266',
            todayTextColor: '#66C266',
            arrowColor: '#66C266',
            textDayFontWeight: 'bold',
            textMonthFontSize: 18,
            textMonthFontWeight: 'bold',
          }}
          hideExtraDays
        />
      )}

      <ScrollView contentContainerStyle={styles.content}>
        {!sleepData ? (
          <Text style={{ fontSize: 16, marginTop: 40, textAlign: 'center', color: '#666' }}>
            😴 Aucune donnée de sommeil enregistrée pour ce jour.
          </Text>
        ) : (
          <>
            <Text style={styles.title}>Efficacité du sommeil: {efficiency}%</Text>
            <Text style={[styles.title, { color: getSleepQualityColor(quality) }]}>
              {getSleepEmoji(quality)} {quality.charAt(0).toUpperCase() + quality.slice(1)}
            </Text>

            <Text style={styles.sleepInfo}>Durée totale: {convertToHoursMinutes(totalDuration)}</Text>
            <Text style={styles.sleepInfo}>Début: {sleepData.start} - Fin: {sleepData.end}</Text>

            <View style={[styles.summary, { flexDirection: 'row', alignItems: 'center', marginTop: 10 }]}>
              <Icon name="alarm" size={18} color="#333" style={{ marginRight: 5 }} />
              <Text style={styles.summary}>Nombre de réveils: {wakeups}</Text>
            </View>

            <View style={styles.sleepGraph}>
              {sleepData.phases.map((phase, index) => {
                const colors = { Réveillé: 'red', Léger: 'yellow', Lourd: 'green' };
                const duration = calculatePhaseDuration(phase.start, phase.end);
                const percentageWidth = (duration / totalDuration) * 100;
                const height = phase.type === 'Lourd' ? 70 : phase.type === 'Léger' ? 80 : 100;
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      if (
                        tooltipData &&
                        tooltipData.start === phase.start &&
                        tooltipData.end === phase.end &&
                        tooltipData.type === phase.type
                      ) {
                        setTooltipData(null); // clic sur le même -> ferme
                      } else {
                        setTooltipData({
                          start: phase.start,
                          end: phase.end,
                          type: phase.type,
                          heartRate: `🫀 ${getAvgBPMForPhase(phase.start, phase.end)} bpm`,
                          spo2: `🩸 ${getAvgSpO2ForPhase(phase.start, phase.end)}% SpO2`,
                          movement: getMovementLabelForPhase(phase.start, phase.end),
                        });
                      }
                    }}
                    style={{
                      backgroundColor: colors[phase.type] || 'gray',
                      width: `${percentageWidth}%`,
                      height,
                      marginRight: 2,
                      alignSelf: 'flex-end',
                      borderRadius: 4,
                    }}
                  />
                );
              })}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 5, marginTop: 5 }}>
              {hourLabels.map((label, i) => (
                <View key={i} style={{ alignItems: 'center' }}>
                  <View style={{ width: 1, height: 8, backgroundColor: '#888', marginBottom: 2 }} />
                  <Text style={{ fontSize: 12 }}>{label}</Text>
                </View>
              ))}
            </View>


            {tooltipData && (
              <View style={{
                marginTop: 10,
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 10,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 3,
              }}>
                <Text style={{ fontWeight: 'bold' }}>{tooltipData.type}</Text>
                <Text>Début : {tooltipData.start}</Text>
                <Text>Fin : {tooltipData.end}</Text>
                <Text>{tooltipData.heartRate}</Text>
                <Text>{tooltipData.spo2}</Text>
                <Text>{tooltipData.movement}</Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              {['Lourd', 'Léger', 'Réveillé'].map((type, i) => {
                const color = type === 'Lourd' ? 'green' : type === 'Léger' ? 'yellow' : 'red';
                return (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                    <View style={{ width: 15, height: 15, backgroundColor: color, borderRadius: 3, marginRight: 6 }} />
                    <Text style={{ fontSize: 14 }}>{type}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <View style={{ marginTop: 30, width: '100%' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>📅 Récapitulatif des 7 derniers jours</Text>
          {last7Days.slice().reverse().map((entry, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <Text>{entry.date}</Text>
              <Text>
                {entry.totalMinutes !== null ? convertToHoursMinutes(entry.totalMinutes) : 'Pas de données'}
              </Text>
              <Text>
                {entry.efficiency !== null ? `${entry.efficiency}%` : ''}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SleepScreen;
