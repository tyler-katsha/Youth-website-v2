import type { AnnouncementProps, NotificationProps, YouthProfileProps } from "./types";

export const memberData = [
    { id: 0, name: "Leigh Dowman", age: 21, image: undefined },
    { id: 1, name: "Alice Johnson", age: 28, image: undefined },
    { id: 2, name: "Michael Smith", age: 34, image: undefined },
    { id: 3, name: "Sophia Martinez", age: 24, image: undefined },
    { id: 4, name: "James Brown", age: 41, image: undefined },
    { id: 5, name: "Emma Wilson", age: 29, image: undefined },
    { id: 6, name: "Oliver Taylor", age: 31, image: undefined },
    { id: 7, name: "Isabella Anderson", age: 26, image: undefined },
    { id: 8, name: "William Thomas", age: 38, image: undefined },
    { id: 9, name: "Mia Jackson", age: 22, image: undefined },
    { id: 10, name: "Lucas White", age: 45, image: undefined },
    { id: 11, name: "Charlotte Harris", age: 27, image: undefined },
    { id: 12, name: "Alexander Martin", age: 33, image: undefined },
    { id: 13, name: "Amelia Thompson", age: 30, image: undefined },
    { id: 14, name: "Ethan Garcia", age: 25, image: undefined },
    { id: 15, name: "Harper Martinez", age: 29, image: undefined },
    { id: 16, name: "Benjamin Robinson", age: 42, image: undefined },
    { id: 17, name: "Evelyn Clark", age: 35, image: undefined },
    { id: 18, name: "Henry Rodriguez", age: 28, image: undefined },
    { id: 19, name: "Abigail Lewis", age: 31, image: undefined },
    { id: 20, name: "Sebastian Lee", age: 24, image: undefined },
    { id: 21, name: "Emily Walker", age: 37, image: undefined },
    { id: 22, name: "Jack Hall", age: 26, image: undefined },
    { id: 23, name: "Elizabeth Allen", age: 32, image: undefined },
    { id: 24, name: "Owen Young", age: 40, image: undefined },
    { id: 25, name: "Sofia Hernandez", age: 23, image: undefined },
    { id: 26, name: "Matthew King", age: 36, image: undefined },
    { id: 27, name: "Avery Wright", age: 29, image: undefined },
    { id: 28, name: "Samuel Lopez", age: 34, image: undefined },
    { id: 29, name: "Ella Hill", age: 27, image: undefined },
    { id: 30, name: "David Scott", age: 44, image: undefined },
    { id: 31, name: "Chloe Green", age: 25, image: undefined },
    { id: 32, name: "Joseph Adams", age: 39, image: undefined },
    { id: 33, name: "Victoria Baker", age: 31, image: undefined },
    { id: 34, name: "Carter Gonzalez", age: 28, image: undefined },
    { id: 35, name: "Grace Nelson", age: 33, image: undefined },
    { id: 36, name: "John Carter", age: 41, image: undefined },
    { id: 37, name: "Lily Mitchell", age: 26, image: undefined },
    { id: 38, name: "Luke Perez", age: 35, image: undefined },
    { id: 39, name: "Hannah Roberts", age: 30, image: undefined },
    { id: 40, name: "Jayden Turner", age: 24, image: undefined },
    { id: 41, name: "Lillian Phillips", age: 38, image: undefined },
    { id: 42, name: "Dylan Campbell", age: 29, image: undefined },
    { id: 43, name: "Addison Parker", age: 32, image: undefined },
    { id: 44, name: "Levi Evans", age: 27, image: undefined },
    { id: 45, name: "Aubrey Edwards", age: 43, image: undefined },
    { id: 46, name: "Isaac Collins", age: 25, image: undefined },
    { id: 47, name: "Stella Stewart", age: 36, image: undefined },
    { id: 48, name: "Gabriel Sanchez", age: 31, image: undefined },
    { id: 49, name: "Zoe Morris", age: 28, image: undefined },
    { id: 50, name: "Julian Rogers", age: 34, image: undefined }
];

export const membersData: YouthProfileProps[] = [
    {
        name: "Caleb Andrews",
        age: 16,
        roles: ["MEMBER"],
        email:'fake@example.com',
        enabled:true,
        dateOfBirth:'2000-01-12',
        bio: "I've been coming to Engedi Youth for 2 years! I love playing video games, soccer, and hanging out with my small group.",
        authProvider: 'OAUTH2'
    },
    {
        name: "Sarah Jenkins",
        age: 22,
        email:'fake1@example.com',
        roles: ["YOUTH_LEADER"],
        dateOfBirth:'2001-12-12',
        enabled:true,
        bio: "Currently studying at university. Passionate about worship and helping students grow in their faith.",
        profileImageUrl: "https://i.pravatar.cc/150?img=47", // Sample placeholder image
        authProvider: 'OAUTH2'
    },
    {
        name: "Marcus Chen",
        age: 28,
        roles: ["YOUTH_LEADER"],
        email:'fake2@example.com',
        enabled:true,
        dateOfBirth:'2002-10-29',
        bio: "Youth Pastor at Engedi Community Church. Coffee enthusiast and avid reader.",
        profileImageUrl: "https://i.pravatar.cc/150?img=11",
         authProvider: 'OAUTH2'
    },
    {
        name: "Chloe Davis",
        age: 15,
        dateOfBirth:'2009-06-14',
        roles: ["GUEST"],
        enabled:true,
        email:'fake12@example.com',
        authProvider: 'OAUTH2'
    }
];

export const requestData = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Pending" },
    { id: 2, name: "Michael Smith", email: "mike@example.com", status: "Pending" },
    { id: 3, name: "Sophia Martinez", email: "sophia@example.com", status: "Pending" },
];

export const galleryImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?auto=format&fit=crop&w=800&q=80', alt: 'Youth hanging out' },
    { id: 2, url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80', alt: 'Worship night crowd' },
    { id: 3, url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', alt: 'Group games' },
    { id: 4, url: 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=800&q=80', alt: 'Summer retreat' },
    { id: 5, url: 'https://images.unsplash.com/photo-1544427920-c49ccf08c146?auto=format&fit=crop&w=800&q=80', alt: 'Outdoor circle' },
    { id: 6, url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80', alt: 'Friends laughing' },
    { id: 7, url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=800&q=80', alt: 'Campfire' },
    { id: 8, url: 'https://images.unsplash.com/photo-1526976663186-5920202a0a2b?auto=format&fit=crop&w=800&q=80', alt: 'Hiking trip' },
];

export const notificationsMockData:NotificationProps[] = [
  { id: 1, type: 'INFO', title: 'System Update', message: 'The platform will undergo maintenance at 2 AM.', time: '10m ago', isRead: false },
  { id: 2, type: 'SUCCESS', title: 'Role Approved', message: 'Your request for Administrator access was approved.', time: '1h ago', isRead: false },
  { id: 3, type: 'WARNING', title: 'Event Cancelled', message: 'The Q3 Planning event has been cancelled.', time: '2h ago', isRead: true },
  { id: 4, type: 'INFO', title: 'New Feature', message: 'Dark mode is now available in your settings.', time: '3h ago', isRead: true },
  { id: 5, type: 'SUCCESS', title: 'Upload Complete', message: 'Your Q2 financial report has been successfully uploaded.', time: '5h ago', isRead: false },
  { id: 6, type: 'WARNING', title: 'Storage Almost Full', message: 'You have used 95% of your allocated cloud storage.', time: 'Yesterday', isRead: true },
  { id: 7, type: 'INFO', title: 'Meeting Reminder', message: 'Standup starts in 15 minutes. Link is in your calendar.', time: 'Yesterday', isRead: true },
  { id: 8, type: 'SUCCESS', title: 'Password Reset', message: 'Your password was successfully updated.', time: 'Yesterday', isRead: true },
  { id: 9, type: 'WARNING', title: 'Failed Login Attempt', message: 'We noticed a failed login from an unrecognized device.', time: '2 days ago', isRead: false },
  { id: 10, type: 'INFO', title: 'Weekly Digest', message: 'Check out your analytics summary for this past week.', time: '2 days ago', isRead: true },
  { id: 11, type: 'SUCCESS', title: 'Invite Accepted', message: 'Sarah Jenkins has accepted your workspace invitation.', time: '3 days ago', isRead: true },
  { id: 12, type: 'INFO', title: 'Subscription Renewed', message: 'Your Pro plan has been automatically renewed for the month.', time: '3 days ago', isRead: true },
  { id: 13, type: 'WARNING', title: 'API Rate Limit', message: 'You are approaching your hourly API request limit.', time: '4 days ago', isRead: true }];

export const mockAnnouncements: AnnouncementProps[] = [
  {
    id: 1,
    type: 'ERROR',
    title: 'Critical Service Interruption',
    message: 'The main database is experiencing severe latency, affecting login and dashboard loading times. Engineering is investigating.',
    createdAt: '11:00 AM, Today',
    expiresAt: '2026-07-22 12:00 PM', // Future date
    isUrgent: true
  },
  {
    id: 2,
    type: 'INFO',
    title: 'Welcome to the New Interface',
    message: 'We have completely redesigned the UI to help you navigate faster and find exactly what you need. Take the interactive tour!',
    createdAt: 'July 20, 2026',
    expiresAt: 'Never', // Never expires
    isUrgent: false
  },
  {
    id: 3,
    type: 'WARNING',
    title: 'Scheduled Maintenance Window',
    message: 'The system will be down for scheduled database migrations this Sunday from 02:00 AM to 04:00 AM SAST.',
    createdAt: 'July 19, 2026',
    expiresAt: '2026-07-26 05:00 AM', // Future date
    isUrgent: true
  },
  {
    id: 4,
    type: 'EVENT',
    title: 'Q3 Townhall Meeting',
    message: 'Join us for the upcoming company townhall where leadership will discuss the roadmap for the next quarter.',
    createdAt: 'July 15, 2026',
    expiresAt: '2026-08-01 02:00 PM', // Future date
    isUrgent: false
  },
  {
    id: 5,
    type: 'SUCCESS',
    title: 'Deployment Successful',
    message: 'Version 2.5.0 has been successfully deployed to the production environment with zero downtime.',
    createdAt: 'July 10, 2026',
    expiresAt: '2026-07-12 12:00 PM', // Past date (Expired - good for testing your filter)
    isUrgent: false
  },
  {
    id: 6,
    type: 'SYSTEM',
    title: 'Updated Privacy Policy',
    message: 'We have updated our terms of service and privacy policy to comply with new regulations. Please review them.',
    createdAt: 'July 01, 2026',
    expiresAt: 'Never',
    isUrgent: false
  }
];