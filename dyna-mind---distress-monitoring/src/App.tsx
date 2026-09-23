import React, { useState } from 'react';
import { NavigationTab, ChatMessage, BiometricIndicators, CheckinRecord } from './types';
import { INITIAL_BIOMETRICS, INITIAL_CHAT_MESSAGES } from './data/mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SideDrawer } from './components/SideDrawer';
import { SafetyModal } from './components/modals/SafetyModal';
import { PrivacyModal } from './components/modals/PrivacyModal';
import { VoiceModal } from './components/screens/VoiceModal';
import { HomeScreen } from './components/screens/HomeScreen';
import { CompanionScreen } from './components/screens/CompanionScreen';
import { CheckinScreen } from './components/screens/CheckinScreen';
import { InsightsScreen } from './components/screens/InsightsScreen';
import { TimelineScreen } from './components/screens/TimelineScreen';
import { ResourcesScreen } from './components/screens/ResourcesScreen';
import { EmergencyScreen } from './components/screens/EmergencyScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [biometrics, setBiometrics] = useState<BiometricIndicators>(INITIAL_BIOMETRICS);

  // Modals & Drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const handleNavigate = (tab: NavigationTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = (text: string, contextTag?: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered',
      contextTag,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSaveCheckin = (record: CheckinRecord) => {
    // Dynamically update biometrics based on reported sliders
    const avgSomatic = Math.round(
      (record.somatic.chest + record.somatic.jaw + record.somatic.sleep) / 3
    );
    const newDistress = Math.min(100, Math.max(10, avgSomatic * 10 + 5));

    setBiometrics((prev) => ({
      ...prev,
      distressIndex: newDistress,
      calibratedLogs: prev.calibratedLogs + 1,
      stabilityQuotient: Math.max(70, Math.min(95, 100 - Math.round(newDistress * 0.3))),
    }));

    // Append automated clinical log to companion session
    const summaryText = `[Afternoon Check-in Logged] Primary Trigger: ${
      record.trigger
    }. Somatic Ratings - Chest: ${record.somatic.chest}/10, Jaw: ${
      record.somatic.jaw
    }/10, Sleep: ${record.somatic.sleep}/10. Emotions: ${record.emotions.join(
      ', '
    )}. ${record.notes ? `Note: "${record.notes}"` : ''}`;

    const newLog: ChatMessage = {
      id: `chk-log-${Date.now()}`,
      sender: 'user',
      text: summaryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextTag: 'Somatic Telemetry',
    };

    setMessages((prev) => [...prev, newLog]);
  };

  const handleVoiceClose = (transcriptSnippet?: string) => {
    setIsVoiceOpen(false);
    if (transcriptSnippet) {
      const voiceLog: ChatMessage = {
        id: `voice-${Date.now()}`,
        sender: 'user',
        text: transcriptSnippet,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextTag: 'Voice Session',
      };
      setMessages((prev) => [...prev, voiceLog]);
    }
  };

  const handlePurgeLogs = () => {
    setMessages(INITIAL_CHAT_MESSAGES.slice(0, 1));
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body selection:bg-secondary-container selection:text-primary">
      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        isVoiceActive={isVoiceOpen}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-30 sm:pt-32">
        {currentTab === 'home' && (
          <HomeScreen
            biometrics={biometrics}
            onNavigate={handleNavigate}
            onStartVoice={() => setIsVoiceOpen(true)}
            onEmergency={() => setIsSafetyOpen(true)}
          />
        )}

        {currentTab === 'companion' && (
          <CompanionScreen
            messages={messages}
            biometrics={biometrics}
            onSendMessage={handleSendMessage}
            onStartVoice={() => setIsVoiceOpen(true)}
            onOpenSafety={() => setIsSafetyOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onNavigateToCheckin={() => handleNavigate('checkin')}
          />
        )}

        {currentTab === 'checkin' && (
          <CheckinScreen
            onSaveCheckin={handleSaveCheckin}
            onNavigateToCompanion={() => handleNavigate('companion')}
            onNavigateToResources={() => handleNavigate('resources')}
          />
        )}

        {currentTab === 'insights' && <InsightsScreen biometrics={biometrics} />}

        {currentTab === 'timeline' && (
          <TimelineScreen
            onNavigateToResources={() => handleNavigate('resources')}
            onNavigateToCompanion={() => handleNavigate('companion')}
          />
        )}

        {currentTab === 'resources' && <ResourcesScreen />}

        {currentTab === 'emergency-support' && (
          <EmergencyScreen
            onNavigate={handleNavigate}
            onStartBreathing={() => handleNavigate('resources')}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            onNavigate={handleNavigate}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation & Quick Support Pill */}
      <Navigation currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Side Slide-in Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        currentTab={currentTab}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Modals */}
      <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onPurge={handlePurgeLogs}
      />

      <VoiceModal
        isOpen={isVoiceOpen}
        history={messages}
        onClose={handleVoiceClose}
      />
    </div>
  );
}
