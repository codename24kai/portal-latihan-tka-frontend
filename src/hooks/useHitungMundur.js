import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Countdown timer hook
 * @param {number} initialSeconds - Starting seconds
 * @param {Function} onComplete - Callback when timer reaches 0
 * @returns {{ timeLeft, isRunning, isWarning, start, pause, reset }}
 */
export function useCountdown(initialSeconds, onComplete) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref fresh
  onCompleteRef.current = onComplete;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback((newSeconds) => {
    clearTimer();
    setTimeLeft(newSeconds ?? initialSeconds);
    setIsRunning(false);
  }, [clearTimer, initialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          setTimeout(() => onCompleteRef.current?.(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  // Warning when less than 5 minutes remain
  const isWarning = timeLeft <= 300 && timeLeft > 0;

  return { timeLeft, isRunning, isWarning, start, pause, reset };
}
