import React, { useState, useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';

import { getDbIntance } from '../Database';
import Box from './Box';
import { radioButtons, handleComplete, deleteTodo } from './helpers';
import './List.css';

const List = () => {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');
    
    const subs = useRef(null);

    const setupSubs = useCallback(async (newFilters = {}) => {
        const db = await getDbIntance();

        if (subs.current && 'function' === typeof subs.current.unsubscribe) {
            subs.current.unsubscribe();
        }

        const sub = db.todos.find({
            selector: newFilters,
            sort: [
                { id: 'asc' }
            ]
        }).$.subscribe(todos => {
            if (todos && Array.isArray(todos)) {
                setTodos(todos);
            }
            setIsLoading(false);
        });
        subs.current = sub;
    }, []);

    useEffect(() => {
        setupSubs();

        return () => {
            if (subs.current && 'function' === typeof subs.current.unsubscribe) {
                subs.current.unsubscribe();
            }
        }
    }, []);

    const handleFilters = useCallback(async ({ target: { name }}) => {
        setIsLoading(true);
        setSelectedFilter(name);
        setupSubs(name === 'all' ? {} : { [name]: 1 });
    }, [setupSubs]);

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