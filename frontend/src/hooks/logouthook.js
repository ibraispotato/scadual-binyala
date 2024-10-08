import {Auth} from "./loginHook"


export const useLOgOut = () => {
    const { dispatch } = Auth()

    const logout = () => {
        localStorage.removeItem("user")
        dispatch({ type: 'LOGOUT' })
    }
    return {logout}
}