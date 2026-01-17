import React, { createContext, useState } from 'react';

export const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        userEmail: '',
        mobileNumber: '',
        idCardNo: '',
        collegeId: null,
        password: '',
        confirmPassword: '',
    });

    const updateForm = (field, value) => {
        setForm(prev => {
            let updated = { ...prev, [field]: value };

            if (field === 'firstName' || field === 'lastName') {
                const fn = updated.firstName?.trim().toLowerCase() || '';
                const ln = updated.lastName?.trim().toLowerCase() || '';
                if (fn || ln) {
                    updated.userName = fn && ln ? fn + '_' + ln : fn + ln;
                } else {
                    updated.userName = '';
                }
            }

            return updated;
        });
    };

    return (
        <SignUpContext.Provider value={{ form, updateForm }}>
            {children}
        </SignUpContext.Provider>
    );
};
