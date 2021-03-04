import React from 'react';

import './Box.css';

const Box = ({ children, ...props }) => (
    <div
        id="insert-box" 
        className="box" 
        {...props}>
            {children}
    </div>
);

export default Box;