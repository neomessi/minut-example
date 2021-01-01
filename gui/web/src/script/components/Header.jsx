import React from 'react';

export default (props) => {
    
    return (
        <div>
            {props.userName ? `Logged in as ${props.userName}` : "Not logged in" }
        </div>
    )

};