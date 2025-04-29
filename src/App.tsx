import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function usePeople() {
  const [people, setPeople] = useState<
    Array<{ id: number; firstName: string; lastName: string }>
  >([]);
  useEffect(() => {
    fetch("/people.json")
      .then((x) => x.json())
      .then(setPeople);
  }, []);

  return people;
}

function App() {
  const [count, setCount] = useState(0);

  const people = usePeople();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 3)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ul>
        {people.map((p) => (
          <li key={p.id}>{p.firstName}</li>
        ))}
      </ul>
    </>
  );
}

export default App;

