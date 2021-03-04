import React, { useState, useEffect, useRef, useCallback } from 'react';

import { getDbIntance } from '../Database';
import Box from './Box';
import './Header.css';

const Header = () => {
    const [counts, setCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const subs = useRef(null);

    useEffect(() => {
        getCounts();

        return () => {
            subs.current = null;
        }
    }, []);

    const getCounts = useCallback(async () => {
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
            const baseCounts = {
                total: 0,
                completed: 0,
                removed: 0
            };

            todos.map(t => {
                baseCounts.total++;

                if (t.completed) {
                    baseCounts.completed++;
                } else if (t.removed) {
                    baseCounts.removed++;
                }

            })
            setCounts(baseCounts);
            setIsLoading(false);
        });
        subs.current = sub;

    }, []);

    return (
        <Box>
            <div className="header">
                <h1>TODO-IT</h1>
                {isLoading && <span>Loading counts...</span>}
                {!isLoading && (
                    <ul>
                        {Object.keys(counts).map(k => <li key={k}><span>{`${k.charAt(0).toUpperCase()}${k.slice(1)}`}:</span><span>{counts[k]}</span> </li>)}
                    </ul>
                )}
            </div>
        </Box>
    );
}

export default Header;