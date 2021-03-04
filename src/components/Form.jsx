import React, { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { getDbIntance } from '../Database';
import Box from './Box';
import './Form.css';

const Form = () => {
    const [name, setName] = useState('');

    const addTodo = useCallback(async (e) => {
        e.preventDefault();
        const db = await getDbIntance();

        await db.todos.insert({ name, id: uuidv4() });
        setName('');
    }, [name]);

    const handleChange = useCallback(({ target: { value }}) => setName(value), []);

    return (
        <Box>
            <form onSubmit={addTodo}>
                <input name="name" type="text" placeholder="Something to do. . ." value={name} onChange={handleChange} />
                <button type="submit">ADD</button>
            </form>
        </Box>
    );
}

export default Form;