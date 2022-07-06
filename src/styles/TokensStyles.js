export default () => {
    return(`
    
    @media screen and (min-width: 480px) {
        .TokenNoTitleHeight {
        }
        
        .TokenHeight {
        }
      }
      
      @media screen and (max-width: 480px) {
        .TokenNoTitleHeight {
            height: 503px;
        }
        
        .TokenHeight {
            height: 561px;
        }
      }
    
        .Token {
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hide;
        }
        
        .TokenContent {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            width: 375px;
            align-items: center;
        }
        
        .TokenList {
            width: 100%;
            height: 100%;
            overflow: auto;
            margin-top: 15px;
        }
        
        .TokenTitleWrap {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
            padding-left: 16px;
            padding-right: 70px;
        }
        
        .TokenWrapper {
            background-color: rgba(247, 247, 250, 1);
            border-radius: 15px;
            width: 325px;
            height: 80px;
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            border: 1.4px solid rgba(0, 0, 0, 0);
        }
        
        .TokenWrapper:hover {
            background-color: rgba(242, 243, 247, 1);
        }
        
        .TokenWrapper:active {
            background-color: rgba(239, 240, 243, 1);
        }
        
        .TokenSelectWrapper {
            border: 1.4px solid rgba(57, 187, 97, 1);
        }
        
        .TokenContainer {
            margin: 0 25px 0 25px;
            align-items: center;
            flex-direction: row;
            display: flex;
            width: 275px;
            display: -webkit-flex;
        }
        
        .TokenNeedWrap {
            display: flex;
            flex-direction: row;
            max-width: 200px;
        }
        
        .FixGrow {
            display: flex;
            flex-direction: row;
            flex: 1;
        }
        
        .LogoContainer {
            position: relative;
            display: flex;
            flex-direction: row;
            width: 60px;
        }
        
        .TokenLogo {
            width: 40px;
            height: auto;
        }
        
        .TokenChainLogo {
            z-index: 10;
            width: 20px;
            height: 20px;
            position: absolute;
            left: 30px;
            top: 20px;
        }
        
        .TokenOtherWrapper {
            margin-left: 15px;
            display: flex;
            flex-direction: column;
            display: -webkit-flex;
            max-width: 200px;
        }
        
        .TokenSymbol {
            color: rgba(3, 3, 25, 1);
            font-size: 20px;
            text-align: left;
            line-height: 24px;
            display: block;
            overflow: hidden;
            word-break: break-all;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        
        .TokenNeed {
            color: rgba(3, 3, 25, 1);
            font-size: 20px;
            text-align: left;
            line-height: 24px;
            display: block;
            margin-left: 8px;
            overflow: hidden;
            word-break: break-all;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        
        .TokenBalance {
            color: rgba(96, 101, 125, 1);
            font-size: 10px;
            text-align: left;
            line-height: 12px;
            margin-top: 4px;
            display: block;
            overflow: hidden;
            word-break: break-all;
            text-overflow:ellipsis;
            white-space: nowrap;
            max-width: 200px;
        }
        
        .TokenSelect {
            width: 16px;
            height: 16px;
        }
        
        .NoTokensWrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            position: relative;
        }
        
        .NoTokenTopPadding {
            flex-basis: 15px;
            max-height: 60px;
            flex-grow: 1;
        }
        
        .NoTokenMiddlePadding {
            flex-basis: 15px;
            max-height: 60px;
            flex-grow: 1;
        }
        
        .NoTokenBottomPadding {
            flex-basis: 33px;
            flex-grow: 1;
        }
        
        .NoTokenFailImg {
            width: 150px;
            height: 145px;
        }
        
        .NoTokenText {
            display: block;
            overflow-wrap: break-word;
            color: rgba(96, 101, 125, 1);
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .TransakImg {
          position: relative;
          height: 126px;
          width: 325px;
          background-image: var(--transak-normal-image);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
        
        .TransakImg:hover {
          border-radius: 12px;
          box-shadow: 0px 15px 30px 0px rgba(116, 116, 118, 0.08);
        }
        
        .CardHover {
          width: 325px;
          height: 126px;
          background-color: rgba(0, 0, 0, 0);
          zIndex: 1;
          position: absolute;
          left: 0;
          top: 0;
        }
        
        .CardHover:active {
          border-radius: 12px;
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .TokenTopPadding {
          min-height: 30px;
          max-height: 30px;
        }
        
        .TokenTitle {
          display: block;
          overflow-wrap: break-word;
          color: rgba(25, 28, 50, 1);
          font-size: 20px;
          white-space: nowrap;
          line-height: 24px;
          text-align: center;
          width: 100%;
        }
  `)
}
