import {AuthContext} from "../context/userAuth.js"
import { useContext } from "react";

export const Auth = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw Error("error just found try again")
    }
    return context
}