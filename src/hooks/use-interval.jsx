import { useEffect, useRef } from "react";

export function useInterval(callback, delay, ...callbackParams) {
  const savedCallback = useRef();

  // remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // setup the interval
  useEffect(() => {
    function tick() {
      savedCallback.current(callbackParams);
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [callback, delay, callbackParams]);
}

