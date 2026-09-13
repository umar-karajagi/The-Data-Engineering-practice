'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  CheckCircle2, 
  ExternalLink, 
  Printer, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  BookOpen, 
  Database, 
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useUserStore } from '../../lib/userStore';
import { CertificateItem, BadgeItem } from '../../types';

export interface CertificatesViewProps {
  onNavigateTrack?: (trackId: string, tierNumber?: number) => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ onNavigateTrack }) => {
  const { user, certificates, badges, tracksProgress } = useUserStore();
  const [activeModalCert, setActiveModalCert] = useState<CertificateItem | null>(null);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database': return Database;
      case 'Layers': return Layers;
      case 'Zap': return Zap;
      case 'BookOpen': return BookOpen;
      case 'Flame': return Flame;
      case 'Trophy': return Trophy;
      default: return CheckCircle2;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forge-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-forge-text tracking-tight">Credentials & Achievements</h1>
              <p className="text-xs text-forge-secondary font-mono">
                Verified certificates of completion • Staff DE skill badges and milestone honors
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-forge-card border border-forge-border flex items-center gap-2 text-xs font-mono">
            <Trophy className="w-4 h-4 text-track-sql" />
            <span className="text-forge-text font-bold">{certificates.length} Certificates</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-forge-card border border-forge-border flex items-center gap-2 text-xs font-mono">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-forge-text font-bold">{badges.filter(b => b.earned).length} / {badges.length} Badges</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: VERIFIED CERTIFICATES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-forge-text font-mono uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-track-python" />
            Verified Track Certificates
          </h2>
          <span className="text-xs text-forge-secondary font-mono">
            Requires ≥80% average on module tests + Capstone submission
          </span>
        </div>

        {certificates.length === 0 ? (
          <div className="rounded-2xl bg-forge-card border border-forge-border p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forge-surface flex items-center justify-center text-forge-secondary mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-forge-text">No certificates issued yet</h3>
            <p className="text-xs text-forge-secondary max-w-md mx-auto">
              Complete all 3 tiers (Foundation, Applied, Mastery) and submit the Tier 3 Capstone in any track to earn an official verified certificate.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl bg-gradient-to-br from-forge-card via-forge-card to-forge-surface border border-amber-500/30 p-6 flex flex-col justify-between space-y-4 shadow-lg hover:border-amber-500/60 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Official Credential
                      </span>
                      <span className="text-[11px] font-mono text-forge-secondary">ID: {cert.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-forge-text group-hover:text-amber-400 transition-colors">
                      {cert.trackTitle}
                    </h3>
                    <p className="text-xs text-forge-secondary font-mono mt-0.5">
                      Issued to <span className="text-forge-text font-semibold">{cert.userName}</span> on {cert.issuedAt}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-forge-border text-xs font-mono">
                  <span className="text-track-python font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed with {cert.averageScore}% Avg
                  </span>
                  <button
                    onClick={() => setActiveModalCert(cert)}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold hover:underline"
                  >
                    <span>View & Print Certificate</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: BADGES & MILESTONES */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-forge-text font-mono uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Achievement Badges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const IconComponent = getBadgeIcon(badge.iconName);
            const isEarned = badge.earned;

            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-5 flex items-start gap-4 transition-all ${
                  isEarned
                    ? 'bg-forge-card border-track-sql/30 shadow-md'
                    : 'bg-forge-card/40 border-forge-border/60 opacity-60'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                  isEarned 
                    ? 'bg-track-sql/10 border-track-sql/40 text-track-sql shadow-inner' 
                    : 'bg-forge-surface border-forge-border text-forge-secondary'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-forge-text truncate">{badge.name}</h4>
                    {isEarned ? (
                      <span className="text-[10px] font-mono text-track-python font-bold">Earned</span>
                    ) : (
                      <span className="text-[10px] font-mono text-forge-secondary">Locked</span>
                    )}
                  </div>
                  <p className="text-[11px] text-forge-secondary leading-snug">
                    {badge.description}
                  </p>

                  {/* Progress bar if not earned */}
                  {!isEarned && badge.progressTarget && (
                    <div className="pt-2 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-forge-secondary">
                        <span>Progress</span>
                        <span>{badge.progressCurrent || 0} / {badge.progressTarget}</span>
                      </div>
                      <div className="w-full h-1.5 bg-forge-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-track-sql rounded-full transition-all"
                          style={{ width: `${((badge.progressCurrent || 0) / badge.progressTarget) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isEarned && badge.earnedAt && (
                    <span className="text-[10px] font-mono text-forge-secondary block pt-1">
                      Unlocked on {badge.earnedAt}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CERTIFICATE FULL PREVIEW MODAL */}
      {activeModalCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-forge-card border border-amber-500/40 rounded-3xl max-w-2xl w-full shadow-2xl p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveModalCert(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-forge-surface border border-forge-border text-forge-secondary hover:text-forge-text"
            >
              <X className="w-4 h-4" />
            </button>

            {/* High-Fidelity Certificate Card */}
            <div className="border-4 border-double border-amber-500/50 rounded-2xl p-8 bg-gradient-to-b from-forge-bg via-forge-card to-forge-bg text-center space-y-6 shadow-inner">
              
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-md">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-amber-400 font-bold block">
                  Certificate of Professional Mastery
                </span>
                <h2 className="text-2xl font-black text-forge-text font-serif">
                  DataForge Engineering Academy
                </h2>
              </div>

              <p className="text-xs text-forge-secondary max-w-md mx-auto leading-relaxed">
                This credential certifies that
              </p>

              <div className="text-xl font-black text-white font-mono border-b border-amber-500/40 pb-2 inline-block px-8">
                {activeModalCert.userName}
              </div>

              <p className="text-xs text-forge-secondary max-w-md mx-auto leading-relaxed">
                has successfully mastered all curriculum tiers, passed all gated technical assessments, and completed the Tier 3 Applied Capstone for:
              </p>

              <h3 className="text-lg font-black text-track-sql font-mono">
                {activeModalCert.trackTitle}
              </h3>

              <div className="flex items-center justify-between pt-6 border-t border-forge-border text-[11px] font-mono text-forge-secondary">
                <div>
                  <span className="block text-forge-text font-bold">Verification ID</span>
                  <span>{activeModalCert.id}</span>
                </div>
                <div>
                  <span className="block text-forge-text font-bold">Issued Date</span>
                  <span>{activeModalCert.issuedAt}</span>
                </div>
                <div>
                  <span className="block text-track-python font-bold">Status</span>
                  <span>Verified Cryptographic Proof</span>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-forge-secondary">
                Verifiable online at {activeModalCert.verificationUrl}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forge-surface border border-forge-border text-xs font-bold text-forge-text hover:bg-forge-surface/80"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setActiveModalCert(null)}
                  className="px-4 py-2 rounded-xl bg-track-sql text-black text-xs font-bold hover:bg-track-sql/90"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
