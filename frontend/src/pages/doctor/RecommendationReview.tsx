import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Plus, Trash2, FileText, Sparkles } from 'lucide-react';
import { dataStore, AssessmentRecord } from '../../services/dataStore';

const RecommendationReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);

  const [dietFavor, setDietFavor] = useState<string[]>([
    'Warm cooked grains (basmati rice, quinoa)',
    'Ghee & sesame oil',
    'Sweet ripe fruits (bananas, cooked apples)',
    'Warm milk with nutmeg & cardamom'
  ]);
  const [dietAvoid, setDietAvoid] = useState<string[]>([
    'Raw cold salads',
    'Pungent chili peppers',
    'Iced beverages & cold carbonated drinks',
    'Dry crackers & dry chips'
  ]);
  const [lifestyle, setLifestyle] = useState<string[]>([
    'Daily warm sesame oil Abhyanga self-massage',
    'Regular sleep schedule (in bed by 10:00 PM)',
    'Gentle Nadi Shodhana Pranayama (10 mins daily)',
    'Avoid cold winds & exposure to draft'
  ]);
  const [formulations, setFormulations] = useState<string[]>([
    'Ashwagandha Churna 3g twice daily with warm milk',
    'Triphala Churna 5g at bedtime with warm water',
    'Dhanwantharam Thailam for external application'
  ]);

  const [newFavorItem, setNewFavorItem] = useState('');
  const [newFormulationItem, setNewFormulationItem] = useState('');

  useEffect(() => {
    const record = dataStore.getAssessmentById(id || '');
    if (record) {
      setAssessment(record);
    }
  }, [id]);

  const handleAddFavor = () => {
    if (newFavorItem.trim()) {
      setDietFavor([...dietFavor, newFavorItem.trim()]);
      setNewFavorItem('');
    }
  };

  const handleAddFormulation = () => {
    if (newFormulationItem.trim()) {
      setFormulations([...formulations, newFormulationItem.trim()]);
      setNewFormulationItem('');
    }
  };

  const handleApprove = () => {
    const updated = dataStore.saveAssessment({
      id: assessment?.id || id,
      patientId: assessment?.patientId || 'AE-2041',
      patientName: assessment?.patientName || 'Ananya Sharma',
      status: 'Reviewed',
      recommendations: {
        dietFavor,
        dietAvoid,
        lifestyle,
        formulations
      }
    });

    navigate(`/doctor/reports/generate`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to={`/doctor/assessments/${id}/result`}
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Prakriti Result</span>
        </Link>
        <span className="text-xs font-mono font-bold text-[#2b2721]/70 bg-white/70 px-3 py-1 rounded-full border border-[#2b2721]/15">
          Review for: {assessment?.patientName || 'Ananya Sharma'}
        </span>
      </div>

      {/* Header */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[28px] border border-[#2b2721]/15 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60 mb-1">
          <Sparkles size={14} className="text-amber-700" />
          <span>Ayurvedic Ahara, Vihara & Aushadhi Customizer</span>
        </div>
        <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Recommendation Review & Approval</h1>
        <p className="text-xs text-[#2b2721]/70 mt-1 font-medium">
          Customize dietary plan, lifestyle routines, and herbal formulations prior to issuing clinical report.
        </p>
      </div>

      {/* Grid: Ahara (Dietary) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Foods to Favor */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
          <h3 className="text-base font-serif font-bold text-emerald-900 flex items-center justify-between">
            <span>Ahara: Foods & Spices to Favor</span>
            <span className="text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-900 px-2 py-0.5 rounded-full">Recommended</span>
          </h3>

          <ul className="space-y-2 text-xs">
            {dietFavor.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between p-2.5 bg-white/80 rounded-xl border border-[#2b2721]/10">
                <span className="font-medium text-[#2b2721]">{item}</span>
                <button 
                  onClick={() => setDietFavor(dietFavor.filter((_, i) => i !== idx))}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="text"
              placeholder="Add food to favor..."
              value={newFavorItem}
              onChange={e => setNewFavorItem(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-[#2b2721]/20 rounded-xl text-xs"
            />
            <button 
              onClick={handleAddFavor}
              className="p-2 bg-[#2b2721] text-[#ece7dc] rounded-xl hover:bg-[#1a1714]"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Foods to Avoid */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
          <h3 className="text-base font-serif font-bold text-red-900 flex items-center justify-between">
            <span>Ahara: Foods to Minimize / Avoid</span>
            <span className="text-[10px] font-bold uppercase bg-red-500/15 text-red-900 px-2 py-0.5 rounded-full">Contraindicated</span>
          </h3>

          <ul className="space-y-2 text-xs">
            {dietAvoid.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between p-2.5 bg-white/80 rounded-xl border border-[#2b2721]/10">
                <span className="font-medium text-[#2b2721]">{item}</span>
                <button 
                  onClick={() => setDietAvoid(dietAvoid.filter((_, i) => i !== idx))}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Vihara & Aushadhi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Vihara (Lifestyle) */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
          <h3 className="text-base font-serif font-bold text-[#2b2721]">Vihara: Dinacharya & Daily Routine</h3>
          <ul className="space-y-2 text-xs">
            {lifestyle.map((item, idx) => (
              <li key={idx} className="p-2.5 bg-white/80 rounded-xl border border-[#2b2721]/10 font-medium text-[#2b2721]">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Aushadhi (Herbal Formulations) */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
          <h3 className="text-base font-serif font-bold text-[#2b2721]">Aushadhi: Formulations & Herbs</h3>
          <ul className="space-y-2 text-xs">
            {formulations.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between p-2.5 bg-white/80 rounded-xl border border-[#2b2721]/10">
                <span className="font-medium text-[#2b2721]">{item}</span>
                <button 
                  onClick={() => setFormulations(formulations.filter((_, i) => i !== idx))}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="text"
              placeholder="Add Ayurvedic herb/formulation..."
              value={newFormulationItem}
              onChange={e => setNewFormulationItem(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-[#2b2721]/20 rounded-xl text-xs"
            />
            <button 
              onClick={handleAddFormulation}
              className="p-2 bg-[#2b2721] text-[#ece7dc] rounded-xl hover:bg-[#1a1714]"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Approve Action */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          onClick={handleApprove}
          className="px-6 py-3.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2"
        >
          <span>Approve & Proceed to Report Generation</span>
          <FileText size={15} />
        </button>
      </div>

    </div>
  );
};

export default RecommendationReview;
