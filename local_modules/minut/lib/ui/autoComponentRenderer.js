/**
 * Auto renders any components in the /gui/web/src/script/components directory
 * In your .html file, to render a component, e.g., Square.jsx, do this:
 *     <div data-component="Square"></div>
 * 
 * Passing props - two ways:
 * 1) in data attribute of the component div (make sure the keys are double-quoted):
 *      data-props='{ "number": "~`data:num`~" }'
 * 
 * 2) set a struct window.componentProps with key name of your component, like this:
 *       window.componentProps = { Square: ~`data:pow`~ };
 *      
 * You can use either 1 or 2 or both (properties will be combined)
 * 
 * ~*~TODO: data-component-type react (default)/vue
 */

import React from 'react';
import ReactDOM from 'react-dom';
import * as allcomps from '../../../../gui/web/src/script/components';

const importedComponents = {};
Object.keys(allcomps).forEach((k, i) => {
    importedComponents[k] = allcomps[k];
});

window.addEventListener('DOMContentLoaded', (event) => {
    const comps = document.querySelectorAll("div[data-component]")
    comps.forEach((n) => {
        const comp = n.getAttribute("data-component");        
        let props = n.getAttribute("data-props") ? JSON.parse(n.getAttribute("data-props")) : {};
        props = window.componentProps && window.componentProps[comp] ? { ...props, ...window.componentProps[comp] } : props ;                
        ReactDOM.render(
            React.createElement(importedComponents[comp], {...props}, null),
            n
          );        
    });
});