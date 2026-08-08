import { Navigate } from "react-router-dom"

export const RedirectUser = () => {
    return(
        <>
        <div style={{ textAlign: "center", marginTop: "50px" }}>Redirecting to login...</div>
        <Navigate to='/login' replace/>
        </>
    )
}