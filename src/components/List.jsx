import React, { useState, useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';

import { getDbIntance } from '../Database';
import Box from './Box';
import { radioButtons } from './helpers';
import './List.css';

const List = () => {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');
    
    const subs = useRef(null);

    useEffect(() => {
        setupSubs();

        return () => {
            subs.current = null;
        }
    }, []);

    const setupSubs = useCallback(async () => {
        const db = await getDbIntance();

        const sub = db.todos.find({
            selector: {},
            sort: [
                { id: 'asc' }
            ]
        }).$.subscribe(todos => {
            if (!todos) {
                return;
            }
            setTodos(todos);
            setIsLoading(false);
        });
        subs.current = sub;
    }, [subs]);

    const handleComplete = useCallback(async ({ target: { name, checked }}) => {
        const db = await getDbIntance();

        const query = db.todos.findOne({ selector: { id: name }});
        await query.update({
            $set: {
                completed: checked ? 1 : 0
            }
        })
    }, []);

    const deleteTodo = useCallback(async todo => {
        const db = await getDbIntance();

        const query = db.todos.find().where('id').eq(todo.id);
        await query.update({
            $set: {
                removed: todo.removed ? 0 : 1
            }
        })
    }, []);

    const handleFilters = useCallback(async ({ target: { name }}) => {
        setSelectedFilter(name);
        const newFilters = name === 'all' ? {} : { [name]: 1 };

        const db = await getDbIntance();
        const filteredTodos = await db.todos.find({selector: newFilters}).exec();
        setTodos(filteredTodos);
    }, []);

    return (
        <Box id="list-box">
            {isLoading && <span>Loading...</span>}
            {!isLoading && (
                <>
                <form id="filters">
                    {radioButtons.map(btn => (
                        <div key={btn.name} className="radio">
                             <label htmlFor={btn.name}>{btn.label}</label>
                            <input 
                                checked={selectedFilter === btn.name} 
                                type="radio" 
                                name={btn.name} 
                                id={btn.name} 
                                onChange={handleFilters}
                            />
                        </div>
                    ))}
                </form>
                <ul id="todos-list">
                    {todos.map(todo => {
                        return (
                            <li key={todo.id} className={classnames("list-item", {
                                removed: todo.removed,
                                completed: todo.completed || (todo.completed && todo.removed)
                            })}>
                                <input type="checkbox" className="checkbox" name={todo.id} onChange={handleComplete} checked={todo.completed} />
                                <span className="name">
                                    {todo.name}
                                </span>
                                <div className="actions">
                                    <span className={classnames('delete', {
                                        'fa fa-trash-o': !todo.removed,
                                        'fa fa-undo': todo.removed
                                     })} aria-hidden="true" onClick={() => deleteTodo(todo)} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
                </>
            )}
            {!isLoading && todos.length === 0 && <span className="none-yet">No TODOs Found</span>}
        </Box>
    )
}

export default List;