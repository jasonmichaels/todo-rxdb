import React from 'react';

import List from './components/List';
import Form from './components/Form';
import Header from './components/Header';
import './App.css';

const App = () => {
    return (
        <div>
            <Header />
            <Form />
            <List />
        </div>
    );
}

export default App;
