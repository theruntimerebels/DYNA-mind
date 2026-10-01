import React, { useState, useEffect, useCallback } from 'react';
import { NavigationTab, ChatMessage, BiometricIndicators, CheckinRecord } from './types';
import { INITIAL_BIOMETRICS, INITIAL_CHAT_MESSAGES } from './data/mockData';
import { api, ensureSession } from './services/api';
import { onChatResult } from './services/geminiService';
import { toBiometrics, MonitoringSummary } from './services/monitoringAdapter';
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
  const [backendError, setBackendError] = useState<string | null>(null);

  // Modals & Drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const timeNow = (iso?: string) =>
    new Date(iso ?? Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const refreshMonitoring = useCallback(async () => {
    const s = await ensureSession();
    const m = await api<MonitoringSummary>(`/monitoring/${s.userId}`);
    setBiometrics((prev) => toBiometrics(m, prev));
  }, []);

  // Session bootstrap: restore this browser's session, its messages and its monitoring state after refresh.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await ensureSession();
        const conv = await api<{ messages: { id: string; sender: 'user' | 'companion'; text: string; timestamp: string; contextTag?: string }[] }>(`/conversations/${s.sessionId}`);
        if (!cancelled && conv.messages.length) {
          setMessages(conv.messages.map((m) => ({ id: m.id, sender: m.sender, text: m.text, time: timeNow(m.timestamp), contextTag: m.contextTag, status: m.sender === 'user' ? 'Delivered' : undefined })));
        }
        await refreshMonitoring();
        if (!cancelled) setBackendError(null);
      } catch (e: any) {
        if (!cancelled) setBackendError(e?.message || 'Cannot reach the DYNA MIND server.');
      }
    })();
    return () => { cancelled = true; };
  }, [refreshMonitoring]);

  // After every chat turn the backend returns fresh monitoring; reflect it and surface safety signals.
  useEffect(() => {
    onChatResult((r) => {
      refreshMonitoring().catch(() => {});
      if (r.safety?.level === 'critical') setIsSafetyOpen(true);
    });
    return () => onChatResult(null);
  }, [refreshMonitoring]);

  const handleNavigate = (tab: NavigationTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = (text: string, contextTag?: string, sender: 'user' | 'companion' = 'user') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: sender === 'user' ? 'Delivered' : undefined,
      contextTag,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSaveCheckin = async (record: CheckinRecord) => {
    // Real check-in: backend computes the distress score, personal-baseline comparison and trend.
    await api('/checkins', {
      method: 'POST',
      body: JSON.stringify({
        emotions: record.emotions,
        somatic: record.somatic,
        trigger: record.trigger,
        notes: record.notes,
      }),
    });
    await refreshMonitoring();
  };

  const handleVoiceClose = async (_transcriptSnippet?: string) => {
    setIsVoiceOpen(false);
    try {
      // Voice turns already went through the same pipeline and were stored by the backend.
      const s = await ensureSession();
      const conv = await api<{ messages: { id: string; sender: 'user' | 'companion'; text: string; timestamp: string; contextTag?: string }[] }>(`/conversations/${s.sessionId}`);
      if (conv.messages.length) {
        setMessages(conv.messages.map((m) => ({ id: m.id, sender: m.sender, text: m.text, time: timeNow(m.timestamp), contextTag: m.contextTag, status: m.sender === 'user' ? 'Delivered' : undefined })));
      }
      await refreshMonitoring();
    } catch { /* non-fatal: next action will surface a connection problem */ }
  };

  const handlePurgeLogs = async () => {
    try {
      await api('/me', { method: 'DELETE' });
      try { localStorage.removeItem('dynamind.session.v1'); } catch { /* ignore */ }
      window.location.reload(); // fresh pseudonymous session
    } catch (e: any) {
      setBackendError(e?.message || 'Could not delete your data. Please try again.');
    }
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

      {backendError && (
        <div role="alert" className="fixed top-24 inset-x-4 z-50 mx-auto max-w-3xl p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[12.5px] text-center">
          {backendError}
        </div>
      )}

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
