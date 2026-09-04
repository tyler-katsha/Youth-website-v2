import { CalendarSkeleton } from "../pages/CalendarSkeleton";
import { ContactSkeleton } from "../pages/ContactSkeleton";
import { GallerySkeleton } from "../pages/GallarySkeleton";
import { HomeSkeleton } from "../pages/HomeSkeleton";
import { LogsSkeleton } from "../pages/LogsSkeleton";
import { MembersSkeleton } from "../pages/MembersSkeleton";
import { ProfileSkeleton } from "../pages/ProfileSkeleton";

export const skeletonRegistry: Record<string, React.ReactNode> = {
    '/': <HomeSkeleton />,
    '/home': <HomeSkeleton />,
    '/profile': <ProfileSkeleton />,
    '/members': <MembersSkeleton />,
    '/logs': <LogsSkeleton />,
    '/calendar': <CalendarSkeleton />,
    '/contact-us': <ContactSkeleton />,
    '/gallery': <GallerySkeleton />,
}