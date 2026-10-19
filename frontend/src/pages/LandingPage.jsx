import { useState, useEffect } from 'react';
import { statsService } from '../services/api';

export default function LandingPage({
  currentUser,
  onNavigate,
  onLogout,
  theme,
  toggleTheme,
}) {
  const [globalStats, setGlobalStats] = useState({
    totalDonors: 0,
    totalHospitals: 0,
    activeRequests: 0,
    totalUnitsFulfilled: 0,
    totalDonations: 0,
    totalUnitsNeeded: 0,
  });

  const [userStats, setUserStats] = useState(null);
  const [activeTab, setActiveTab] = useState(currentUser ? 'personal' : 'global');

  // Switch tab automatically when user login status changes
  useEffect(() => {
    if (currentUser) {
      setActiveTab('personal');
    } else {
      setActiveTab('global');
      setUserStats(null);
    }
  }, [currentUser]);

  // Real-time synchronization polling every 2500ms
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2500);
    return () => clearInterval(interval);
  }, [currentUser]);

  const fetchStats = async () => {
    try {
      if (currentUser && currentUser.id) {
        let personal = null;
        if (currentUser.type === 'BLOOD_BANK') {
          personal = await statsService.getBloodBankStats(currentUser.id);
        } else if (currentUser.type === 'HOSPITAL' || currentUser.role === 'HOSPITAL') {
          personal = await statsService.getHospitalStats(currentUser.id);
        } else {
          personal = await statsService.getDonorStats(currentUser.id);
        }

        if (personal) {
          setUserStats(personal);
          if (personal.globalStats) {
            setGlobalStats(personal.globalStats);
          }
        }
      } else {
        const g = await statsService.getStats();
        if (g) {
          setGlobalStats(g);
        }
      }
    } catch (e) {
      // Keep previous data in state
    }
  };

  const getUserRoleLabel = () => {
    if (!currentUser) return '';
    if (currentUser.type === 'BLOOD_BANK') return 'Blood Bank Hub';
    if (currentUser.type === 'HOSPITAL' || currentUser.role === 'HOSPITAL') return 'Hospital Admin';
    return `Donor · ${currentUser.bloodGroup || 'Hero'}`;
  };

  const handleGoToDashboard = () => {
    if (!currentUser) return;
    if (currentUser.type === 'BLOOD_BANK') {
      onNavigate('bloodbank-home');
    } else if (currentUser.type === 'HOSPITAL' || currentUser.role === 'HOSPITAL') {
      onNavigate('hospital-home');
    } else {
      onNavigate('donor-home');
    }
  };

  const isDonor = currentUser && currentUser.type !== 'BLOOD_BANK' && currentUser.type !== 'HOSPITAL' && currentUser.role !== 'HOSPITAL';
  const isHospital = currentUser && (currentUser.type === 'HOSPITAL' || currentUser.role === 'HOSPITAL');
  const isBloodBank = currentUser && currentUser.type === 'BLOOD_BANK';

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, display: 'flex', flexDirection: 'column', transition: 'background 0.2s, color 0.2s' }}>

      {/* Wide Full-Width Header */}
      <header style={{ borderBottom: `1px solid ${theme.bord}`, padding: '16px 36px', background: theme.card, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1380, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              onClick={() => onNavigate('landing')}
              style={{ fontSize: 21, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, letterSpacing: '-0.3px' }}
            >
              <div style={{ width: 32, height: 32, background: theme.red, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>
                🩸
              </div>
              <span>BloodConnect</span>
            </div>
          </div>

          {/* User Auth Info & Quick Portals */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {currentUser ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 10, padding: '6px 14px', fontSize: 13 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.green }}></span>
                  <span style={{ fontWeight: 700, color: theme.text }}>{currentUser.name}</span>
                  <span style={{ fontSize: 11, background: theme.redBg, border: `1px solid ${theme.redBorder}`, color: theme.red, padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                    {getUserRoleLabel()}
                  </span>
                </div>

                <button
                  onClick={handleGoToDashboard}
                  style={{ background: theme.red, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  My Dashboard →
                </button>

                <button
                  onClick={onLogout}
                  style={{ background: 'transparent', border: `1px solid ${theme.bord}`, color: theme.dim, padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('user-login')}
                  style={{ background: 'transparent', border: `1px solid ${theme.bord}`, color: theme.text, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Donor Login
                </button>

                <button
                  onClick={() => onNavigate('hospital-login')}
                  style={{ background: 'transparent', border: `1px solid ${theme.bord}`, color: theme.text, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Hospital Portal
                </button>

                <button
                  onClick={() => onNavigate('bloodbank-login')}
                  style={{ background: 'transparent', border: `1px solid ${theme.bord}`, color: theme.text, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Blood Bank
                </button>
              </>
            )}

            <button
              onClick={toggleTheme}
              style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
              title="Toggle Light/Dark Theme"
            >
              {theme.isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

        </div>
      </header>

      {/* Main Wide Container */}
      <main style={{ maxWidth: 1380, width: '100%', margin: '0 auto', padding: '44px 36px 64px', flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Hero Headline Section */}
        <div style={{ textAlign: 'center', maxWidth: 1140, margin: '0 auto', padding: '10px 0 6px' }}>
          <h1 style={{ fontSize: 'clamp(44px, 5.8vw, 70px)', fontWeight: 900, lineHeight: 1.12, letterSpacing: '-1.8px', margin: '0 0 22px 0' }}>
            Direct Real-Time Matching for<br />
            <span style={{ color: theme.red }}>Lifesaving Blood Demands</span>
          </h1>

          <p style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', color: theme.dim, lineHeight: 1.65, maxWidth: 980, margin: '0 auto' }}>
            {currentUser ? (
              <>
                Welcome back, <strong style={{ color: theme.text }}>{currentUser.name}</strong>. Your account is active in <strong style={{ color: theme.text }}>{currentUser.city || 'Mumbai'}</strong>. Live statistics below dynamically reflect your real-time activity and local hospital requirements.
              </>
            ) : (
              <>
                Connect directly with accredited partner hospitals in your city to fulfill urgent blood requirements, or locate community donation drives hosted by certified blood banks.
              </>
            )}
          </p>
        </div>

        {/* Dynamic Real-Time Statistics Ribbon (Changes with Login) */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 20, padding: '26px 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Top Control Bar of the Ribbon */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>
                {activeTab === 'personal' ? (isDonor ? '👤' : isHospital ? '🏥' : '🏛️') : '🌐'}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: theme.text, letterSpacing: '-0.2px' }}>
                  {activeTab === 'personal'
                    ? (isDonor ? `Live Donor Statistics · ${currentUser.name}` : isHospital ? `Hospital Operations · ${currentUser.name}` : `Blood Bank Drives · ${currentUser.name}`)
                    : 'Live Portal Statistics & Network Activity'}
                </div>
                <div style={{ fontSize: 12, color: theme.dim, marginTop: 2 }}>
                  {activeTab === 'personal'
                    ? `Dynamically filtered for ${currentUser?.city || 'All Cities'} · Real-time in-memory updates`
                    : 'Global clinical synchronization across all accredited partner hospitals'}
                </div>
              </div>
            </div>

            {/* Controls: Mode Switcher + Live Badge + Refresh */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {currentUser && (
                <div style={{ display: 'flex', background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 10, padding: 3 }}>
                  <button
                    onClick={() => setActiveTab('personal')}
                    style={{
                      background: activeTab === 'personal' ? theme.red : 'transparent',
                      color: activeTab === 'personal' ? '#fff' : theme.dim,
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isDonor ? '👤 My Live Stats' : isHospital ? '🏥 Hospital Ops' : '🏛️ Bank Ops'}
                  </button>

                  <button
                    onClick={() => setActiveTab('global')}
                    style={{
                      background: activeTab === 'global' ? theme.red : 'transparent',
                      color: activeTab === 'global' ? '#fff' : theme.dim,
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    🌐 Global Network
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4 Dynamic Metric Blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, paddingTop: 6 }}>

            {/* TAB 1: PERSONAL DONOR STATS */}
            {activeTab === 'personal' && isDonor && (
              <>
                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Donations Completed
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.red, margin: '6px 0 2px' }}>
                    {userStats?.totalDonations ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    ⚡ {userStats?.livesImpacted ?? 0} Lives Directly Impacted
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Your Blood Group
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.blue, margin: '6px 0 2px' }}>
                    {currentUser.bloodGroup || userStats?.bloodGroup || 'O+'}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    📍 Registered in {currentUser.city || userStats?.city || 'Mumbai'}
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Matching Needs in {currentUser.city || userStats?.city || 'City'}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.red, margin: '6px 0 2px' }}>
                    {userStats?.matchingInCity ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    ({userStats?.matchingAcrossNetwork ?? 0} matching across network)
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Clinical Eligibility
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: userStats?.isEligible ? theme.green : '#f59e0b', margin: '10px 0 6px', letterSpacing: '-0.3px' }}>
                    {userStats?.isEligible ? '🟢 Eligible Now' : `⏳ ${userStats?.daysUntilEligible || 0}d Cooldown`}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    {userStats?.isEligible ? 'Ready for immediate donation pledge' : `Next eligible date: ${userStats?.nextEligibleDate || 'Soon'}`}
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: PERSONAL HOSPITAL STATS */}
            {activeTab === 'personal' && isHospital && (
              <>
                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Active Demands Posted
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.red, margin: '6px 0 2px' }}>
                    {userStats?.activeRequests ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    Out of {userStats?.totalRequestsPosted ?? 0} total requests posted
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Units Received
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.blue, margin: '6px 0 2px' }}>
                    {userStats?.unitsFulfilled ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    {userStats?.unitsRequested ?? 0} Total Units Requested
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Demands Fulfilled
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.green, margin: '6px 0 2px' }}>
                    {userStats?.fulfilledRequests ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    Completed & clinical orders verified
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    City Donors ({userStats?.city || currentUser.city})
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.text, margin: '6px 0 2px' }}>
                    {userStats?.cityDonors ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    {userStats?.cityActiveRequests ?? 0} Active Blood Needs in City
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: PERSONAL BLOOD BANK STATS */}
            {activeTab === 'personal' && isBloodBank && (
              <>
                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Active Drives Hosted
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.green, margin: '6px 0 2px' }}>
                    {userStats?.activeDrivesHosted ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    {userStats?.totalDrivesHosted ?? 0} Total Collection Camps
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Registered Attendees
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.blue, margin: '6px 0 2px' }}>
                    {userStats?.registeredAttendees ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    Pledged attendees across hosted camps
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Completed Drives
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.text, margin: '6px 0 2px' }}>
                    {userStats?.completedDrivesHosted ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    Community blood reserves replenished
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    City Registered Donors
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.red, margin: '6px 0 2px' }}>
                    {userStats?.cityDonors ?? 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    {userStats?.activeDrivesInCity ?? 0} Total Active Camps in {userStats?.city || 'City'}
                  </div>
                </div>
              </>
            )}

            {/* TAB 4: GLOBAL NETWORK STATS (Used when Guest OR toggled to Global) */}
            {activeTab === 'global' && (
              <>
                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Registered Donors
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.red, margin: '6px 0 2px' }}>
                    {globalStats.totalDonors || 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    Verified Community Donors
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Partner Hospitals
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.blue, margin: '6px 0 2px' }}>
                    {globalStats.totalHospitals || 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    Accredited Medical Centers
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Active Blood Needs
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.red, margin: '6px 0 2px' }}>
                    {globalStats.activeRequests || 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    {globalStats.totalUnitsNeeded || 0} Total Units Needed
                  </div>
                </div>

                <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Units Fulfilled
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: theme.green, margin: '6px 0 2px' }}>
                    {globalStats.totalUnitsFulfilled || 0}
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim, fontWeight: 600 }}>
                    Direct Real-Time Matches
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Persona Hint or Global Banner */}
          <div style={{ fontSize: 13, color: theme.dim, borderTop: `1px solid ${theme.bord}`, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            {currentUser ? (
              <div>
                👤 Signed in as <strong style={{ color: theme.text }}>{currentUser.name}</strong> ({getUserRoleLabel()}). Live statistics refresh dynamically every 2.5 seconds.
              </div>
            ) : (
              <div>
                💡 <strong>Tip:</strong> Log in as a <span style={{ color: theme.red, fontWeight: 700 }}>Donor</span>, <span style={{ color: theme.blue, fontWeight: 700 }}>Hospital</span>, or <span style={{ color: theme.green, fontWeight: 700 }}>Blood Bank</span> to view your personalized live statistics and city matching in real-time.
              </div>
            )}

            {currentUser && (
              <button
                onClick={handleGoToDashboard}
                style={{ background: 'transparent', border: 'none', color: theme.red, fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Open Full Dashboard →
              </button>
            )}
          </div>

        </div>

        {/* Wide Side-by-Side Main Action Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
          
          {/* Card 1: Hospitals */}
          <div
            onClick={() => onNavigate('nearby-hospitals')}
            className="card-hover"
            style={{
              background: theme.card,
              border: `1px solid ${theme.bord}`,
              borderRadius: 20,
              padding: '36px 34px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ width: 54, height: 54, background: theme.redBg, border: `1px solid ${theme.redBorder}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  🏥
                </div>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px 0', color: theme.text }}>
                {isDonor ? `Partner Hospitals in ${currentUser.city || 'Your Area'}` : 'Find Nearby Partner Hospitals'}
              </h2>
              <p style={{ fontSize: 15, color: theme.dim, lineHeight: 1.55, margin: 0 }}>
                {isDonor ? (
                  <>Explore accredited hospitals requiring blood donations. Filtered by your blood group <strong style={{ color: theme.text }}>{currentUser.bloodGroup || 'match'}</strong> in <strong style={{ color: theme.text }}>{currentUser.city || 'your city'}</strong>.</>
                ) : (
                  <>Explore accredited hospitals in your city needing immediate blood donations. Filter by blood group and record verified donation pledges in real time.</>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18, borderTop: `1px solid ${theme.bord}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: theme.red }}>
                {isDonor ? `View Matching Demands for ${currentUser.bloodGroup || 'You'}` : 'View Hospitals & Demands'}
              </span>
              <span style={{ fontSize: 18, color: theme.red, fontWeight: 800 }}>→</span>
            </div>
          </div>

          {/* Card 2: Collection Drives */}
          <div
            onClick={() => onNavigate('blood-drives')}
            className="card-hover"
            style={{
              background: theme.card,
              border: `1px solid ${theme.bord}`,
              borderRadius: 20,
              padding: '36px 34px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ width: 54, height: 54, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  🏛️
                </div>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px 0', color: theme.text }}>
                View Active Blood Collection Drives
              </h2>
              <p style={{ fontSize: 15, color: theme.dim, lineHeight: 1.55, margin: 0 }}>
                Participate in public collection camps hosted across major cities by authorized blood banks. Check venue locations, schedules, and register to attend.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18, borderTop: `1px solid ${theme.bord}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>
                Explore Collection Camps
              </span>
              <span style={{ fontSize: 18, color: theme.dim, fontWeight: 800 }}>→</span>
            </div>
          </div>

        </div>

        {/* Wide 3 Architecture Value Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          
          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 16, padding: '28px 26px' }}>
            <div style={{ fontSize: 26, marginBottom: 12 }}>🏥</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Accredited Partner Hospitals</div>
            <div style={{ fontSize: 14, color: theme.dim, lineHeight: 1.6 }}>
              Direct integration with registered medical institutions ensuring every demand corresponds to verified clinical needs.
            </div>
          </div>

          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 16, padding: '28px 26px' }}>
            <div style={{ fontSize: 26, marginBottom: 12 }}>⚡</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Real-Time Synchronization</div>
            <div style={{ fontSize: 14, color: theme.dim, lineHeight: 1.6 }}>
              Pledges, donation fulfillment, and collection camps update instantly in memory, keeping stock requirements fresh across portals.
            </div>
          </div>

          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 16, padding: '28px 26px' }}>
            <div style={{ fontSize: 26, marginBottom: 12 }}>🛡️</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Authentication & Integrity</div>
            <div style={{ fontSize: 14, color: theme.dim, lineHeight: 1.6 }}>
              Licensing credentials authenticate hospital and blood bank operators, preventing spurious requests.
            </div>
          </div>

        </div>

        {/* Bottom Quick Action Strip */}
        <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 16, padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          {currentUser ? (
            <>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>
                  Logged in as {currentUser.name} ({getUserRoleLabel()})
                </div>
                <div style={{ fontSize: 13, color: theme.dim, marginTop: 2 }}>
                  Access your full portal dashboard or explore active requests across partner hospitals.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handleGoToDashboard}
                  style={{ background: theme.red, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                >
                  Open Dashboard →
                </button>
                <button
                  onClick={onLogout}
                  style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>Ready to save lives in your community?</div>
                <div style={{ fontSize: 13, color: theme.dim, marginTop: 2 }}>Register as a verified blood donor in under a minute.</div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => onNavigate('user-register')}
                  style={{ background: theme.red, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                >
                  Register as Donor →
                </button>
                <button
                  onClick={() => onNavigate('hospital-login')}
                  style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Hospital Access
                </button>
              </div>
            </>
          )}
        </div>

      </main>

      {/* Wide Footer */}
      <footer style={{ borderTop: `1px solid ${theme.bord}`, padding: '22px 36px', background: theme.card }}>
        <div style={{ maxWidth: 1380, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 13, color: theme.dim }}>
          <div>BloodConnect · Blood Donation & Event Management Portal</div>
          <div>Clinical in-memory operations · Real-time synchronization</div>
        </div>
      </footer>

    </div>
  );
}
