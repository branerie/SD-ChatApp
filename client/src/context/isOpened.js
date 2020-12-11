import React, {useState, useContext, useEffect} from 'react'

const IsOpenedContext = React.createContext()

export function IsOpenedUseContext() {
    return useContext(IsOpenedContext)
}


export default function  IsOpened (props) {

    const [openedTreads, setOpenedTreads] = useState({})

    useEffect(()=>{
        console.log(openedTreads)
        return
    },[openedTreads])
    
    const changeOpenState = (chatWindow, state) => {
        setOpenedTreads({
            ...openedTreads,
            [chatWindow]: state
        })
    }

    return (
        <IsOpenedContext.Provider value={{openedTreads, changeOpenState}}>
            {props.children}
        </IsOpenedContext.Provider>
    )
}


