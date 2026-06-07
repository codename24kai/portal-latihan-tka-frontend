import React from 'react';
import { HelpCircle, Layers, Target, Zap } from 'lucide-react';
import Dropdown from '@/komponen/ui/Dropdown';
import Badge from '@/komponen/ui/Badge';
import { SUBJECTS } from '@/konstanta/mataPelajaran';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS, COGNITIVE_LEVELS, DIFFICULTY_LEVELS } from '@/konstanta/soal';

export default function QuestionMetaPanel({ data, onChange }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-700 space-y-8 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
          <HelpCircle size={20} />
        </div>
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Klasifikasi</h3>
      </div>

      <div className="space-y-6">
        {/* Tipe Kebutuhan Soal (Field Baru) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 ml-1">
            <Target size={12} className="text-emerald-500" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipe Kebutuhan Soal</label>
          </div>
          <Dropdown
            value={data.kebutuhan_soal}
            onChange={(val) => onChange('kebutuhan_soal', val)}
            options={[
              { value: 'Latihan Mandiri', label: 'Latihan Mandiri' },
              { value: 'Simulasi TKA', label: 'Simulasi TKA' },
              { value: 'Survei', label: 'Survei' }
            ]}
            fullWidth
            placeholder="Pilih Kebutuhan..."
          />
        </div>

        {/* Question Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 ml-1">
            <Zap size={12} className="text-indigo-500" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipe Soal</label>
          </div>
          <Dropdown
            value={data.question_type}
            onChange={(val) => onChange('question_type', val)}
            options={Object.values(QUESTION_TYPES).map(type => ({
              value: type,
              label: QUESTION_TYPE_LABELS[type]
            }))}
            fullWidth
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 ml-1">
            <Layers size={12} className="text-blue-500" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mata Pelajaran</label>
          </div>
          <Dropdown
            value={data.subject}
            onChange={(val) => onChange('subject', val)}
            options={SUBJECTS.map(s => ({ value: s.name, label: s.name }))}
            fullWidth
          />
        </div>

      </div>
    </div>
  );
}