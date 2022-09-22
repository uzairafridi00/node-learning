import React from "react";
import './App.css';

function App() {

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:5000/api")
    .then((res) => res.json())
    .then((data) => setData(data.message))
  }, [])

  return (
    <div className="App">
      <header className="App_header">
        <h1>{!data ? "Loading..." : data}</h1>
      </header>
    </div>
  );
}

export default App;
