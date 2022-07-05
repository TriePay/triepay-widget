import BaseStyle from "../styles/BaseStyle";
import MainStyle from "../styles/MainStyle";
import FontStyle from "../styles/FontStyle";
import CommonStyles from "../styles/CommonStyles";
import ConnectStyles from "../styles/ConnectStyles";
import TokensStyles from "../styles/TokensStyles";
import CompleteStyle from "../styles/CompleteStyle";

function getStyle(style = '') {
    const allStyle = [
        style,
        BaseStyle(),
        CommonStyles(),
        MainStyle(),
        FontStyle(),
        CompleteStyle(),
        ConnectStyles(),
        TokensStyles()
    ].join('');
    return trimStyle(allStyle);
}

function trimStyle(style) {
    return style.replace(/\s*[\r\n]\s*/g, '')
}

function createStyle(document, style) {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(getStyle(style)));
    document.body.appendChild(styleElement);
}

export { createStyle, getStyle, trimStyle }
