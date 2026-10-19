import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import NearbyHospitalsPage from './pages/NearbyHospitalsPage';
import BloodDrivesPage from './pages/BloodDrivesPage';
import UserLoginPage from './pages/UserLoginPage';
import UserRegisterPage from './pages/UserRegisterPage';
import DonorHomePage from './pages/DonorHomePage';
import HospitalLoginPage from './pages/HospitalLoginPage';
import HospitalRegisterPage from './pages/HospitalRegisterPage';
import HospitalHomePage from './pages/HospitalHomePage';
import HospitalPostRequestPage from './pages/HospitalPostRequestPage';
import HospitalRequestsViewPage from './pages/HospitalRequestsViewPage';
import BloodBankLoginPage from './pages/BloodBankLoginPage';
import BloodBankHomePage from './pages/BloodBankHomePage';
import BloodBankAnnounceDrivePage from './pages/BloodBankAnnounceDrivePage';
import { darkTheme, lightTheme } from './theme';

function App() {
  // Theme state: dark theme is primary default
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // View state: each view is ONE feature on ONE page
  const [view, setView] = useState('landing');
  const [previousView, setPreviousView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  const navigateTo = (newView) => {
    setPreviousView(view);
    setView(newView);
    window.scrollTo({ top: 0 });
  };

  const goBack = () => {
    setView(previousView || 'landing');
    window.scrollTo({ top: 0 });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
    window.scrollTo({ top: 0 });
  };

  // 1. Single Feature: Nearby Hospitals
  if (view === 'nearby-hospitals') {
    return (
      <NearbyHospitalsPage
        onBack={goBack}
        currentUser={currentUser}
        defaultCity={currentUser?.city || 'Mumbai'}
        onGoToLogin={() => navigateTo('user-login')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 2. Single Feature: Active Blood Collection Drives
  if (view === 'blood-drives') {
    return (
      <BloodDrivesPage
        onBack={goBack}
        currentUser={currentUser}
        onGoToLogin={() => navigateTo('user-login')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 3. Single Feature: Donor Registration
  if (view === 'user-register') {
    return (
      <UserRegisterPage
        onBack={goBack}
        onGoToLogin={() => navigateTo('user-login')}
        onRegisterSuccess={(profile) => {
          setCurrentUser(profile);
          navigateTo('donor-home');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 4. Single Feature: Donor Login
  if (view === 'user-login') {
    return (
      <UserLoginPage
        onBack={goBack}
        onGoToRegister={() => navigateTo('user-register')}
        onLoginSuccess={(profile) => {
          setCurrentUser(profile);
          navigateTo('donor-home');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 5. Single Feature: Donor Portal Home
  if (view === 'donor-home') {
    return (
      <DonorHomePage
        user={currentUser}
        onFindHospitals={() => navigateTo('nearby-hospitals')}
        onViewDrives={() => navigateTo('blood-drives')}
        onLogout={handleLogout}
        onGoHome={() => navigateTo('landing')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 6. Single Feature: Hospital Login
  if (view === 'hospital-login') {
    return (
      <HospitalLoginPage
        onBack={goBack}
        onGoToRegister={() => navigateTo('hospital-register')}
        onLoginSuccess={(profile) => {
          setCurrentUser(profile);
          navigateTo('hospital-home');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 6b. Single Feature: Hospital Registration
  if (view === 'hospital-register') {
    return (
      <HospitalRegisterPage
        onBack={goBack}
        onGoToLogin={() => navigateTo('hospital-login')}
        onRegisterSuccess={(profile) => {
          setCurrentUser(profile);
          navigateTo('hospital-home');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 7. Single Feature: Hospital Portal Home
  if (view === 'hospital-home') {
    return (
      <HospitalHomePage
        user={currentUser}
        onPostRequest={() => navigateTo('hospital-post-request')}
        onViewRequests={() => navigateTo('hospital-requests-view')}
        onLogout={handleLogout}
        onGoHome={() => navigateTo('landing')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 8. Single Feature: Hospital Broadcast Blood Request
  if (view === 'hospital-post-request') {
    return (
      <HospitalPostRequestPage
        user={currentUser}
        onBack={() => navigateTo('hospital-home')}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 9. Single Feature: Hospital View Live Requests
  if (view === 'hospital-requests-view') {
    return (
      <HospitalRequestsViewPage
        user={currentUser}
        onBack={() => navigateTo('hospital-home')}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 10. Single Feature: Blood Bank Login
  if (view === 'bloodbank-login') {
    return (
      <BloodBankLoginPage
        onBack={goBack}
        onLoginSuccess={(profile) => {
          setCurrentUser(profile);
          navigateTo('bloodbank-home');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 11. Single Feature: Blood Bank Portal Home
  if (view === 'bloodbank-home') {
    return (
      <BloodBankHomePage
        user={currentUser}
        onAnnounceDrive={() => navigateTo('bloodbank-announce-drive')}
        onViewDrives={() => navigateTo('blood-drives')}
        onLogout={handleLogout}
        onGoHome={() => navigateTo('landing')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 12. Single Feature: Blood Bank Announce Collection Drive
  if (view === 'bloodbank-announce-drive') {
    return (
      <BloodBankAnnounceDrivePage
        user={currentUser}
        onBack={() => navigateTo('bloodbank-home')}
        onLogout={handleLogout}
        onViewDrives={() => navigateTo('blood-drives')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // Default: Landing Page
  return (
    <LandingPage
      currentUser={currentUser}
      onNavigate={navigateTo}
      onLogout={handleLogout}
      theme={theme}
      toggleTheme={toggleTheme}
    />
  );
}

export default App;
