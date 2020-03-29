import React, { useState, useContext, useEffect } from "react";


export const MainContext = React.createContext();
export const useMainContext = () => useContext(MainContext);
export const MainProvider = ({children}) => {
  const [activeState, setActiveState] = useState(null);
  
//   useEffect(()=> {
//     console.log(activeState)
//   }, [activeState])

  return (
    <MainContext.Provider
      value={{
          activeState,
          setActiveState
      }}
    >
      {children}
    </MainContext.Provider>
  );
};