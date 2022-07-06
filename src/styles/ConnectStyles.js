export default ()=>{
    return(`
    
    .Connect {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .Connect .Content {
      display: flex;
      flex-direction: column;
      width: 375px;
      height: 100%;
    }
    
    .ConnectTitleWrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      padding-left: 16px;
      padding-right: 70px;
    }
    
    .ConnectTopPadding {
      min-height: 30px;
      max-height: 30px;
    }
    
    .BackIcon {
      width: 54px;
      height: 54px;
      content: var(--back-normal-image);
      cursor: pointer;
    }
    
    .BackIcon:hover {
      content: var(--back-hover-image);
    }
    
    .BackIcon:active {
      content: var(--back-press-image);
    }
    
    .Connect .Title {
      display: block;
      overflow-wrap: break-word;
      color: rgba(25, 28, 50, 1);
      font-size: 20px;
      white-space: nowrap;
      line-height: 24px;
      text-align: center;
      width: 100%;
    }
    
    .ConnectMiddlePadding {
      height: 30px;
    }
    
    .Connect .BottomPadding {
      flex: 1
    }
    
    .SelectImgWrap {
      display: flex;
      align-items: center;
    }
    
    .MetamaskImg {
      position: relative;
      height: 160px;
      width: 325px;
      background-image: var(--metamask-normal-image);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      cursor: pointer;
    }
    
    .MetamaskImg:hover {
      border-radius: 12px;
      box-shadow: 0px 15px 30px 0px rgba(116, 116, 118, 0.08);
    }
    
    .WalletconnectImg {
      position: relative;
      height: 160px;
      width: 325px;
      margin-top: 30px;
      background-image: var(--walletconnect-normal-image);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      cursor: pointer;
    }
    
    .WalletconnectImg:hover {
        border-radius: 12px;
        box-shadow: 0px 15px 30px 0px rgba(116, 116, 118, 0.08);
    }

    .Connect .CardHover {
      width: 325px;
      height: 160px;
      background-color: rgba(0, 0, 0, 0);
      position: absolute;
      left: 0;
      top: 0;
    }
    
    .Connect .CardHover:active {
      border-radius: 12px;
      background-color: rgba(0, 0, 0, 0.02);
    }
  `)
}
