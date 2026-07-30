import { MemberList } from '../components/MemberList';
import {Navigation} from '../components/Navigation';
import { useUser } from '../contexts/UserContext';
import { RedirectUser } from '../components/RedirectUser';
import { MembersSkeleton } from '../skeletons/pages/MembersSkeleton';
import { Footer } from '../components/Footer';

export const Members = () => {

    const {user,isLoading} = useUser();

    if(isLoading){
        return <MembersSkeleton/>
    }
    if(!user){
        return <RedirectUser/>;
    }
    return(
        <>
            <Navigation title='Engedi Members' />  
            <MemberList title={'Engedi Members'}/>
            <Footer/>
        </>
    )
}