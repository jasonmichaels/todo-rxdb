import React from 'react';

import List from './components/List';
import Form from './components/Form';
import Box from './components/Box';
import './App.css';

const App = () => {
    return (
        <div>
            <Box>
                <h1>TODO-IT</h1>
            </Box>
            <Form />
            <List />
        </div>
    );
}

export default App;
