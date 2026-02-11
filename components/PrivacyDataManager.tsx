import React, { useState } from 'react';
import { Mail, Download, Trash2, FileText, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { exportUserDataAsFile, deleteAllUserData, getAllUserData, getDataRetentionInfo } from '../services/encryptionService';

interface Props {
  onClose: () => void;
  userName?: string;
}

const PrivacyDataManager: React.FC<Props> = ({ onClose, userName = 'User' }) => {
  const [activeTab, setActiveTab] = useState<'rights' | 'grievance' | 'retention'>('rights');
  const [grievanceForm, setGrievanceForm] = useState({
    type: 'privacy_concern',
    description: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleExportData = () => {
    exportUserDataAsFile();
    alert('Your data has been exported as JSON file. Please save it securely.');
  };

  const handleDeleteData = () => {
    if (deleteConfirm) {
      const success = deleteAllUserData();
      if (success) {
        alert('Your account and all personal data have been permanently deleted.');
        window.location.href = '/'; // Redirect to home
      }
    }
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend service
    console.log('[DPDP Audit] Grievance Filed:', {
      ...grievanceForm,
      timestamp: new Date().toISOString(),
      referenceId: `APARAJITA-GRV-${Date.now()}`,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setGrievanceForm({ type: 'privacy_concern', description: '', email: '' });
    }, 3000);
  };

  const retentionInfo = getDataRetentionInfo();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={28} />
              <div>
                <h2 className="text-2xl font-bold">Privacy & Data Rights</h2>
                <p className="text-purple-100 text-sm">DPDP Act, 2023 Compliance Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-purple-600 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200">
          {(['rights', 'grievance', 'retention'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-4 font-semibold text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab === 'rights' && '📋 Your Rights'}
              {tab === 'grievance' && '📧 File Grievance'}
              {tab === 'retention' && '⏱️ Data Retention'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Rights Tab */}
          {activeTab === 'rights' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Your Data Rights</h3>
                <p className="text-slate-600 mb-6">
                  Under DPDP Act 2023, you have the following rights. Click on each to take action.
                </p>
              </div>

              {/* Right to Access */}
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Download size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">Right to Access</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Download all your personal data in a machine-readable JSON format. You can transfer this to another service.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExportData}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download My Data
                </button>
              </div>

              {/* Right to Correction */}
              <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">Right to Correction</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Update or correct any inaccurate personal information in your profile. Go to Settings → Profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right to Erasure */}
              <div className="border border-red-200 bg-red-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Trash2 size={20} className="text-red-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">Right to Erasure (Delete Account)</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Request permanent deletion of your account and all personal data. This action is irreversible and will delete all your data within 30 days.
                    </p>
                  </div>
                </div>

                {!deleteConfirm ? (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete My Account & Data
                  </button>
                ) : (
                  <div className="space-y-3 bg-white p-4 rounded-lg border-2 border-red-500">
                    <p className="font-bold text-red-700">⚠️ This action cannot be undone!</p>
                    <p className="text-sm text-slate-600">
                      All your data will be permanently deleted. This includes your profile, contacts, posts, and history.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="flex-1 py-2 px-3 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteData}
                        className="flex-1 py-2 px-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Permanently Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grievance Tab */}
          {activeTab === 'grievance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">File a Grievance</h3>
                <p className="text-slate-600 mb-6">
                  Have a concern about your data or privacy? File a formal grievance and we will respond within 45 days.
                </p>
              </div>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-3">
                  <CheckCircle size={48} className="text-green-600 mx-auto" />
                  <h4 className="font-bold text-slate-900">Grievance Submitted</h4>
                  <p className="text-sm text-slate-600">
                    Reference ID: <span className="font-mono font-bold">APARAJITA-GRV-{Date.now()}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    We will respond to your grievance within 45 days at the provided email address.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleGrievanceSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Grievance Type
                    </label>
                    <select
                      value={grievanceForm.type}
                      onChange={(e) =>
                        setGrievanceForm({ ...grievanceForm, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="privacy_concern">Privacy Concern</option>
                      <option value="data_breach">Data Breach Report</option>
                      <option value="consent_issue">Consent Related Issue</option>
                      <option value="access_denied">Access Request Denied</option>
                      <option value="delay">Delayed Response</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={grievanceForm.email}
                      onChange={(e) =>
                        setGrievanceForm({ ...grievanceForm, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      value={grievanceForm.description}
                      onChange={(e) =>
                        setGrievanceForm({ ...grievanceForm, description: e.target.value })
                      }
                      rows={5}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe your grievance in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={18} />
                    Submit Grievance
                  </button>
                </form>
              )}

              <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-600 space-y-2">
                <p className="font-semibold text-slate-800">Direct Contact:</p>
                <p>📧 aparajita.grievance@example.com</p>
                <p>⏱️ Response time: Within 45 days</p>
                <p className="text-xs pt-2 border-t border-slate-300">
                  Escalation available to Data Protection Officer & MEITY if needed
                </p>
              </div>
            </div>
          )}

          {/* Retention Tab */}
          {activeTab === 'retention' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Data Retention Policy</h3>
                <p className="text-slate-600 mb-6">
                  Your data is retained according to the following schedule to balance your rights with legitimate operational needs.
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(retentionInfo).map(([key, value]) => {
                  if (typeof value !== 'string') return null;
                  return (
                    <div
                      key={key}
                      className="border border-slate-200 rounded-lg p-4 flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 w-2 h-10 bg-purple-600 rounded-full"></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 capitalize">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">{value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <AlertCircle size={18} className="text-yellow-600" />
                  Important
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-6 list-disc">
                  <li>Inactive accounts: Data deleted 90 days after last login</li>
                  <li>You can request early deletion anytime</li>
                  <li>Deletion records kept for 1 year for audit purposes</li>
                  <li>SOS records retained longer for safety & legal compliance</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-slate-300 text-slate-900 font-semibold rounded-lg hover:bg-slate-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDataManager;
