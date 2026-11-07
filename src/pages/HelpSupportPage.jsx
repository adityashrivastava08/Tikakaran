import React from 'react';
import { HelpCircle, Phone, BookOpen, ShieldCheck, Mail, MessageSquare } from 'lucide-react';

export default function HelpSupportPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#075E54]">
          <HelpCircle className="w-6 h-6 text-[#075E54]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B38] tracking-tight">
            Help, Guidelines & Sub-Centre Support
          </h1>
          <p className="text-xs sm:text-sm text-[#718783] mt-0.5">
            Operational Guidelines, Universal Immunization Schedule & Helpline Contacts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm space-y-3">
          <h3 className="font-bold text-sm text-[#173B38] flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#075E54]" /> Emergency District Helplines
          </h3>
          <div className="space-y-2 text-xs text-[#718783]">
            <div className="p-2.5 bg-[#F9FCFA] rounded-xl flex justify-between">
              <span>Block Medical Officer (BMO Rampur):</span>
              <strong className="text-[#173B38] font-mono">+91 94250 11200</strong>
            </div>
            <div className="p-2.5 bg-[#F9FCFA] rounded-xl flex justify-between">
              <span>District Cold Chain Technician:</span>
              <strong className="text-[#173B38] font-mono">+91 98261 99014</strong>
            </div>
            <div className="p-2.5 bg-[#F9FCFA] rounded-xl flex justify-between">
              <span>National HMIS Helpdesk Toll-Free:</span>
              <strong className="text-[#075E54] font-mono">1800-180-1104</strong>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E1ECE9] shadow-soft-sm space-y-3">
          <h3 className="font-bold text-sm text-[#173B38] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#075E54]" /> UIP Immunization Guidelines (Quick Ref)
          </h3>
          <div className="space-y-2 text-xs text-[#718783]">
            <p>• <strong>BCG, OPV-0, Hep-B:</strong> Administer within 24 hours of birth.</p>
            <p>• <strong>Pentavalent & Rotavirus:</strong> 6 weeks (Dose 1), 10 weeks (Dose 2), 14 weeks (Dose 3).</p>
            <p>• <strong>MR-1 & Vitamin A:</strong> At completed 9 months up to 12 months.</p>
            <p>• <strong>DPT Booster-1 & OPV Booster:</strong> 16 to 24 months.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

