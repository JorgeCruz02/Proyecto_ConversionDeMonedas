import { createContext, useState } from 'react';

export const MyContext = createContext({
	loginData:{},
	setLoginData:()=>{},
});

export const MyContextProvider = ({children})=>{
	const [loginData, setLoginData]=useState({});

	return (
		<MyContext.Provider value={{loginData, setLoginData}}>
			{children}
		</MyContext.Provider>
	);

};