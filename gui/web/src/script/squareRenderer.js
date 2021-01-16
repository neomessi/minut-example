import render from "../../../../local_modules/minut/lib/ui/autoComponentRenderer"
import square from "../script/components/Square.jsx"
// NOTE: don't have to manually import Header.jsx because that is in ./script/components/autoImported.

const importedComponents = {};
importedComponents["Square"] = square;

// here you set properties for things that don't come from the server - for instance, the time of day:
const now = new Date().toLocaleTimeString('en-US');
const period  = now.substring( now.length-(now.length-2));
window.componentProps = { Square: { unit: period == "AM" ? "coffees" : "beers" } };

window.addEventListener('DOMContentLoaded', (event) => {    
    render(importedComponents);
});