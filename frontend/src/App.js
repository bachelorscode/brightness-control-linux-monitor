import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [brightness, setBrightness] = useState("");
  const [monitors, setMonitors] = useState([]);
  const [selectedMonitor, setSelectedMonitor] = useState("");
  const [timeoutId, setTimoutId] = useState(null);
  useEffect(() => {
    (async () => {
      const { data: monitorlist } = await axios.get(
        "http://localhost:4000/getmonitors"
      );
      setMonitors(monitorlist);
      setSelectedMonitor(monitorlist[0]);

      const { data } = await axios.get("http://localhost:4000/get");
      let b = data * 100;
      localStorage.setItem("brightness", b);
      setBrightness(b);
    })();
  }, []);

  const control = async (e) => {
    let value = e.target.value;
    if (timeoutId) {
      return;
    }
    const id = setTimeout(async () => {
      await axios.get(`http://localhost:4000/set/${value / 100}`, { params: { monitorName: selectedMonitor } });
      localStorage.setItem("brightness", value);
      setBrightness(value);
      setTimoutId(null)
      console.log(value)
    }, 1)
    setTimoutId(id)
  };

  return (
    <div className="App">
      <select name="" id="monitor">
        {monitors.map((monitor) => {
          return (
            <option key={monitor} value={monitor}>
              {monitor}
            </option>
          );
        })}
      </select>

      <p>{selectedMonitor}</p>


      <input
        type="range"
        onChange={control}
        // onChange={control}
        min="10"
        max="100"
        value={brightness || localStorage.getItem("brightness")}
      />
    </div>
  );
}

export default App;
