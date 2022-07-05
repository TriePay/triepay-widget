import ConfigContext from './ConfigContext'
import React, {useState} from 'react'

export default (props)=>{
    const [quantity, setQuantity] = useState(props.config.quantity || 1);
    const isConfigQuantity = !!props.config.quantity;

    return(
        <ConfigContext.Provider value={{...props.config, setQuantity, quantity, isConfigQuantity}}>
            { props.children }
        </ConfigContext.Provider>
    )
}

