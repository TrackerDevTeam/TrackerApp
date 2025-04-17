import moment from 'moment';

export const detectSleepPhasesFromRaw = (rawData) => {
  const windowSize = 60 * 1000; // 1 minute
  const windows = [];

  for (let i = 0; i < rawData.length; i++) {
    const d = rawData[i];
    const acc = Math.sqrt(d.ax ** 2 + d.ay ** 2 + d.az ** 2);
    const gyr = Math.sqrt(d.gx ** 2 + d.gy ** 2 + d.gz ** 2);
    const activity = acc + gyr;

    const bpm = d.bpm;

    let type = 'Léger';
    if (activity > 6 || bpm > 85) type = 'Réveillé';
    else if (activity < 1 && bpm < 65) type = 'Lourd';

    const start = moment.utc(d.timestamp).format("HH:mm");
    const end = moment.utc(d.timestamp + windowSize).format("HH:mm");

    windows.push({ type, start, end, bpm });
  }

  // Fusion des fenêtres identiques
  const phases = [];
  for (let i = 0; i < windows.length; i++) {
    const current = windows[i];
    if (phases.length === 0) {
      phases.push({ ...current, bpmValues: [current.bpm] });
    } else {
      const last = phases[phases.length - 1];
      if (last.type === current.type) {
        last.end = current.end;
        last.bpmValues.push(current.bpm);
      } else {
        phases.push({ ...current, bpmValues: [current.bpm] });
      }
    }
  }

  // Calcule la moyenne de BPM par phase
  phases.forEach(phase => {
    const sum = phase.bpmValues.reduce((a, b) => a + b, 0);
    phase.avgBpm = Math.round(sum / phase.bpmValues.length);
    delete phase.bpmValues; // Nettoyage
  });

  const start = phases[0]?.start || '00:00';
  const end = phases[phases.length - 1]?.end || '08:00';

  return {
    start,
    end,
    phases,
  };
};
