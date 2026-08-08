import { MemberList } from '../components/MemberList';
import { useUser } from '../contexts/UserContext';
import { RedirectUser } from '../components/RedirectUser';
import { MembersSkeleton } from '../skeletons/pages/MembersSkeleton';

export const Members = () => {

    const {user,isLoading} = useUser();

    if(isLoading){
        return <MembersSkeleton/>
    }
    if(!user){
        return <RedirectUser/>;
    }
    return <MemberList title={'Engedi Members'}/>
}