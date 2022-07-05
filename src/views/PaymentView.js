import React, {useContext} from "react";
import Main from "./Main";
import NavigateContext from "../contexts/NavigateContext";
import Failed from "./Failed";
import Tokens from "./Tokens";
import Wait from "./Wait";
import Connect from './Connect';
import ConfigContext from "../contexts/ConfigContext";

export default (props) => {

    const { navigator, params } = useContext(NavigateContext)
    const { title } = useContext(ConfigContext);

    const routers = {
        Main: <Main params={params} />,
        Failed: <Failed params={params} />,
        Tokens: <Tokens params={params} />,
        Wait: <Wait params={params} />,
        Connect: <Connect params={params} />
    }

    return (
        <div className="App">
            <div className={"AppPadding"} />
            <div className={!!title ? "AppWrapper BasisHeight MaxHeight" : "AppWrapper BasisHeightEx MaxHeightNT"}>
                {routers[navigator]}
            </div>
            <div className={"AppPadding"} />
        </div>
    )
}
