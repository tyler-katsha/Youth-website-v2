import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { HomeSkeleton } from "../skeletons/pages/HomeSkeleton";

export const OAuth2Redirect = () => {
    const { fetchUser } = useUser();
    const navigate = useNavigate();

    const run = async () => {
        await fetchUser();
        navigate("/");
    };

    useEffect(() => {
        run();
    }, []);

    return <HomeSkeleton />;
};