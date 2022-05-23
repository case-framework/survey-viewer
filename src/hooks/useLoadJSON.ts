import { useEffect, useState } from "react";

export default function useLoadJSON<T>(url: string) {
  const [content, setContent] = useState<undefined | T>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setContent(json as T)
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return {
    content,
    loading
  };
}
