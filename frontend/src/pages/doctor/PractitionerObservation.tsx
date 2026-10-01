import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Activity, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';
import { assessmentService, type AssessmentModel } from '../../services/api';

const PractitionerObservation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentModel | null>(null);

  const [nadiGati, setNadiGati] = useState<'Sarpa (Snake)' | 'Hamsa (Swan)' | 'Manduka (Frog)'>('Sarpa (Snake)');
  const [nadiRate, setNadiRate] = useState(76);
  const [jihva, setJihva] = useState<'Uncoated (Nirama)' | 'Coated (Sama)' | 'Cracked'>('Uncoated (Nirama)');
  const [twak, setTwak] = useState<'Warm & Moist' | 'Cool & Dry' | 'Oily & Soft'>('Cool & Dry');
  const [netra, setNetra] = useState<'Clear & Bright' | 'Reddish & Sensitive' | 'Large & Moist'>('Clear & Bright');
  const [agni, setAgni] = useState<'Mandagni' | 'Tikshnagni' | 'Vishamagni' | 'Samagni'>('Vishamagni');
  const [mentorNotes, setMentorNotes] = useState('');

  useEffect(() => {
    const fetchAsm = async () => {
      try {
        if (id) {
          const existing = await assessmentService.getAssessment(id);
          setAssessment(existing);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAsm();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    try {
      const obsText = `Mentor Verification:\nNadi: ${nadiGati} (${nadiRate} bpm)\nJihva: ${jihva}\nTwak: ${twak}\nNetra: ${netra}\nAgni: ${agni}\n\nMentor Feedback: ${mentorNotes}`;
      
      await assessmentService.addObservation(id, { notes: obsText });
      
      if (assessment?.status !== 'reviewed' && assessment?.status !== 'finalized') {
        await assessmentService.updateStatus(id, 'reviewed');
      }

      navigate(`/doctor/assessments/${id}/result`);
    } catch (err) {
      console.error(err);
      alert('Failed to save mentor feedback');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to={`/doctor/assessments/${id}/questionnaire`} 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Questionnaire</span>
        </Link>
        <span className="text-xs font-mono font-bold text-[#2b2721]/70 bg-white/70 px-3 py-1 rounded-full border border-[#2b2721]/15">
          Patient: {assessment?.patientName || 'Patient'}
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[28px] border border-[#2b2721]/15 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60 mb-1">
          <HeartPulse size={14} className="text-amber-700" />
          <span>Ashtavidha Pariksha Diagnostics</span>
        </div>
        <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Practitioner Clinical Observations</h1>
        <p className="text-xs text-[#2b2721]/70 mt-1 font-medium">
          Record physical Nadi Pariksha pulse movement, tongue coating (Jihva), and skin/eye diagnostic signs.
        </p>
      </div>

      {/* Nadi Pariksha Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#2b2721] flex items-center space-x-2">
          <Activity size={18} className="text-emerald-700" />
          <span>Nadi Pariksha (Pulse Diagnosis)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: 'Sarpa Gati (Snake)', dosha: 'Vata Dominant', desc: 'Fast, thin, quick pulse rate like a slithering cobra.' },
            { title: 'Manduka Gati (Frog)', dosha: 'Pitta Dominant', desc: 'Jumping, forceful, bounding pulse like a hopping frog.' },
            { title: 'Hamsa Gati (Swan)', dosha: 'Kapha Dominant', desc: 'Slow, steady, broad, graceful pulse like a swan.' },
          ].map(opt => {
            const isSelected = nadiGati.includes(opt.title.split(' ')[0]);
            return (
              <div 
                key={opt.title}
                onClick={() => setNadiGati(opt.title as any)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#2b2721] text-[#ece7dc] border-[#2b2721] shadow-md' 
                    : 'bg-white/80 hover:bg-white text-[#2b2721] border-[#2b2721]/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold">{opt.title}</h4>
                  {isSelected && <CheckCircle2 size={14} className="text-amber-300" />}
                </div>
                <span className={`text-[10px] font-bold block mb-1 ${isSelected ? 'text-amber-300' : 'text-amber-800'}`}>
                  {opt.dosha}
                </span>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-[#ece7dc]/70' : 'text-[#2b2721]/60'}`}>
                  {opt.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pulse Rate Slider */}
        <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/12 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>Radial Pulse Rate (BPM)</span>
            <span className="font-mono text-sm text-emerald-800">{nadiRate} bpm</span>
          </div>
          <input 
            type="range" 
            min={50} 
            max={110} 
            value={nadiRate}
            onChange={e => setNadiRate(Number(e.target.value))}
            className="w-full accent-[#2b2721]"
          />
        </div>
      </div>

      {/* Jihva, Twak, Netra & Agni Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Jihva */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-5 rounded-[22px] border border-[#2b2721]/15 shadow-sm space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2b2721]">Jihva (Tongue Coating)</h4>
          <select 
            value={jihva}
            onChange={e => setJihva(e.target.value as any)}
            className="w-full p-2.5 bg-white border border-[#2b2721]/20 rounded-xl text-xs font-bold text-[#2b2721]"
          >
            <option value="Uncoated (Nirama)">Uncoated (Nirama - Clear)</option>
            <option value="Coated (Sama)">Coated (Sama - Ama present)</option>
            <option value="Cracked">Cracked & Dry (Vata predominant)</option>
          </select>
        </div>

        {/* Twak */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-5 rounded-[22px] border border-[#2b2721]/15 shadow-sm space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2b2721]">Twak (Skin Temperature & Moisture)</h4>
          <select 
            value={twak}
            onChange={e => setTwak(e.target.value as any)}
            className="w-full p-2.5 bg-white border border-[#2b2721]/20 rounded-xl text-xs font-bold text-[#2b2721]"
          >
            <option value="Cool & Dry">Cool & Dry (Vata)</option>
            <option value="Warm & Moist">Warm & Moist (Pitta)</option>
            <option value="Oily & Soft">Oily & Soft (Kapha)</option>
          </select>
        </div>

        {/* Netra */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-5 rounded-[22px] border border-[#2b2721]/15 shadow-sm space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2b2721]">Netra (Eye Appearance)</h4>
          <select 
            value={netra}
            onChange={e => setNetra(e.target.value as any)}
            className="w-full p-2.5 bg-white border border-[#2b2721]/20 rounded-xl text-xs font-bold text-[#2b2721]"
          >
            <option value="Clear & Bright">Clear & Bright</option>
            <option value="Reddish & Sensitive">Reddish & Sensitive (Pitta)</option>
            <option value="Large & Moist">Large & Moist (Kapha)</option>
          </select>
        </div>

        {/* Agni */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-5 rounded-[22px] border border-[#2b2721]/15 shadow-sm space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2b2721]">Agni (Digestive Fire)</h4>
          <select 
            value={agni}
            onChange={e => setAgni(e.target.value as any)}
            className="w-full p-2.5 bg-white border border-[#2b2721]/20 rounded-xl text-xs font-bold text-[#2b2721]"
          >
            <option value="Vishamagni">Vishamagni (Irregular - Vata)</option>
            <option value="Tikshnagni">Tikshnagni (Sharp/Intense - Pitta)</option>
            <option value="Mandagni">Mandagni (Slow/Sluggish - Kapha)</option>
            <option value="Samagni">Samagni (Balanced Fire)</option>
          </select>
        </div>

      </div>

      {/* Mentor Notes Text Area */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#2b2721]">Mentor Clinical Feedback</h3>
        <textarea
          className="w-full h-24 p-3 bg-white border border-[#2b2721]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/40 text-sm"
          placeholder="Provide constructive feedback for the student on their rationale..."
          value={mentorNotes}
          onChange={(e) => setMentorNotes(e.target.value)}
        />
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => navigate(`/doctor/assessments/${id}/questionnaire`)}
          className="px-5 py-2.5 bg-white border border-[#2b2721]/20 text-[#2b2721] rounded-full text-xs font-bold hover:bg-[#fcfaf4] transition-all"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2"
        >
          <CheckCircle2 size={16} />
          <span>Verify & Generate Result</span>
        </button>
      </div>

    </div>
  );
};

export default PractitionerObservation;
