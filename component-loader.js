import React from "react";
import { render } from "react-dom";

window.comps = window.comps || {};
window._rendered = window._rendered || false;

function run() {
    if (!window._rendered && window._pageData && window._pageData.component) {
        const comp = comps[window._pageData.component];
        if (!comp) {
            console.warn("Invalid component name.");
        } else {
            window._rendered = true;
            render(comp, document.getElementById("app"));
        }
    }
}

window.addEventListener("load", run, false);

class ComponentLoader {
    static register(name, comp) {
        comps[name] = comp;
    }
}

export default ComponentLoader;
