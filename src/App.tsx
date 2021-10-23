import { useState } from 'react';
import Form from './Form';
import { ReactInputJson } from 'react-input-json';
import { formFields } from './config';

const App = () => {
  const [config, setConfig] = useState({
    config: formFields,
  });

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <ReactInputJson value={config} onChange={setConfig} />
      </div>
      <div style={{ flexGrow: 1 }}>
        <Form formFields={config.config} />
      </div>
    </div>
  );
};

export default App;
