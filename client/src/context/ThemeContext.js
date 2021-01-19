import React, { useState, useContext } from 'react'

const ThemeContext = React.createContext()

export function useThemeContext() {
    return useContext(ThemeContext)
}

export default function ThemeContextProvider(props) {
    const [theme, setTheme] = useState(false)

    const newTheme = () => {
        console.log(theme);
        setTheme(true)
    }

    const oldTheme = () => {
        setTheme(false)
    }

    return (
        <ThemeContext.Provider value={{ theme, newTheme, oldTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}


