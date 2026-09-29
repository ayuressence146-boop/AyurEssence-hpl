import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star, Award, CheckCircle, AlertCircle, ArrowRight, UserCheck, Calendar } from 'lucide-react';

const MentorFeedback = () => {
  const navigate = useNavigate();

  const feedbackList = [
    {
      id: 1,
      patientName: 'Aarav Sharma',
      patientId: 'AE-1001',
      mentor: 'Dr. Ananya Rao',
      mentorTitle: 'Senior Clinical Vaidya',
      date: '2025-09-28',
      score: '85%',
      type: 'correction',
      title: 'Skin Texture vs. Dosha Correlation',
      feedback: 'For Aarav Sharma, you noted Kapha dominance in skin texture, but the patient presented with severe dryness indicating Vata imbalance. Please review Charaka Samhita, Vimanasthana Ch 8.',
      actionableAdvice: 'Pay closer attention to seasonal weather influences on skin moisture when scoring Twak Pariksha.'
    },
    {
      id: 2,
      patientName: 'Priya Patel',
      patientId: 'AE-1002',
      mentor: 'Dr. Rajesh Vaidya',
      mentorTitle: 'Professor of Dravyaguna & Kayachikitsa',
      date: '2025-09-25',
      score: '96%',
      type: 'praise',
      title: 'Outstanding Prakriti Analysis',
      feedback: 'Spot-on Pitta-Vata assessment for Priya Patel. Your correlation of dietary habits with the presented symptoms was well reasoned and clinically accurate.',
      actionableAdvice: 'Keep up the excellent documentation format for Agni evaluation.'
    },
    {
      id: 3,
      patientName: 'Rohan Gupta',
      patientId: 'AE-1003',
      mentor: 'Dr. Ananya Rao',
      mentorTitle: 'Senior Clinical Vaidya',
      date: '2025-09-20',
      score: '91%',
      type: 'praise',
      title: 'Nadi Gati Precision',
      feedback: 'Correct identification of Hamsa Gati in patient pulse. Excellent capture of Kapha overload.',
      actionableAdvice: 'Verify if the pulse rate slows down further in early morning hours.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
              Clinical Evaluations
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Mentor Reviews & Clinical Guidance
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Feedback provided by Senior Ayurvedic Doctors on your diagnostic submissions.
          </p>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbackList.map((item) => (
          <div
            key={item.id}
            className={`bg-[#fbf7ee]/80 border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${
              item.type === 'correction' ? 'border-amber-800/30' : 'border-emerald-800/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/10 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  item.type === 'correction' ? 'bg-amber-800/15 text-amber-950' : 'bg-emerald-800/15 text-emerald-950'
                }`}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-amber-950 text-base">{item.title}</h3>
                  <p className="text-xs text-amber-900/70">
                    Patient: <span className="font-semibold text-amber-950">{item.patientName} ({item.patientId})</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <span className="text-xs text-amber-800/60 font-medium flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-800 text-amber-50">
                  {item.score} Score
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-amber-950 leading-relaxed bg-white/60 p-4 rounded-xl border border-amber-900/10">
                "{item.feedback}"
              </p>

              <div className="p-3 rounded-xl bg-amber-800/10 border border-amber-900/15 text-xs text-amber-950 font-medium flex items-start space-x-2">
                <Star size={16} className="text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 block">Actionable Guidance:</span>
                  <span>{item.actionableAdvice}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-amber-800/70 font-medium">
                  Reviewed by <span className="font-bold text-amber-950">{item.mentor}</span> • {item.mentorTitle}
                </div>
                <button
                  onClick={() => navigate('/student/assessments/asm-101/comparison')}
                  className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center space-x-1"
                >
                  <span>View Case Comparison</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorFeedback;

