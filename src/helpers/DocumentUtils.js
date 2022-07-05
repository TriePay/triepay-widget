import {trimStyle} from "./StyleRenderer";

export const ensureDocument = (document) => {
    if(typeof document === 'undefined') {
        return window.document
    } else {
        return document
    }
}


export const createContainer = (element, document, style) => {
    const container = document.createElement('div');
    // container.setAttribute('class', className);
    container.setAttribute('style', trimStyle('height: 100%;width: 100%;display: flex;display: -webkit-flex;'));
    element.appendChild(container);


    if (style && style.length) {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.appendChild(document.createTextNode(style));
        element.appendChild(styleElement);
    }
    return container;
}
