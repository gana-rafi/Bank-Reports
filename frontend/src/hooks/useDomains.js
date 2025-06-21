import { useState, useEffect } from 'react';

function useDomains() {
  const [domains, setDomains] = useState([]);
  useEffect(() => {
    async function fetchDomains() {
      try {
        const payload = {
          jsonrpc: "2.0",
          method: "list_domains",
          params: {},
          id: 1,
        };
        const res = await fetch('/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.result && Array.isArray(data.result)) {
          setDomains(data.result);
        }
      } catch (e) {
        // Optionally handle error
      }
    }
    fetchDomains();
  }, []);
  return domains;
}

export default useDomains;
