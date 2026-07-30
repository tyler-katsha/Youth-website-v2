import { useLocation } from "react-router-dom";
import { skeletonRegistry } from "./skeletonRegistry";
import { DefaultSkeleton } from "../pages/DefaultSkeleton";
import { useLoading } from "../../contexts/GlobalLoadingContext";

export const skeletonWrapper = ({children}:{children:React.ReactNode}) => {
    const {isLoading} = useLoading();
    const location = useLocation();

    if(isLoading){
        return skeletonRegistry[location.pathname] ?? <DefaultSkeleton/>;
    }

    return <>{children}</>
}