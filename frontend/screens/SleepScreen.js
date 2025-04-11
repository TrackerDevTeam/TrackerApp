import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Header from '../components/common/Header';
import styles from './styles/SleepScreen.styles';  // Importation correcte des styles
import { Calendar } from 'react-native-calendars';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'

const SleepScreen = () => {
    // Données simulées
    const simulatedSleepDataByDate = {
        '2025-04-04': {
            start: '23:20',
            end: '07:00',
            phases: [
            { type: 'Léger', start: '23:20', end: '00:50' },
            { type: 'Lourd', start: '00:50', end: '03:00' },
            { type: 'Réveillé', start: '03:00', end: '03:10' },
            { type: 'Léger', start: '03:10', end: '05:30' },
            { type: 'Lourd', start: '05:30', end: '07:00' },
            ],
        },
        '2025-04-05': {
            start: '00:00',
            end: '07:10',
            phases: [
            { type: 'Réveillé', start: '00:00', end: '00:20' },
            { type: 'Léger', start: '00:20', end: '02:00' },
            { type: 'Lourd', start: '02:00', end: '04:00' },
            { type: 'Léger', start: '04:00', end: '06:00' },
            { type: 'Lourd', start: '06:00', end: '07:10' },
            ],
        },
        '2025-04-06': {
            start: '23:45',
            end: '06:50',
            phases: [
            { type: 'Léger', start: '23:45', end: '01:00' },
            { type: 'Lourd', start: '01:00', end: '03:30' },
            { type: 'Réveillé', start: '03:30', end: '03:45' },
            { type: 'Lourd', start: '03:45', end: '06:50' },
            ],
        },
        '2025-04-07': {
            start: '00:15',
            end: '07:00',
            phases: [
            { type: 'Lourd', start: '00:15', end: '02:45' },
            { type: 'Léger', start: '02:45', end: '05:15' },
            { type: 'Réveillé', start: '05:15', end: '05:30' },
            { type: 'Léger', start: '05:30', end: '07:00' },
            ],
        },
        '2025-04-08': {
            start: '23:30',
            end: '07:15',
            phases: [
            { type: 'Léger', start: '23:30', end: '01:00' },
            { type: 'Lourd', start: '01:00', end: '04:00' },
            { type: 'Réveillé', start: '04:00', end: '04:10' },
            { type: 'Lourd', start: '04:10', end: '06:30' },
            { type: 'Léger', start: '06:30', end: '07:15' },
            ],
        },
        '2025-04-10': {
          start: '23:40',
          end: '07:29',
          phases: [
            { type: 'Réveillé', start: '23:40', end: '00:10' },
            { type: 'Réveillé', start: '00:15', end: '00:30' },
            { type: 'Lourd', start: '00:30', end: '02:30' },
            { type: 'Réveillé', start: '02:30', end: '02:40' },
            { type: 'Léger', start: '02:40', end: '04:10' },
            { type: 'Lourd', start: '04:10', end: '06:00' },
            { type: 'Léger', start: '06:00', end: '06:30' },
            { type: 'Lourd', start: '06:30', end: '07:29' },
          ],
        },
        '2025-04-11': {
          start: '00:10',
          end: '07:00',
          phases: [
            { type: 'Léger', start: '00:10', end: '01:30' },
            { type: 'Lourd', start: '01:30', end: '03:00' },
            { type: 'Réveillé', start: '03:00', end: '03:15' },
            { type: 'Léger', start: '03:15', end: '04:30' },
            { type: 'Lourd', start: '04:30', end: '06:45' },
            { type: 'Léger', start: '06:45', end: '07:00' },
          ],
        },
      };          

    const [selectedDate, setSelectedDate] = useState('2025-04-10');
    const [showCalendar, setShowCalendar] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const sleepData = simulatedSleepDataByDate[selectedDate];

    if (!sleepData) {
        return (
          <View style={styles.container}>
            <Header title="Sommeil" />
            <ScrollView contentContainerStyle={styles.content}>
              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                  [selectedDate]: { selected: true, marked: true, selectedColor: '#66C266' },
                }}
                style={{ marginBottom: 10, borderRadius: 10 }}
                theme={{
                  selectedDayBackgroundColor: '#66C266',
                  todayTextColor: '#66C266',
                  arrowColor: '#66C266',
                  textDayFontWeight: 'bold',
                  textMonthFontSize: 18,
                  textMonthFontWeight: 'bold',
                }}
                hideExtraDays={true}
              />
      
              <Text style={{ fontSize: 16, marginTop: 40, color: '#555', textAlign: 'center' }}>
                😴 Aucune donnée de sommeil enregistrée pour ce jour.
              </Text>
            </ScrollView>
          </View>
        );
    }

    // Fonction pour convertir le temps de sommeil en minutes
    const convertToMinutes = (time) => {
        const [hours, minutes] = time.split('h').map(num => parseInt(num.trim()));
        return hours * 60 + minutes;
    };

    // Fonction pour convertir les minutes en format "h:m"
    const convertToHoursMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}min`;
    };

    const calculatePhaseDuration = (start, end) => {
        const [startHour, startMinute] = start.split(':').map(num => parseInt(num));
        const [endHour, endMinute] = end.split(':').map(num => parseInt(num));
    
        const startTime = new Date(2025, 0, 1, startHour, startMinute);
        const endTime = new Date(2025, 0, 1, endHour, endMinute);
    
        if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1); // Ajouter un jour si l'heure de fin est avant l'heure de début
        }
    
        return (endTime - startTime) / (1000 * 60); // Convertir en minutes
    };
    
    const calculateSleepDurations = (phases) => {
        let awakeDuration = 0;
        let lightSleepDuration = 0;
        let deepSleepDuration = 0;
    
        phases.forEach(phase => {
            const duration = calculatePhaseDuration(phase.start, phase.end);
            switch (phase.type) {
                case 'Réveillé':
                    awakeDuration += duration;
                    break;
                case 'Léger':
                    lightSleepDuration += duration;
                    break;
                case 'Lourd':
                    deepSleepDuration += duration;
                    break;
                default:
                    break;
            }
        });
    
        return {
            awakeDuration,
            lightSleepDuration,
            deepSleepDuration
        };
    };
    
    const { awakeDuration, lightSleepDuration, deepSleepDuration } = calculateSleepDurations(sleepData.phases);
    
    // Calcul de la durée totale du sommeil (en minutes)
    const totalSleepMinutes = lightSleepDuration + deepSleepDuration;

    // Calcul de la durée au lit en minutes (c'est-à-dire la différence entre l'heure de début et de fin)
    const calculateTimeInBed = (start, end) => {
        const [startHour, startMinute] = start.split(':').map(num => parseInt(num));
        const [endHour, endMinute] = end.split(':').map(num => parseInt(num));

        const startTime = new Date(2025, 0, 1, startHour, startMinute); // Assurez-vous d'utiliser la même date pour les calculs
        const endTime = new Date(2025, 0, 1, endHour, endMinute);

        // Si l'heure de fin est avant l'heure de début, cela signifie que le sommeil a traversé minuit
        if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1); // Ajoutez un jour à la fin
        }

        return (endTime - startTime) / (1000 * 60); // Convertir en minutes
    };

    // Calcul de l'efficacité du sommeil
    const calculateSleepEfficiency = (lightDuration, deepDuration, start, end) => {
        // Calculer le temps total passé au lit en minutes
        const timeInBedMinutes = calculateTimeInBed(start, end);

        // Calculer l'efficacité du sommeil
        const efficiency = ((lightDuration + deepDuration) / timeInBedMinutes) * 100;

        return efficiency.toFixed(1); // Retourner l'efficacité avec une décimale
    };

    // Calcul de l'efficacité du sommeil à partir des données simulées
    const efficiency = calculateSleepEfficiency(lightSleepDuration, deepSleepDuration, sleepData.start, sleepData.end);
    const totalDuration = calculateTimeInBed(sleepData.start, sleepData.end); // Durée totale au lit calculée

    const getSleepQuality = (efficiency) => {
        if (efficiency >= 90) {
            return "Très bon sommeil";
        } else if (efficiency >= 80) {
            return "Bon sommeil";
        } else if (efficiency >= 60) {
            return "Sommeil moyen";
        } else {
            return "Sommeil pauvre";
        }
    };
    
    const getSleepQualityColor = (efficiency) => {
        if (efficiency >= 90) {
            return '#2C6B2F'; // Vert foncé pour "Très bon sommeil"
        } else if (efficiency >= 80) {
            return '#66C266'; // Vert clair pour "Bon sommeil"
        } else if (efficiency >= 60) {
            return '#FFA500'; // Orange pour "Sommeil moyen"
        } else {
            return '#FF6347'; // Rouge pour "Mauvais sommeil"
        }
    };

    const generateHourLabels = (startTime, endTime) => {
        const labels = [];
    
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
    
        let current = new Date(2025, 0, 1, startHour, startMinute);
        const end = new Date(2025, 0, 1, endHour, endMinute);
    
        if (end <= current) {
            end.setDate(end.getDate() + 1);
        }
    
        // Ajouter des labels toutes les 2 heures
        while (current <= end) {
            const hours = current.getHours().toString().padStart(2, '0');
            labels.push(`${hours}h`);
            current.setHours(current.getHours() + 2);
        }
    
        return labels;
    };

    const calculateWakeups = (phases) => {
        return phases.filter(phase => phase.type === 'Réveillé').length;
    };
    const wakeups = calculateWakeups(sleepData.phases);
    const totalDurationInMinutes = calculateTimeInBed(sleepData.start, sleepData.end);
    const hourLabels = generateHourLabels(sleepData.start, sleepData.end);

    const getSleepEmoji = (efficiency) => {
        if (efficiency >= 90) return '🌟';
        if (efficiency >= 80) return '😴';
        if (efficiency >= 60) return '😐';
        return '😵';
    };

    const getSleepSummaryMessage = (efficiency, wakeups) => {
        const eff = parseFloat(efficiency);
        if (eff >= 90 && wakeups <= 1) return "Excellent sommeil, repos optimal.";
        if (eff >= 80 && wakeups <= 3) return "Bon sommeil, continuez comme ça.";
        if (eff >= 60) return "Sommeil moyen, pensez à vous détendre davantage.";
        return "Sommeil perturbé, essayez de vous coucher plus tôt.";
    };   

    const getLast7DaysData = () => {
        const today = new Date(selectedDate);
        const last7Days = [];
    
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const data = simulatedSleepDataByDate[dateString];
    
            if (data) {
                const { lightSleepDuration, deepSleepDuration } = calculateSleepDurations(data.phases);
                const total = lightSleepDuration + deepSleepDuration;
                last7Days.push({
                    date: dateString,
                    totalMinutes: total,
                    efficiency: parseFloat(calculateSleepEfficiency(lightSleepDuration, deepSleepDuration, data.start, data.end)),
                });
            }
        }
    
        return last7Days;
    };
    
    const navigation = useNavigation();

    return (
        <LinearGradient
            colors={['#e6f0ff', '#fdfdfd']}
            style={styles.container}
        >
            <Header title="Sommeil" />
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10 }}>
                <Icon
                    name="power-sleep"
                    size={28}
                    color="#66C266"
                    onPress={() => navigation.navigate('StartSleep')}
                />
                <Icon
                    name="calendar-month"
                    size={28}
                    color="#66C266"
                    onPress={() => setShowCalendar(!showCalendar)}
                />
            </View>
            {showCalendar && (
                <Calendar
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: '#66C266' },
                    }}
                    style={{ marginBottom: 10, borderRadius: 10 }}
                    theme={{
                    selectedDayBackgroundColor: '#66C266',
                    todayTextColor: '#66C266',
                    arrowColor: '#66C266',
                    textDayFontWeight: 'bold',
                    textMonthFontSize: 18,
                    textMonthFontWeight: 'bold',
                    }}
                    hideExtraDays={true}
                />
            )}
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>
                    Efficacité du sommeil: {efficiency}%
                </Text>
                <Text style={[styles.title, { color: getSleepQualityColor(efficiency) }]}>
                    {getSleepEmoji(efficiency)} {getSleepQuality(efficiency)}
                </Text>
                <Text style={{ fontSize: 16, fontStyle: 'italic', marginBottom: 10, textAlign: 'center', color: '#444' }}>
                    {getSleepSummaryMessage(efficiency, wakeups)}
                </Text>
                <Text style={styles.sleepInfo}>Durée totale: {convertToHoursMinutes(totalDuration)}</Text>
                <Text style={styles.sleepInfo}>Début: {sleepData.start} - Fin: {sleepData.end}</Text>
                <View style={[styles.summary, { flexDirection: 'row', alignItems: 'center', marginTop: 10 }]}>
                    <Icon name="alarm" size={18} color="#333" style={{ marginRight: 5 }} />
                    <Text style={styles.summary}>Nombre de réveils: {wakeups}</Text>
                </View>

                {/* Graphique des phases de sommeil */}
                <View style={styles.sleepGraph}>
                    {sleepData.phases.map((phase, index) => {
                        let backgroundColor;
                        switch (phase.type) {
                            case 'Réveillé':
                                backgroundColor = 'red';
                                break;
                            case 'Léger':
                                backgroundColor = 'yellow';
                                break;
                            case 'Lourd':
                                backgroundColor = 'green';
                                break;
                            default:
                                backgroundColor = 'gray';
                        }
                        const duration = calculatePhaseDuration(phase.start, phase.end);
                        const percentageWidth = (duration / totalDurationInMinutes) * 100;
                        return (
                            <Pressable
                                key={index}
                                onLongPress={() => setTooltipData({
                                    start: phase.start,
                                    end: phase.end,
                                    type: phase.type,
                                    heartRate: '🫀 65 bpm',
                                    movement: '🤸 Peu de mouvements',
                                })}
                                onPressOut={() => setTooltipData(null)}
                                delayLongPress={300}
                                style={[
                                    styles.graphBar,
                                    {
                                    backgroundColor,
                                    width: `${percentageWidth}%`,
                                    marginRight: 2,
                                    }
                                ]}
                            />
                        );
                    })}
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
                        <Text>{tooltipData.movement}</Text>
                    </View>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 5, marginTop: 5, alignItems: 'center' }}>
                    {hourLabels.map((label, index) => (
                        <View key={index} style={{ alignItems: 'center' }}>
                        <View style={{ width: 1, height: 8, backgroundColor: '#888', marginBottom: 2 }} />
                        <Text style={{ fontSize: 12 }}>{label}</Text>
                        </View>
                    ))}
                </View>
                <View style={{ marginTop: 10, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 4 }}>
                        <View style={{ alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'red', width: 15, height: 15, borderRadius: 3 }} />
                        <Text style={{ fontSize: 14 }}>Réveillé</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'yellow', width: 15, height: 15, borderRadius: 3 }} />
                        <Text style={{ fontSize: 14 }}>Léger</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'green', width: 15, height: 15, borderRadius: 3 }} />
                        <Text style={{ fontSize: 14 }}>Profond</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                        <Text style={{ fontSize: 14 }}>{convertToHoursMinutes(awakeDuration)}</Text>
                        <Text style={{ fontSize: 14 }}>{convertToHoursMinutes(lightSleepDuration)}</Text>
                        <Text style={{ fontSize: 14 }}>{convertToHoursMinutes(deepSleepDuration)}</Text>
                    </View> 
                </View>
                {/* Récapitulatif des 7 derniers jours */}
                <View style={{ marginTop: 30, width: '100%' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>📅 Récapitulatif des 7 derniers jours</Text>
                    {getLast7DaysData().map((entry, index) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: 6,
                                borderBottomWidth: 1,
                                borderBottomColor: '#eee',
                            }}
                        >
                            <Text>{entry.date}</Text>
                            <Text>{convertToHoursMinutes(entry.totalMinutes)}</Text>
                            <Text>{entry.efficiency}%</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default SleepScreen;
