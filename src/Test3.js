import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const formData = {
      chats: [
        {
          role: "user",
          content: userInput
        }
      ]
    };

    axios.post("http://localhost:8000/", formData)
      .then((response) => {
        console.log(response.data);
        const output = response.data.output.content;
        setResponse(output);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <div>
      <h1>Assistant Example</h1>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter your query"
        />
        <button type="submit">Submit</button>
      </form>
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default App;
