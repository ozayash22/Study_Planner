import React, { createContext, useContext, useState } from 'react';

// No longer need to import useNavigate here

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    // The useNavigate hook is removed from here

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    // The logout function is now simpler. It only clears the token.
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);