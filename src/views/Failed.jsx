import React, {useContext} from "react";

import imgFailed from '../assets/img_failed'
import NavigateContext from "../contexts/NavigateContext";
import {byteLength} from "../helpers/Utils";
import ConfigContext from "../contexts/ConfigContext";

export default (props) => {
    const { navigate } = useContext(NavigateContext);
    const { title } = useContext(ConfigContext);
    let renderTx = props.params.transactionId;
    if (byteLength(renderTx) > 13) {
        renderTx = renderTx.substring(0, 6) + '...' + renderTx.substring(renderTx.length - 4, renderTx.length);
    }
    return (
        <div className={'Complete'}>
            <div className={!!title ? 'BaseTopPadding MarginTop30' : 'BaseTopPadding MarginTop20'}/>
            <div className={'CompleteTitle FontBold'} >
                Payment failed
            </div>
            <div className={!!title ? 'BaseTopPadding MarginTop30' : 'BaseTopPadding MarginTop20'}/>
            <img style={{ width: '150px', height: '145px', margin: 'auto', marginBottom: '15px'}} src={imgFailed}/>

            <div className={'NormalCar'}>
                <div className={'FailedShadowCarBox'}>
                    <div className={'SpaceBetweenItem'}>
                        <div className={'ItemName'}>Transaction ID</div>
                        <div className={'Flex1'}/>
                        <div className={'ItemValue'}>{renderTx}</div>
                    </div>
                    <div className={'ItemDivider'}/>
                    <div className={'CompleteNode'}>
                        Payment failed. This could be caused by various reasons.<br/><br/>You can try again.
                    </div>
                </div>
            </div>

            <div className={!!title ? 'BottomPadding MarginTop59' : 'BottomPadding MarginTop21'}/>
            <div className={'OkButton'} onClick={() => navigate('Main')}>
                <div className={'OkText FontSemiBold'}>Retry</div>
            </div>
            <div className={'RetryBottomMargin'} />
        </div>
    );
}
