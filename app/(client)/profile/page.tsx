"use client";
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatsHeader from './components/StatsHeader';
import InfoTab from './components/InfoTab';
import TicketsTab from './components/TicketsTab';
import PaymentTab from './components/PaymentTab';
import WishlistTab from './components/WishlistTab';
import SettingsTab from './components/SettingsTab';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info': return <InfoTab />;
      case 'tickets': return <TicketsTab />;
      case 'payment': return <PaymentTab />;
      case 'wishlist': return <WishlistTab />;
      case 'settings': return <SettingsTab />;
      default: return <InfoTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col lg:flex-row overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-6 md:p-16 custom-scrollbar relative">
        <div className="max-w-5xl mx-auto">
          <StatsHeader />
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 md:p-12 min-h-[500px] shadow-2xl relative overflow-hidden">
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/5 rounded-full blur-[80px]" />
             {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}