import { useEffect } from "react";
import { testConnection } from "./firebase/testConnection";

function App() {
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div>
      GraveRate
    </div>
  );
}

export default App;