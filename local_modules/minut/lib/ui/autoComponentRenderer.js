/**
 * Auto renders any components in the /gui/web/src/script/components directory
 * In your .html file, to render a component, e.g., Square.jsx, do this:
 *     <div data-component="Square"></div>
 * 
 * Passing props - two ways (You can use either 1 or 2 or both (properties will be combined):
 * 1 - html) in data attribute of the component div (make sure the keys are double-quoted):
 *      data-props='{ "number": "~`data:num`~" }'
 * 
 * 2 - js) set a struct window.componentProps with key name of your component, like this:
 *       window.componentProps = { Square: ~`data:pow`~ };
 *       
 *     in your js file you also have to:
 *      import \minut\lib\ui\autoComponentRenderer.js
 *      impoort all components referenced by your html (data-component)
 *      wait for dom loaded and pass them into this function
 * 
 * ~*~TODO: data-component-type react (default)/vue
 */

import React from 'react';
import ReactDOM from 'react-dom';
import * as autoComps from '../../../../gui/web/src/script/components/autoImported';

export default (importedComponents) => {
    const allImportedComponents = { ...importedComponents, ...autoComps };

    const comps = document.querySelectorAll("div[data-component]")
    comps.forEach((n) => {
        const comp = n.getAttribute("data-component");        
        if ( !allImportedComponents[comp] ) {
            throw `Error: no imported component found for data-component ${comp}. Either explicitly import and pass in or move the component to components/autoImported.`;
        }
        let props = n.getAttribute("data-props") ? JSON.parse(n.getAttribute("data-props")) : {};
        props = window.componentProps && window.componentProps[comp] ? { ...props, ...window.componentProps[comp] } : props ;                
        ReactDOM.render(
            React.createElement(allImportedComponents[comp], {...props}, null),
            n
          );        
    });
}