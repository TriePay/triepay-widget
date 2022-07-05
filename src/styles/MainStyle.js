export default () => {
    return(`
    
      .App {
        height: 100%;
        width: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
      }
      
      .MaxHeight {
        max-height: 812px;
      }
      
      .MaxHeightNT {
        max-height: 754px;
      }
      
      @media screen and (min-width: 480px) {
        .AppPadding {
          min-height: 30px;
          flex-grow: 1;
        }
        
        .BasisHeight {
            flex-basis: 621px;
        }
        
        .BasisHeightEx {
            flex-basis: 543px;
        }
      
        .AppWrapper {
          height: 100%;
          width: 375px;
          display: flex;
          display: -webkit-flex;
          background: white;
          box-shadow: 0px 0px 35px 0px rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          overflow: hidden;
          justify-content: center;
        }
      }
      
      @media screen and (max-width: 480px) {
        .AppPadding {
            height: 0px;
        }
        
        .BasisHeight {
        }
        
        .BasisHeightEx {
        }
        
        .AppWrapper {
            height: 100%;
            width: 100%;
            display: flex;
            display: -webkit-flex;
            background: white;
            justify-content: center;
        }
      }
    
      .Main {
        width: 100%;
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        position: relative;
      }
      
      .MainContainer {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
      }
      
      .MarginTop30 {
        margin-top: 30px;
      }
            
      .MarginTop20 {
        margin-top: 20px;
      }
      
      .MarginTop27 {
        margin-top: 27px;
      }
      
      .MarginTop59 {
        margin-top: 59px;
      }
      
      .MarginTop21 {
        margin-top: 21px;
      }
      
      .MarginTop75 {
        margin-top: 75px;
      }
      
      .MarginTop37 {
        margin-top: 37px;
      }
      
      .BaseTopPadding {
        max-height: 30px;
        flex-grow: 1;
      }
      
      .BottomPadding {
        flex-grow: 1;
      }
      
      .ImgBackground {
        width: 300px;
        height: 200px;
        position: absolute;
        top: 0;
        right: 0;
      }

      .MainTitle {
        height: 38px;
        display: block;
        overflow-wrap: break-word;
        color: rgba(3, 3, 25, 1);
        font-size: 32px;
        white-space: nowrap;
        line-height: 38px;
        text-align: center;
      }

      .ShadowCar {
        margin: auto;
        border-radius: 25px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 15px 30px 0px rgba(116, 116, 118, 0.08);
        width: 325px;
      }
      
      .ShadowCarBox {
        margin: 30px;
      }
      
      .FlexRow {
        flex-direction: row;
        align-items: center;
        display: -webkit-flex;
        display: flex;
      }
      
      .Flex1 {
        flex: 1;
      }
      
      .FlexGrow1 {
        flex-grow: 1;
      }
      
      .TokenIcon {
        width: 42px;
        height: 42px;
      }
      
      .TokenText {
        display: block;
        overflow-wrap: break-word;
        color: rgba(96, 101, 125, 1);
        font-size: 20px;
        white-space: nowrap;
        line-height: 24px;
        text-align: center;
        margin: 0 0 0 10px;
      }
      
      .SelectToken {
        overflow-wrap: normal;
        color: rgba(80, 146, 255, 1);
        font-size: 14px;
        white-space: nowrap;
        line-height: 16px;
        text-align: right;
        border: 0;
        background-color: transparent;
        cursor: pointer;
      }
      
      .SelectToken:hover {
        color: rgba(54, 128, 250, 1);
      }
      
      .SelectToken:active {
        color: rgba(27, 111, 249, 1);
      }
      
      .Amount {
        height: 42px;
        display: block;
        overflow-wrap: break-word;
        color: rgba(38, 39, 60, 1);
        font-size: 42px;
        white-space: nowrap;
        line-height: 42px;
        text-align: left;
        margin-top: 25px;
      }
      
      .Money {
        height: 21px;
        display: block;
        overflow-wrap: break-word;
        color: rgba(143, 146, 161, 1);
        font-size: 18px;
        white-space: nowrap;
        line-height: 21px;
        text-align: left;
        margin-top: 10px;
      }
      
      .InputCountWrapper {
        height: 40px;
        margin-top: 25px;
        border-radius: 20px;
        border: 1.111111111111111px solid rgba(225, 225, 225, 1);
        background-color: rgba(255, 255, 255, 1);
        flex-direction: row;
        display: flex;
        align-items: center;
      }
      
      .fillInputCount {
        margin-top: 65px;
      } 
      
      .DecreaseWrapper {
        width: 28px;
        height: 38px;
        background: rgba(246, 245, 248, 1);
        border-radius: 100px 0px 0px 100px;
        display: flex;
        align-items: center;
        justify-content : center;
        cursor: pointer;
      }
      
      .DecreaseWrapper:hover {
        background: rgba(244, 243, 246, 1);
      }
      
      .DecreaseWrapper:active {
        background: rgba(240, 240, 243, 1);
      }
      
      .DecreaseImg {
        width: 10px;
        height: 10px;
      }
      
      .IncreaseWrapper {
        width: 28px;
        height: 38px;
        background: rgba(246, 245, 248, 1);
        border-radius: 0px 100px 100px 0px;
        display: flex;
        align-items: center;
        justify-content : center;
        cursor: pointer;
      }
      
      .IncreaseWrapper:hover {
        background: rgba(244, 243, 246, 1);
      }
      
      .IncreaseWrapper:active {
        background: rgba(240, 240, 243, 1);
      }
      
      .CountText {
        min-width: 52px;
        display: block;
        overflow-wrap: break-word;
        color: rgba(38, 39, 60, 1);
        font-size: 22px;
        white-space: nowrap;
        line-height: 26px;
        text-align: center;
      }
      
      .ButtonNormal {
        height: 48px;
        width: 325px;
        margin: auto;
        border-radius: 24px;
        border: 0;
        background-color: rgba(226, 245, 232, 1);
        display: inline-block;
        overflow-wrap: break-word;
        font-size: 16px;
        white-space: nowrap;
        line-height: 24px;
        text-align: center;
        text-decoration: none;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
      }
      
      .ButtonNormal, .ButtonNormal * {
        color: rgba(57, 187, 97, 1);
      }
      
      .ButtonNormal:disabled {
        background-color: rgba(241, 241, 241, 1);
        color: rgba(166, 166, 166, 1);
      }
      
      .ButtonNormal:not(:disabled):hover {
        background-color: rgba(215, 241, 223, 1);
      }
      
      .ButtonNormal:not(:disabled):active {
        background-color: #CDEED7;
      }
      
      .ButtonMarinTop {
        margin-top: 12px;
      }
      
      .InsufficientBalance {
        display: block;
        overflow-wrap: break-word;
        color: rgba(143, 146, 161, 1);
        font-size: 14px;
        white-space: nowrap;
        line-height: 16px;
        text-align: center;
        marin-top: 29px;
      }
      
      .ActionWrapper {
        height: 108px;
        min-height: 108px;
        width: 325px;
        margin: auto;
        display: flex;
        flex-direction: column;
        margin-bottom: 30px;
      }
      
      .LoadingDiv {
        flex-direction: row;
        align-items: center;
        position: relative;
      }
      
      .LoadingBtn {
        display: flex;
        flex-direction: row;
        align-items: center;
        marginTop: 10px;
      }
      
      .PoweredByWrapper {
        margin: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 22px;
      }
      
      .PoweredBy {
        display: block;
        overflow-wrap: break-word;
        color: rgba(170, 170, 170, 1);
        font-size: 12px;
        white-space: nowrap;
        line-height: 14px;
      }
      
      .PoweredByIcon {
        height: 21px;
        width: 60px;
        margin-left: 10px;
        cursor: pointer;
      }

  `)
}
