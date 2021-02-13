// this is the bare minimum needed to render just any of the auto imported components
// if you need any additional components, don't modify this, instead just create your own custom render

import render from "../../../../local_modules/minut/lib/ui/autoComponentRenderer"

window.addEventListener('DOMContentLoaded', (event) => {    
    render();
});