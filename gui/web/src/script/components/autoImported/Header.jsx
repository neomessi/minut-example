import React from 'react';

export default (props) => {
    
    return (
        <div>
            {props.userName &&
                <p className="panel-heading">
                    Logged in as <a href="/userinfo">{props.userName}</a> <a href="/logout"><button className="btn btn-secondary">Logout</button></a>
                </p>
            }

            {!props.userName &&
                <p className="panel-heading">
                    Browsing as <a href="/userinfo">guest</a> <a href="/login"><button className="btn btn-secondary">Login</button></a>
                </p>
            }
        </div>
    )

};