import React, { useState } from 'react';
import { AlertCircle, ExternalLink, CheckCircle } from 'lucide-react';
import { recordUserConsent, hasUserConsent } from '../services/encryptionService';

interface Props {
  onConsentAccepted: () => void;
}

const PrivacyConsentModal: React.FC<Props> = ({ onConsentAccepted }) => {
  const [showFullPolicy, setShowFullPolicy] = useState(false);
  const [consentCheckbox, setConsentCheckbox] = useState(false);

  if (hasUserConsent()) {
    return null;
  }

  const handleAcceptConsent = () => {
    if (consentCheckbox) {
      recordUserConsent({
        acceptedAt: new Date().toISOString(),
        ipAddress: 'local',
        method: 'in-app',
      });
      onConsentAccepted();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 border-b border-indigo-200">
          <div className="flex items-center gap-3">
            <AlertCircle size={28} className="flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold">Privacy & Data Protection</h2>
              <p className="text-indigo-100 text-sm mt-1">DPDP Act, 2023 Compliance</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              Before using Aparajita, please review our privacy policy and consent to data processing.
            </p>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">We collect personal data for:</p>
            <ul className="list-disc list-inside space-y-1 text-xs ml-1">
              <li>Emergency safety features & SOS alerts</li>
              <li>Location tracking & safe exit scheduling</li>
              <li>Community safety information sharing</li>
              <li>User authentication & account management</li>
            </ul>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Your data rights:</p>
            <ul className="list-disc list-inside space-y-1 text-xs ml-1">
              <li>Right to access your data</li>
              <li>Right to correction & erasure</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent anytime</li>
            </ul>
          </div>

          <button
            onClick={() => setShowFullPolicy(!showFullPolicy)}
            className="w-full flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm py-2 px-3 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <ExternalLink size={16} />
            {showFullPolicy ? 'Hide' : 'View'} Full Privacy Policy
          </button>

          {showFullPolicy && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 max-h-48 overflow-y-auto space-y-2">
              <p className="font-semibold text-slate-800">Key Points:</p>
              <p>• All data encrypted at rest using AES-256</p>
              <p>• Storage: Local device only (no cloud backup)</p>
              <p>• Retention: 90 days after last login</p>
              <p>• No selling/sharing of personal data</p>
              <p>• GDPR & CCPA compatible</p>
              <p className="pt-2 border-t border-slate-200">
                Full policy available in app settings & PRIVACY_POLICY.md file
              </p>
            </div>
          )}

          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
            <input
              type="checkbox"
              id="consent-checkbox"
              checked={consentCheckbox}
              onChange={(e) => setConsentCheckbox(e.target.checked)}
              className="mt-1 w-4 h-4 accent-indigo-600 cursor-pointer"
            />
            <label htmlFor="consent-checkbox" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
              I understand and accept the privacy policy. I consent to collection and processing of my personal data
              as described.
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 flex gap-3">
          <button
            onClick={handleAcceptConsent}
            disabled={!consentCheckbox}
            className="flex-1 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyConsentModal;
