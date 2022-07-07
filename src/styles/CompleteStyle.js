export default ()=>{
    return(`
        .Complete {
            flex: 1;
            display: flex;
            flex-direction: column;
            background-color: rgba(243, 245, 246, 1);
        }
        
        .CompleteTitle {
            display: block;
            overflow-wrap: break-word;
            color: rgba(3, 3, 25, 1);
            font-size: 32px;
            white-space: nowrap;
            line-height: 38px;
            text-align: center;
        }
        
        .CompleteCarBox {
            margin: 10px 25px 30px 25px;
        }
        
        .SpaceBetweenItem {
            height: 50px;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        
        .ItemName {
            display: block;
            overflow-wrap: break-word;
            color: rgba(143, 146, 161, 1);
            font-size: 14px;
            line-height: 50px;
            text-align: left;
            overflow: hidden;
        }
        
        .ItemValue {
            display: block;
            overflow-wrap: nowrap;
            color: rgba(3, 3, 25, 1);
            font-size: 14px;
            line-height: 50px;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .txId {
            max-width: 89px;
        }
        
        .ItemDivider {
            height: 1px;
            border: 1px dashed rgba(230, 230, 230, 1);
        }
        
        .CompleteNode {
            display: block;
            overflow-wrap: break-word;
            color: rgba(3, 3, 25, 1);
            font-size: 14px;
            line-height: 16px;
            text-align: left;
            margin-top: 20px;
            overflow: hidden;
        }
        
        .OkButton {
            height: 48px;
            margin: auto;
            border-radius: 24px;
            background-color: rgba(255, 255, 255, 1);
            width: 325px;
            display: flex;
            align-items: center;
            justify-content : center;
            cursor: pointer;
        }
        
        .OkButton:hover {
          background: rgba(252, 252, 252, 1);
        }

        .OkButton:active {
          background: rgba(250, 250, 250, 1);
        }
        
        .OkText {
            display: block;
            overflow-wrap: break-word;
            color: rgba(57, 187, 97, 1);
            font-size: 16px;
            white-space: nowrap;
            line-height: 19px;
            text-align: center;
        }
        
        .ToCenter {
            margin: auto;
        }
        
        .CopyWrapper {
            margin: 10px 0 0 0;
            padding: 10px 0 10px 0;
            display: flex;
            align-items: center;
            justify-content : center;
        }
        
        .CopyWrapper:hover .CopyText {
          color: rgba(54, 128, 250, 1);
        }
      
        .CopyWrapper:active .CopyText {
          color: rgba(27, 111, 249, 1);
        }
        
        .CopyText {
            display: block;
            overflow-wrap: break-word;
            color: rgba(80, 146, 255, 1);
            font-size: 15px;
            white-space: nowrap;
            line-height: 18px;
            text-align: left;
        }
        
        .CopyIcon {
            margin: 0 0 0 5px;
        }

        .WaitConfirm {
            margin: 20px 0 10px 0;
            display: block;
            font-size: 16px;
            color: rgba(57, 187, 97, 1);
            line-height: 24px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .FailedShadowCarBox {
            margin: 10px 25px 20px 25px;
        }
        
        .WaitShadowCarBox {
            margin: 10px 25px 30px 25px;
        }
        
        .RetryBottomMargin {
            height: 20px;
        }

        .NormalCar {
            margin: auto;
            border-radius: 25px;
            background-color: rgba(255, 255, 255, 1);
            width: 325px;
        }
  `)
}
