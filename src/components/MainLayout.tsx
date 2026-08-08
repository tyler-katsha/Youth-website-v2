import { Outlet } from "react-router-dom"
import { Footer } from "./Footer"
import { Navigation } from "./Navigation"

export const MainLayout = () => {

    return (
        <>
            <Navigation title='Youth Engedi' />
            <Outlet />
            <Footer />
        </>
    )
}