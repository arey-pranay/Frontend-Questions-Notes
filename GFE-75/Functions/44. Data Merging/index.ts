type Session = {
  user: number;
  duration: number;
  equipment: Array<string>;
};

export default function mergeData(sessions: Array<Session>): Array<Session> {
  const map = new Map<number, Session>();

  for (const session of sessions) {
    if (map.has(session.user)) {
      const existing = map.get(session.user)!;

      existing.duration += session.duration;

      for (const item of session.equipment) {
        if (!existing.equipment.includes(item)) {
          existing.equipment.push(item);
        }
      }

      existing.equipment.sort();
    } else {
      map.set(session.user, {
        user: session.user,
        duration: session.duration,
        equipment: [...session.equipment].sort(),
      });
    }
  }

  return Array.from(map.values());
}
