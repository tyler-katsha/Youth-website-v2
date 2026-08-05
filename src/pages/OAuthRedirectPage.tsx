import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { HomeSkeleton } from "../skeletons/pages/HomeSkeleton";

export const OAuth2Redirect = () => {
    const { fetchUser } = useUser();
    const navigate = useNavigate();

    const run = async () => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
            navigate("/login?error=token_missing", { replace: true });
            return;
        }

        try {
            localStorage.setItem("jwt_token", token);

            window.history.replaceState({}, document.title, window.location.pathname);

            await fetchUser();
            
            navigate("/", { replace: true });
        } catch (err) {
            localStorage.removeItem("jwt_token");
            navigate("/login?error=authentication_failed", { replace: true });
        }
    };

    useEffect(() => {
        run();
    }, []);

    return <HomeSkeleton />;
};