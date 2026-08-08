import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login } from './pages/Login'
import { ProfilePage } from './pages/ProfilePage'
import { Register } from './pages/Register'
import { Members } from './pages/Members'
import { CalendarPage } from './pages/CalendarPage'
import { ContactPage } from './pages/ContactPage'
import { Gallery } from './pages/GalleryPage'
import { Logs } from './pages/Logs'
import { UserProvider } from './contexts/UserContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Performance } from './pages/Performance'
import { ProtectedRoute } from './components/ProtectedRoute'
import { OAuth2Redirect } from './pages/OAuthRedirectPage'
import { VerifyEmail } from './pages/VerifyEmail'
import { Home } from './pages/Home'
import { ResetPassword } from './pages/ResetPassword'
import { ThemeProvider } from './contexts/ThemeContext'
import { ResetEmail } from './pages/ResetEmail'
import { MainLayout } from './components/MainLayout'
import { LoadingProvider } from './contexts/GlobalLoadingContext'

function App() {

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/reset-email",
      element: <ResetEmail />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/verify",
      element: <VerifyEmail />,
    },
    {
      path: "/oauth2/redirect",
      element: <OAuth2Redirect />,
    },
    // Routes using MainLayout
    {
      element: <MainLayout />,
      errorElement:
        <ErrorBoundary
          title="Application Error"
          message="Something unexpected went wrong. Please reload the app."
        />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/contact-us",
          element: <ContactPage />,
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/members",
          element: (
            <ProtectedRoute>
              <Members />
            </ProtectedRoute>
          ),
        },
        {
          path: "/calendar",
          element: (
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/logs",
          element: (
            <ProtectedRoute>
              <Logs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/gallery",
          element: (
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          ),
        },
        {
          path: "/performances",
          element: (
            <ProtectedRoute>
              <Performance />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <UserProvider>
      <LoadingProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </LoadingProvider>
    </UserProvider>

  )
}

export default App
