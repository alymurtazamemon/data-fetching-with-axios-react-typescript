import axios from "axios";
import { useEffect, useState } from "react";

type DataType<T> = T | [];
type ErrorType = string | null;
type LoadingType = boolean;

interface State<T> {
  data: DataType<T>;
  error: ErrorType;
  loading: LoadingType;
}

function useAxios<T>(url: string): State<T> {
  const [state, setState] = useState<State<T>>({
    data: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(url, { signal: controller.signal })
      .then((response) => {
        setState({ data: response.data, error: null, loading: false });
      })
      .catch((error) => {
        if (error.name === "CanceledError") {
          console.log("Fetch request was aborted:", error);
          return;
        }

        setState({ data: [], error: error.message, loading: false });
      });

    // * Cleanup: Abort the request if the component unmounts
    return () => controller.abort();
  }, []);

  return state;
}

export default useAxios;
