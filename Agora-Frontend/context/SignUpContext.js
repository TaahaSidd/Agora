import React, { createContext, useState } from 'react';

export const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        mobile: '',
        idCard: '',
        college: '',
        password: '',
        confirmPassword: '',
    });

    const updateForm = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SignUpContext.Provider value={{ form, updateForm }}>
            {children}
        </SignUpContext.Provider>
    );
};
