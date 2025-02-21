import { useEffect, useState } from "react";

const useLocalStorage: <T>(
  key: string,
  initialValue: T
) => [T, React.Dispatch<React.SetStateAction<T>>] = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      const item = window?.localStorage?.getItem(key);
      console.log(item);
      return item ? JSON.parse(item) : initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window?.localStorage?.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
