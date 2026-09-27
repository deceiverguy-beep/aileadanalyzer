import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LeadAnalyzerDemo } from './components/LeadAnalyzerDemo';
import { Features } from './components/Features';
import { SocialProof } from './components/SocialProof';
import { Pricing } from './components/Pricing';
import { SeoArticles } from './components/SeoArticles';
import { GrowthPlaybook } from './components/GrowthPlaybook';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { LeadCaptureModal, ModalType } from './components/LeadCaptureModal';

export default function App() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'hero',
        'features',
        'demo-tool',
        'case-study',
        'pricing',
        'cornerstone-seo',
        'growth-playbook',
        'faq',
      ];

      const scrollPosition = window.scrollY + 200;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToDemo = () => {
    handleNavigate('demo-tool');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        onOpenTrial={() => setModalType('trial')}
        onOpenDemo={() => setModalType('demo')}
        onOpenTemplates={() => setModalType('templates')}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenTrial={() => setModalType('trial')}
          onOpenDemo={() => setModalType('demo')}
          onScrollToDemo={handleScrollToDemo}
        />

        {/* Live Interactive Product Simulator: AI Lead Analyzer */}
        <LeadAnalyzerDemo
          onOpenTrial={() => setModalType('trial')}
          onOpenTemplates={() => setModalType('templates')}
        />

        {/* Core Pillars: Lead Processing, Sheets 2-Way Sync, CRM Sync, Workflow Builder */}
        <Features
          onOpenTrial={() => setModalType('trial')}
          onOpenDemo={() => setModalType('demo')}
        />

        {/* Social Proof & Featured ScaleOps Case Study */}
        <SocialProof
          onOpenDemo={() => setModalType('demo')}
          onOpenTrial={() => setModalType('trial')}
        />

        {/* Transparent Pricing & Interactive ROI Calculator */}
        <Pricing
          onOpenTrial={() => setModalType('trial')}
          onOpenDemo={() => setModalType('demo')}
        />

        {/* High-Authority SEO Content Hub & Cornerstone Guides */}
        <SeoArticles
          onOpenTrial={() => setModalType('trial')}
          onOpenTemplates={() => setModalType('templates')}
        />

        {/* Uzair's Growth Playbook: Content Calendar, Email Funnel, Social Strategy, Roadmap, Outreach Template */}
        <GrowthPlaybook
          onOpenConsulting={() => setModalType('consulting')}
          onOpenTemplates={() => setModalType('templates')}
        />

        {/* FAQ Accordion & Final "Get Started Today" High-Conversion CTA */}
        <FaqSection
          onOpenTrial={() => setModalType('trial')}
          onOpenDemo={() => setModalType('demo')}
        />
      </main>

      {/* Structured SEO Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenTrial={() => setModalType('trial')}
        onOpenTemplates={() => setModalType('templates')}
      />

      {/* Conversion Modals (Free Trial, Demo, Template Vault, Consulting) */}
      <LeadCaptureModal
        type={modalType}
        onClose={() => setModalType(null)}
      />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
