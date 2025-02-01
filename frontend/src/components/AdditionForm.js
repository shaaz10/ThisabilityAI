import React, { useState } from 'react';
import axios from 'axios';

const AdditionForm = () => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setResult(null);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/add', { num1, num2 });
      setResult(response.data.result);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Addition Form</h1>
      <input
        type="number"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
        placeholder="Enter first number"
      />
      <input
        type="number"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
        placeholder="Enter second number"
      />
      <button onClick={handleSubmit}>Add Numbers</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      {result !== null && (
        <div>
          <h2>Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default AdditionForm;
