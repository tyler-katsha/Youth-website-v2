import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login'
import { ProfilePage } from './pages/ProfilePage'
import { Register } from './pages/Register'
import { Members } from './pages/Members'
import { CalendarPage } from './pages/CalendarPage'
import { ContactPage } from './pages/ContactPage'
import { Gallery } from './pages/GalleryPage'
// import { RequestsPage } from './pages/RequestsPage'
import { Logs } from './pages/Logs'
import { UserProvider } from './contexts/UserContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingProvider } from './contexts/GlobalLoadingContext'
import { Performance } from './pages/Performance'
import { ProtectedRoute } from './components/ProtectedRoute'
import { OAuth2Redirect } from './pages/OAuthRedirectPage'
import { VerifyEmail } from './pages/VerifyEmail'
import { Home } from './pages/Home'
import { ResetPassword } from './pages/ResetPassword'
import { About } from './pages/About'
// import { TestPopup } from './pages/TestPopup'
// import { TestEmail } from './pages/TestEmails'
import { ThemeProvider } from './contexts/ThemeContext'
// import { Announcement } from './pages/Announcement'
import { ResetEmail } from './pages/ResetEmail'

function App() {


  return (
    <UserProvider>
      <LoadingProvider>
        <ThemeProvider>
          <BrowserRouter>

            <ErrorBoundary title="Application error" message="Something unexpected went wrong. Please reload the app.">
              <Routes>

                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                <Route path="/contact-us" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
                {/* <Route path="/request-page" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} /> */}
                <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
                <Route path="/performances" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
                <Route path="/oauth2/redirect" element={<ProtectedRoute><OAuth2Redirect /></ProtectedRoute>} />
                <Route path="/verify" element={<ProtectedRoute><VerifyEmail /></ProtectedRoute>} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-email" element={<ResetEmail />} />
                {/* <Route path="/test-popup" element={<ProtectedRoute><TestPopup /></ProtectedRoute>} /> */}
                {/* <Route path="/test-emails" element={<ProtectedRoute><TestEmail /></ProtectedRoute>} /> */}
                {/* <Route path="/announcements" element={<ProtectedRoute><Announcement /></ProtectedRoute>} /> */}
              </Routes>

            </ErrorBoundary>

          </BrowserRouter>
        </ThemeProvider>
      </LoadingProvider>
    </UserProvider>

  )
}

export default App
