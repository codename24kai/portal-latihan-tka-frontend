import { Plus, Trash2, Calculator, ImageIcon, X } from 'lucide-react';
import Dropdown from '@/components/ui/Dropdown';
import MathRenderer from '@/components/ui/MathRenderer';

const QuizBuilder = ({ quizData, setQuizData, openMathEditor }) => {
  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { 
        id: Date.now(), 
        text: '', 
        image: null,
        options: [
          { text: '', image: null },
          { text: '', image: null },
          { text: '', image: null },
          { text: '', image: null }
        ], 
        answer: 0 
      }]
    }));
  };

  const removeQuestion = (id) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, field, value) => {
    const newQuestions = [...quizData.questions];
    // Migration check: if option is still a string, convert to object
    if (typeof newQuestions[qIndex].options[oIndex] === 'string') {
      newQuestions[qIndex].options[oIndex] = { text: newQuestions[qIndex].options[oIndex], image: null };
    }
    newQuestions[qIndex].options[oIndex][field] = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleImageUpload = (e, qIndex, oIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (oIndex === null) {
        updateQuestion(qIndex, 'image', base64);
      } else {
        updateOption(qIndex, oIndex, 'image', base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 pt-4 animate-in slide-in-from-top-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Syarat Akses Kuis</label>
          <Dropdown
            value={quizData.prerequisite}
            onChange={(val) => setQuizData({ ...quizData, prerequisite: val })}
            options={[
              { value: 'download', label: 'Selesaikan Materi / Download' },
              { value: 'video', label: 'Tonton Video Sampai Selesai' }
            ]}
            fullWidth
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Kuis</label>
          <input
            type="text"
            value={quizData.title}
            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
            placeholder="E.g. Kuis Pemahaman Materi"
            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-bold outline-none dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-6">
        {quizData.questions.map((q, qIndex) => (
          <div key={q.id} className="p-8 bg-slate-50 dark:bg-slate-900/30 rounded-[2rem] border border-slate-100 dark:border-slate-700 relative group animate-in zoom-in-95">
            <div className="flex items-start gap-4 mb-6">
               <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-600/20 shrink-0">{qIndex + 1}</span>
               <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pertanyaan {qIndex + 1}</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => openMathEditor(qIndex, 'text')}
                        className="flex items-center gap-1.5 text-[8px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg uppercase tracking-widest transition-all hover:scale-105"
                      >
                        <Calculator size={10} /> Rumus
                      </button>
                      <button
                        onClick={() => removeQuestion(q.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Hapus Pertanyaan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                        placeholder="Ketik pertanyaan kuis..."
                        className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none font-bold text-sm text-slate-800 dark:text-white pb-1"
                      />
                      <label className="absolute right-0 bottom-1 cursor-pointer text-slate-300 hover:text-indigo-500 transition-colors">
                        <ImageIcon size={18} />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, qIndex)} 
                        />
                      </label>
                    </div>

                    {q.image && (
                      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group/img">
                        <img src={q.image} alt="Question" className="w-full h-auto object-contain bg-white" />
                        <button 
                          onClick={() => updateQuestion(qIndex, 'image', null)}
                          className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  {q.text.includes('$') && (
                    <div className="mt-4 p-4 bg-indigo-50/30 dark:bg-indigo-900/10 border border-dashed border-indigo-200 dark:border-indigo-800 rounded-2xl animate-in fade-in zoom-in-95">
                      <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-2">Pratinjau Rumus</p>
                      <MathRenderer text={q.text} className="text-xs text-slate-700 dark:text-slate-200" />
                    </div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="relative">
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black ${q.answer === oIndex ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {String.fromCharCode(65 + oIndex)}
                      </div>
                      <input
                        type="text"
                        value={typeof opt === 'string' ? opt : opt.text}
                        onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                        placeholder={`Opsi ${String.fromCharCode(65 + oIndex)}`}
                        className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[11px] font-bold focus:border-emerald-500 outline-none"
                      />
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-2">
                         <label className="text-slate-300 hover:text-indigo-500 transition-colors cursor-pointer">
                            <ImageIcon size={14} />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, qIndex, oIndex)} 
                            />
                         </label>
                         <button onClick={() => openMathEditor(qIndex, 'option', oIndex)} className="text-slate-300 hover:text-indigo-500 transition-colors"><Calculator size={14} /></button>
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                         <input type="radio" checked={q.answer === oIndex} onChange={() => updateQuestion(qIndex, 'answer', oIndex)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                      </div>
                    </div>

                    {opt.image && (
                      <div className="relative w-full rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 group/optimg shadow-sm bg-white dark:bg-slate-900">
                        <img src={opt.image} alt={`Option ${oIndex}`} className="max-h-24 w-full object-contain p-2" />
                        <button 
                          onClick={() => updateOption(qIndex, oIndex, 'image', null)}
                          className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-md opacity-0 group-hover/optimg:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                  {(typeof opt === 'string' ? opt : opt.text).includes('$') && (
                    <div className="absolute left-12 -bottom-10 z-10 px-4 py-2 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-800 rounded-xl shadow-xl animate-in slide-in-from-top-1">
                      <MathRenderer text={typeof opt === 'string' ? opt : opt.text} className="text-[10px]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={addQuestion}
          className="w-full py-6 border-4 border-dashed border-slate-50 dark:border-slate-800 rounded-[2.5rem] flex items-center justify-center gap-3 text-slate-300 hover:text-indigo-600 hover:border-indigo-100 transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <Plus size={20} /> Tambah Pertanyaan Kuis
        </button>
      </div>
    </div>
  );
};

export default QuizBuilder;
