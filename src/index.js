import React from "react";
import ReactDOM from "react-dom";
import AnimalForm from "./components/AnimalForm";

import "./styles.css";

function App() {
  return (
    <div className="App">
      {/* This AnimalForm = Formik + AnimalForm*/}
      {/* We can send props into the mapPropsToValue Formik */}
      <AnimalForm />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
