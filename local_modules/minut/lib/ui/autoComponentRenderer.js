/**
 * Auto renders any components in the /gui/web/src/script/components directory
 * In your .html file, to render a component, e.g., Square.jsx, do this:
 *     <div data-component="Square"></div>
 *
 * Following only for React - Vue props will be passed in via markup
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
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Vue from 'vue';

/* eslint-disable-next-line */
import * as autoComps from '../../../../gui/web/src/script/components/autoImported'; // linter doesn't understand wildcard import

export default (importedComponents) => {
    const allImportedComponents = { ...importedComponents, ...autoComps };

    /* eslint-disable-next-line */
    const comps = document.querySelectorAll("div[data-component]"); // document is ok - this will only run on client-side

    comps.forEach((n) => {
        const comp = n.getAttribute("data-component");
        const _comp = allImportedComponents[comp];

        if (!_comp) {
            throw new Error(`Error: no imported component found for data-component ${comp}. Either explicitly import and pass in or move the component to components/autoImported.`);
        }

        const compType = n.getAttribute("data-component-type") || 'react';
        let props = {};
        switch (compType) {
        case 'react':
            props = n.getAttribute("data-props") ? JSON.parse(n.getAttribute("data-props")) : {};
            /* eslint-disable-next-line */
            props = window.componentProps && window.componentProps[comp] ? { ...props, ...window.componentProps[comp] } : props; //  window is ok - this will only run on client-side
            ReactDOM.render(
                React.createElement(_comp, { ...props }, null),
                n,
            );
            break;
        case 'vue':
            /* eslint-disable-next-line */
            new Vue({
                el: n,
                components: {
                    [comp]: _comp,
                },
            });
            break;

        default:
            throw new Error(`Error: unsupported component type "${compType}"`);
        }
    });
};
