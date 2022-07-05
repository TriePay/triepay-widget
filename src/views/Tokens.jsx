import defaultToken from '../assets/img_default02.png';
import backIcon from '../assets/ic_btn_back.png';
import backIconPress from '../assets/ic_btn_back_press.png';
import backIconHover from '../assets/ic_btn_back_hover.png';
import iconBsc from '../assets/ic_bsc.png';
import iconEth from '../assets/ic_eth.png';
import iconFantom from '../assets/ic_fantom.png'
import iconPolygon from '../assets/ic_polygon.png'
import iconAVAX from  '../assets/ic_avax.png'
import iconSelect from '../assets/ic_checkbox_select.png';
import React, {useContext} from "react";
import NavigateContext from "../contexts/NavigateContext";
import TokensContext from "../contexts/TokensContext";
import transakImg from '../assets/img_transak'
import imgFail from '../assets/img_failed'
import ConfigContext from "../contexts/ConfigContext";
import BigNumber from "bignumber.js";
import {toLowerCaseEquals} from "../helpers/Utils";
export default (props)=>{

    const { navigate } = useContext(NavigateContext);
    const { supportTokens, balances, selectToken, setSelectToken } = useContext(TokensContext);
    const { quantity, title } = useContext(ConfigContext);

    const getChainLogo = (chainId) => {
        switch (chainId) {
            case '56':
                return iconBsc;
            case '137':
                return iconPolygon;
            case '250':
                return iconFantom;
            case '43114':
                return iconAVAX;
        }
        return iconEth;
    }

    const toAmount = (amountWei, decimals) => {
        const amount = new BigNumber(amountWei, 10).div(Math.pow(10, decimals));
        if (amount.lt(0.00000001)) {
            return '< 0.00000001';
        }
        return amount.dp(8).toString();
    }

    const clickSelectToken = (address, chainId) => {
        setSelectToken({ address, chainId});
    }

    const renderTokens = (tokens) => {
        let currentToken = selectToken;
        if (!currentToken) {
            currentToken = props.params.selectToken;
        }

        return (
          <div className="TokenList">
              <div className="flex-col align-center">
                  <div className="flex-col">
                      {tokens.map((token, index) => {
                          let isSelect = false;
                          if (currentToken) {
                              if (toLowerCaseEquals(token.address, currentToken.address) && token.chainId == currentToken.chainId) {
                                  isSelect = true;
                              }
                          }
                          return (
                            <div key={ 'token-' + index } className={isSelect ? 'TokenWrapper TokenSelectWrapper' : 'TokenWrapper'} onClick={()=>clickSelectToken(token.address, token.chainId)}>
                                <div className="TokenContainer">
                                    <div className="LogoContainer">
                                        <img className="TokenLogo" src={token.image ? token.image : defaultToken}/>
                                        <img className="TokenChainLogo" src={getChainLogo(token.chainId)}/>
                                    </div>
                                    <div className="TokenOtherWrapper'">
                                        <div className="TokenNeedWrap">
                                            <div className="TokenSymbol FontSemiBold">{token.symbol}</div>
                                            <div className="TokenNeed">{toAmount(token.price, token.decimals)}</div>
                                        </div>
                                        <div className="TokenBalance">
                                            Balance {toAmount(token.balance, token.decimals)}
                                        </div>
                                    </div>
                                    <div className="FixGrow"/>
                                    {isSelect && <img className="TokenSelect" src={iconSelect}/>}
                                </div>
                            </div>
                          )
                      })}
                  </div>
              </div>
          </div>
        )
    }

    const clickToTransak = () => {
        const newTab = window.open('about:blank');
        newTab.location.href = "https://global.transak.com";
    }

    const renderNoToken = () => {
        return (
            <div className="NoTokensWrap">
                <div className="NoTokenTopPadding"/>
                <img className="NoTokenFailImg" src={imgFail}/>
                <span className="NoTokenText">
                    You&nbsp;don’t&nbsp;have&nbsp;any&nbsp;required&nbsp;tokens&nbsp;or<br/>their&nbsp;balances&nbsp;is&nbsp;not&nbsp;enough.
                </span>
                <div className="NoTokenMiddlePadding"/>
                <div className="TransakImg"
                     style={{ '--transak-normal-image': 'url(' + transakImg + ')' }}
                     onClick={() => {clickToTransak()}}>
                    <div className={"CardHover"} />
                </div>
                <div className="NoTokenBottomPadding"/>
            </div>
        );
    }

    const loadTokens = () => {
        const allTokens = [];
        const payments = balances;
        if (payments && payments.length > 0) {
            payments.forEach((item) => {
                const { chainId, tokens, balances, amounts } = item;
                const tokenInfos = supportTokens[chainId];
                const length = tokens.length;
                tokens.forEach((address, index) => {
                    if (amounts[index] > 0) {
                        const price = new BigNumber(amounts[index], 10).multipliedBy(quantity).toNumber();
                        const balance = balances[index];
                        if (balance >= price) {
                            allTokens.push({ chainId, address, balance, price, ...tokenInfos[address.toLowerCase()] });
                        }
                    }
                });
            })
        }
        return allTokens.length > 0 ? renderTokens(allTokens) : renderNoToken()
    }

    return (
        <div className={!!title ? "Token TokenHeight" : "Token TokenNoTitleHeight"}>
            <div className="TokenContent">
                <div className="TokenTopPadding"/>
                <div className="TokenTitleWrap">
                    <img className="BackIcon" onClick={() => navigate('Main')}
                         style={{ '--back-normal-image': 'url(' + backIcon + ')', '--back-hover-image': 'url(' + backIconHover + ')', '--back-press-image': 'url(' + backIconPress + ')' }}/>
                    <span className="TokenTitle">Select&nbsp;Token</span>
                </div>
                {loadTokens()}
            </div>
        </div>
    );
}
