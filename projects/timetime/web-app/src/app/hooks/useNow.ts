import { useEffect, useState } from 'react';
import { NOW_TICK_INTERVAL_MS } from '../punchMeta';

export const useNow = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), NOW_TICK_INTERVAL_MS);
    return () => clearInterval(timerId);
  }, []);
  return now;
};
