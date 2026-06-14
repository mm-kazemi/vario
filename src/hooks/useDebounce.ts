import { useEffect, useState } from 'react';

// Mentor Note:
// In enterprise applications, fetching data on every single keystroke is disastrous for performance 
// and API rate limits. We use a Debounce hook to wait until the user has stopped typing for `delay` 
// milliseconds before actually updating the "active" value that triggers the API call or URL update.

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the value changes BEFORE the delay finishes, this cleanup function 
    // clears the previous timeout, effectively resetting the clock.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
