import React, { useState } from 'react';
import { MarketingNavbar } from './MarketingNavbar';
import { MarketingHero } from './MarketingHero';
import { MetricsBar } from './MetricsBar';
import { PlatformOverview } from './PlatformOverview';
import { IntelligencePillars } from './IntelligencePillars';
import { CapabilitiesGrid } from './CapabilitiesGrid';
import { WorkflowSection } from './WorkflowSection';
import { ImpactResults } from './ImpactResults';
import { SovereignCompliance } from './SovereignCompliance';
import { DualAudienceSection } from './DualAudienceSection';
import { MarketingCta } from './MarketingCta';
import { MarketingFooter } from './MarketingFooter';
import { AccessRequestModal } from './AccessRequestModal';

interface MarketingPageProps {
  onOpenConsole: (targetModule?: string) => void;
  onOpenLogin?: () => void;
  onRequestNationalAccess?: () => void;
  onAuthorizeProposal?: () => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({
  onOpenConsole,
  onOpenLogin,
  onRequestNationalAccess,
  onAuthorizeProposal,
}) => {
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'access' | 'briefing'>('access');

  const handleOpenAccess = () => {
    if (onRequestNationalAccess) {
      onRequestNationalAccess();
    } else {
      setModalType('access');
      setIsAccessModalOpen(true);
    }
  };

  const handleOpenBriefing = () => {
    setModalType('briefing');
    setIsAccessModalOpen(true);
  };

  const handleSelectModuleFromPillar = (moduleId: string) => {
    onOpenConsole(moduleId);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Top Navigation Bar */}
      <MarketingNavbar
        onOpenConsole={() => onOpenConsole()}
        onOpenLogin={onOpenLogin}
        onRequestAccess={handleOpenAccess}
      />

      {/* 2. Hero Section */}
      <MarketingHero
        onRequestAccess={handleOpenAccess}
        onOpenConsole={() => onOpenConsole()}
        onAuthorizeProposal={onAuthorizeProposal}
      />

      {/* Trust Metrics Row */}
      <MetricsBar />

      {/* 3. Platform Overview Section (with large Command Center display) */}
      <PlatformOverview
        onOpenConsole={() => onOpenConsole()}
        onRequestAccess={handleOpenAccess}
      />

      {/* 4. Three Core Intelligence Pillars */}
      <IntelligencePillars onSelectModule={handleSelectModuleFromPillar} />

      {/* 5. Key Capabilities / Feature Grid ("Built for National Scale") */}
      <CapabilitiesGrid />

      {/* 6. How It Works / Workflow Section (5 Steps + Architecture Pipeline Visual) */}
      <WorkflowSection />

      {/* 7. Impact & Results Section (Bold Stats, Cases, Ministry Testimonial) */}
      <ImpactResults />

      {/* 8. Security & Sovereign Compliance Section */}
      <SovereignCompliance />

      {/* Targeted Audience Alignment (Ministries & Frontline Care) */}
      <DualAudienceSection
        onOpenConsole={() => onOpenConsole()}
        onRequestAccess={handleOpenAccess}
      />

      {/* 9. Final CTA Section ("Ready to strengthen national health resilience?") */}
      <MarketingCta
        onRequestAccess={handleOpenAccess}
        onScheduleBriefing={handleOpenBriefing}
        onOpenConsole={() => onOpenConsole()}
      />

      {/* 10. Institutional Footer */}
      <MarketingFooter
        onOpenConsole={() => onOpenConsole()}
        onRequestAccess={handleOpenAccess}
        onSelectModule={handleSelectModuleFromPillar}
      />

      {/* Sovereign Access Inquiry Modal */}
      <AccessRequestModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        initialType={modalType}
      />
    </div>
  );
};
