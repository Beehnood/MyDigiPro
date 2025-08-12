import {  ReactNode, createContext, useContext} from 'react'
import { useNavigate } from 'react-router-dom';


interface ExitContextProps{
     goBack: () => void;
}

const ExitContext = createContext<ExitContextProps  | undefined>(undefined);

export const ExitProvider = ({children} : {children : ReactNode}) => {

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };


    return(
        <ExitContext.Provider value={{goBack}}>
            {children}
        </ExitContext.Provider>

    );
    };

export const useExit = () => {
    const context = useContext(ExitContext);
    if(!context) {
        throw new Error ("useExit must be used within an ExitProvider");
    }
    return context;

}