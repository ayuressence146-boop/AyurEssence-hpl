import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { dataStore } from '../../services/dataStore';

const MyRecommendation = () => {
  const assessment = dataStore.getAssessments()[0];
  const recs = assessment?.recommendations || {
    dietFavor: ['Warm cooked grains (basmati rice, quinoa)', 'Ghee & sesame oil', 'Sweet ripe fruits (bananas, cooked apples)', 'Warm spiced milk with nutmeg'],
    dietAvoid: ['Raw cold salads', 'Pungent chili peppers', 'Iced beverages & cold carbonated drinks', 'Dry snacks & crackers'],
    lifestyle: ['Daily warm sesame oil Abhyanga self-massage', 'Regular sleep schedule (in bed by 10:00 PM)', 'Gentle Nadi Shodhana Pranayama (10 mins daily)'],
    formulations: ['Ashwagandha Churna 3g twice daily', 'Triphala Churna 5g at bedtime']
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Header */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60">
          <Sparkles size={14} className="text-amber-700" />
          <span>Practitioner Approved Guidance</span>
        </div>
        <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Ayurvedic Ahara & Vihara Guidance</h1>
        <p className="text-xs text-[#2b2721]/75 font-medium">
          Personalized dietary rules, daily Dinacharya routines, and prescribed formulations tailored to your Prakriti.
        </p>
      </div>

      {/* Grid: Ahara (Diet) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Favor */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
          <h3 className="text-base font-serif font-bold text-emerald-900 flex items-center justify-between">
            <span>Foods & Flavors to Favor</span>
            <CheckCircle2 size={18} className="text-emerald-700" />
          </h3>
          <ul className="space-y-2 text-xs">
            {recs.dietFavor.map((item, idx) => (
              <li key={idx} className="p-3 bg-white/80 rounded-xl border border-[#2b2721]/10 font-medium text-[#2b2721]">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Avoid */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
          <h3 className="text-base font-serif font-bold text-red-900 flex items-center justify-between">
            <span>Foods to Minimize / Avoid</span>
            <AlertCircle size={18} className="text-red-700" />
          </h3>
          <ul className="space-y-2 text-xs">
            {recs.dietAvoid.map((item, idx) => (
              <li key={idx} className="p-3 bg-white/80 rounded-xl border border-[#2b2721]/10 font-medium text-[#2b2721]">
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Vihara & Aushadhi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Lifestyle */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
          <h3 className="text-base font-serif font-bold text-[#2b2721]">Daily Dinacharya & Lifestyle</h3>
          <ul className="space-y-2 text-xs">
            {recs.lifestyle.map((item, idx) => (
              <li key={idx} className="p-3 bg-white/80 rounded-xl border border-[#2b2721]/10 font-medium text-[#2b2721]">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Prescribed Herbs */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
          <h3 className="text-base font-serif font-bold text-[#2b2721]">Prescribed Herbal Formulations</h3>
          <ul className="space-y-2 text-xs">
            {recs.formulations.map((item, idx) => (
              <li key={idx} className="p-3 bg-white/80 rounded-xl border border-[#2b2721]/10 font-medium text-[#2b2721]">
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};

export default MyRecommendation;
