import { useEffect } from "react";
import { testConnection } from "./firebase/testConnection";
import { seedDatabase } from "./firebase/seedDatabase";
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