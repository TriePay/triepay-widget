import NavigateContext from './NavigateContext'
import React, { useState } from 'react'

export default (props)=>{

  const [navigator, setNavigator] = useState(props.initView);
  const [params, setParams] = useState({});

  const navigate = (name, paramsTemp = {})=>{
    if (name != navigator) {
      setNavigator(name);
    }
    if (paramsTemp != params) {
      setParams(paramsTemp);
    }
  }

  return(
    <NavigateContext.Provider value={{
      navigator,
      setNavigator,
      navigate,
      params
    }}>
      { props.children }
    </NavigateContext.Provider>
  )
}
