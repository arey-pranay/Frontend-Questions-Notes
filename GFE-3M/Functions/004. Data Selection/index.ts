type Session = {
  user: number;
  duration: number;
  equipment: Array<string>;
};

type Options = {
  user?: number;
  minDuration?: number;
  equipment?: Array<string>;
  merge?: boolean;
};

export default function selectData(
  sessions: Array<Session>,
  options?: Options,
): Array<Session> {
  let ans = sessions;

  if (!options) return ans;

  if (options.user !== undefined) {
    ans = ans.filter((el) => el.user === options.user);
  }

  if (options.merge) {
    ans = merge(ans);
  }

  const minDuration = options.minDuration;
  if (minDuration !== undefined) {
    ans = ans.filter((el) => el.duration >= minDuration);
  }

  const equipments = options.equipment;
  if (equipments) {
    ans = ans.filter((el) =>
      equipments.some((equipment) =>
        el.equipment.includes(equipment)
      )
    );
  }

  return ans;
}

function merge(arr: Array<Session>): Session[] {
  // reverse trick to match "latest occurrence wins"
  const reversed = arr.slice().reverse();

  const map = new Map<number, Session>();

  for (const el of reversed) {
    if (!map.has(el.user)) {
      map.set(el.user, {
        user: el.user,
        duration: el.duration,
        equipment: [...new Set(el.equipment)].sort(),
      });
    } else {
      const existing = map.get(el.user)!;

      map.set(el.user, {
        user: el.user,
        duration: existing.duration + el.duration,
        equipment: [
          ...new Set([...existing.equipment, ...el.equipment]),
        ].sort(),
      });
    }
  }

  return Array.from(map.values()).reverse();
}
