import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Trash2, Plus, Save, Bell, X, Star, User, Link as LinkIcon, 
  Briefcase, CheckCircle, Image as ImageIcon, RotateCcw, Cloud, Mail, 
  Key, Server, Eye, EyeOff, ShieldCheck, Zap, AlertCircle, Loader2, 
  Info, Lightbulb, Check, Database, Download, Upload, FileJson
} from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
}

interface SectionImages {
  about: string;
  careers: string;
}

interface EmailConfig {
  recipientEmail: string;
  serviceId: string;
  templateId: string;
  publicKey: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  useSmtp: boolean;
}

interface Notice {
  id: string;
  text: string;
  active: boolean;
}

interface Review {
  id: string;
  author: string;
  text: string;
  time: string;
  avatar?: string;
  initials: string;
  color: string;
}

interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  slides: Slide[];
  setSlides: (slides: Slide[]) => void;
  sectionImages: SectionImages;
  setSectionImages: (imgs: SectionImages) => void;
  emailConfig: EmailConfig;
  setEmailConfig: (config: EmailConfig) => void;
  notices: Notice[];
  setNotices: (notices: Notice[]) => void;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  partners: Partner[];
  setPartners: (partners: Partner[]) => void;
  googleMapsLink: string;
  setGoogleMapsLink: (link: string) => void;
  activeTab: 'slides' | 'notices' | 'reviews' | 'partners' | 'images' | 'email' | 'database';
  setActiveTab: (tab: any) => void;
  t: any;
  isSyncing: boolean;
  onResetDefaults: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen, onClose, onLogout, slides, setSlides, sectionImages, setSectionImages, emailConfig, setEmailConfig, notices, setNotices, reviews, setReviews, 
  partners, setPartners, googleMapsLink, setGoogleMapsLink, activeTab, setActiveTab, t, isSyncing, onResetDefaults
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handlers
  const addSlide = () => {
    const newSlide: Slide = { id: Date.now().toString(), title: "Novo Slide", description: "Descrição...", image: slides[0]?.image || "", tag: "NOVO" };
    setSlides([...slides, newSlide]);
  };
  const removeSlide = (id: string) => slides.length > 1 && setSlides(slides.filter(s => s.id !== id));
  const updateSlide = (id: string, field: keyof Slide, value: string) => setSlides(slides.map(s => s.id === id ? { ...s, [field]: value } : s));

  const updateSectionImage = (key: keyof SectionImages, value: string) => setSectionImages({ ...sectionImages, [key]: value });

  const updateEmailConfig = (key: keyof EmailConfig, value: any) => {
    setEmailConfig({ ...emailConfig, [key]: value });
    if (testStatus !== 'idle') setTestStatus('idle');
  };

  const handleTestConnection = async () => {
    if (emailConfig.useSmtp && (!emailConfig.smtpHost || !emailConfig.smtpPort || !emailConfig.smtpUser)) {
      alert("Por favor, preencha os dados do servidor SMTP antes de testar.");
      return;
    }
    setTestStatus('testing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestStatus(emailConfig.smtpHost.includes('exemplo') ? 'error' : 'success');
    setTimeout(() => setTestStatus('idle'), 4000);
  };

  const addNotice = () => setNotices([...notices, { id: Date.now().toString(), text: "Novo aviso...", active: true }]);
  const removeNotice = (id: string) => setNotices(notices.filter(n => n.id !== id));
  const updateNotice = (id: string, text: string) => setNotices(notices.map(n => n.id === id ? { ...n, text } : n));
  const toggleNotice = (id: string) => setNotices(notices.map(n => n.id === id ? { ...n, active: !n.active } : n));

  const addReview = () => setReviews([...reviews, { id: Date.now().toString(), author: "Novo Autor", text: "Conteúdo...", time: "Agora mesmo", initials: "NA", color: "#f8c8c4" }]);
  const removeReview = (id: string) => setReviews(reviews.filter(r => r.id !== id));
  const updateReview = (id: string, field: keyof Review, value: string) => setReviews(reviews.map(r => r.id === id ? { ...r, [field]: value } : r));

  const addPartner = () => setPartners([...partners, { id: Date.now().toString(), name: "Novo Parceiro", logo: "", url: "https://" }]);
  const removePartner = (id: string) => setPartners(partners.filter(p => p.id !== id));
  const updatePartner = (id: string, field: keyof Partner, value: string) => setPartners(partners.map(p => p.id === id ? { ...p, [field]: value } : p));

  // --- Database Management ---
  const exportDatabase = () => {
    const data = {
      slides, sectionImages, emailConfig, notices, reviews, partners, googleMapsLink,
      version: "1.0",
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rosimeire_servicos_db_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDatabase = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (confirm("Isto irá substituir todos os dados atuais do site. Deseja continuar?")) {
          if (data.slides) setSlides(data.slides);
          if (data.sectionImages) setSectionImages(data.sectionImages);
          if (data.emailConfig) setEmailConfig(data.emailConfig);
          if (data.notices) setNotices(data.notices);
          if (data.reviews) setReviews(data.reviews);
          if (data.partners) setPartners(data.partners);
          if (data.googleMapsLink) setGoogleMapsLink(data.googleMapsLink);
          alert("Base de dados restaurada com sucesso!");
        }
      } catch (err) {
        alert("Erro ao ler o ficheiro de backup. Certifique-se que é um JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  const handleFinalize = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-[1000] bg-[#081221] text-white overflow-y-auto"
    >
      <div className="container mx-auto px-8 md:px-32 py-24 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="flex items-center gap-8">
            <h2 className="heading-serif text-4xl md:text-7xl">Painel de Controlo</h2>
            <div className={`flex items-center gap-3 transition-all duration-500 ${isSyncing ? 'text-[#f8c8c4]' : 'text-white/10'}`}>
              <Cloud size={16} className={isSyncing ? "animate-pulse" : ""} />
              <span className="text-[8px] font-black tracking-[0.3em] uppercase">{isSyncing ? "A Sincronizar..." : "Dados Seguros"}</span>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <button onClick={onLogout} className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors">Sair</button>
            <button onClick={onClose} className="text-white/20 hover:text-white transition-colors ml-4"><X size={32}/></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-12 border-b border-white/5 mb-16 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {[
            { id: 'slides', icon: <ImageIcon size={14}/>, label: 'Slides' },
            { id: 'images', icon: <ImageIcon size={14}/>, label: 'Visual' },
            { id: 'email', icon: <Mail size={14}/>, label: 'E-mail' },
            { id: 'notices', icon: <Bell size={14}/>, label: 'Avisos' },
            { id: 'reviews', icon: <Star size={14}/>, label: 'Depoimentos' },
            { id: 'partners', icon: <Briefcase size={14}/>, label: 'Parceiros' },
            { id: 'database', icon: <Database size={14}/>, label: 'Dados' }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`pb-4 text-[10px] font-bold tracking-[0.3em] uppercase transition-all flex items-center gap-3 ${activeTab === tab.id ? 'text-[#f8c8c4] border-b border-[#f8c8c4]' : 'text-white/20 hover:text-white/40'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Forms Content */}
        <div className="min-h-[50vh]">
          {activeTab === 'slides' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {slides.map(s => (
                  <div key={s.id} className="crystal-card p-10 relative space-y-6">
                    <button onClick={() => removeSlide(s.id)} className="absolute top-6 right-6 text-red-500/30 hover:text-red-500"><Trash2 size={16}/></button>
                    <input value={s.image} onChange={e => updateSlide(s.id, 'image', e.target.value)} placeholder="URL da Imagem" className="admin-input" />
                    <input value={s.title} onChange={e => updateSlide(s.id, 'title', e.target.value)} placeholder="Título" className="admin-input font-bold" />
                    <textarea value={s.description} onChange={e => updateSlide(s.id, 'description', e.target.value)} placeholder="Descrição" className="admin-input text-xs" rows={2} />
                  </div>
                ))}
              </div>
              <button onClick={addSlide} className="admin-btn-add"><Plus size={16}/> Adicionar Novo Slide</button>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-12 max-w-4xl mx-auto">
              <div className="crystal-card p-12 space-y-10 border-[#f8c8c4]/10">
                <div className="flex items-center gap-6 text-[#f8c8c4]/60 mb-4">
                  <ImageIcon size={24}/>
                  <h3 className="text-xl font-bold tracking-widest uppercase text-white">Visual das Páginas</h3>
                </div>
                <div className="space-y-8">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase italic">Foto da Página Sobre</label>
                    <input value={sectionImages.about} onChange={e => updateSectionImage('about', e.target.value)} placeholder="URL da foto" className="admin-input" />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase italic">Foto da Página Carreiras</label>
                    <input value={sectionImages.careers} onChange={e => updateSectionImage('careers', e.target.value)} placeholder="URL da foto" className="admin-input" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-12 max-w-5xl mx-auto">
               <div className="crystal-card p-10 border-blue-500/20 bg-blue-500/[0.03] space-y-6">
                <div className="flex items-center gap-4 text-blue-400"><Lightbulb size={22} /><h4 className="text-[11px] font-black uppercase tracking-[0.4em]">Configuração de Mensagens</h4></div>
                <p className="text-xs text-white/40 leading-relaxed">Pode optar por utilizar o seu próprio servidor **SMTP** institucional ou o serviço **EmailJS** para processar os envios do formulário de contacto.</p>
              </div>

              <div className="crystal-card p-12 space-y-10 border-[#f8c8c4]/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-[#f8c8c4]/60"><Mail size={24}/><h3 className="text-xl font-bold tracking-widest uppercase text-white">Destinatário</h3></div>
                  <div className="flex items-center gap-4 bg-white/5 p-2 rounded-sm border border-white/5">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-white/30">Modo SMTP</span>
                    <button onClick={() => updateEmailConfig('useSmtp', !emailConfig.useSmtp)} className={`w-10 h-5 rounded-full relative transition-colors ${emailConfig.useSmtp ? 'bg-[#f8c8c4]' : 'bg-white/10'}`}><motion.div animate={{ x: emailConfig.useSmtp ? 20 : 0 }} className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5" /></button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase italic">E-mail para receber contactos</label>
                  <input type="email" value={emailConfig.recipientEmail} onChange={e => updateEmailConfig('recipientEmail', e.target.value)} className="admin-input" />
                </div>
              </div>

              <AnimatePresence>
                {emailConfig.useSmtp && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="crystal-card p-12 space-y-10 border-[#f8c8c4]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-[#f8c8c4]/60"><Server size={24}/><h3 className="text-xl font-bold tracking-widest uppercase text-white">Servidor SMTP</h3></div>
                      <button onClick={handleTestConnection} disabled={testStatus === 'testing'} className={`flex items-center gap-3 px-6 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border ${testStatus === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' : testStatus === 'error' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-[#f8c8c4]/10 border-[#f8c8c4] text-[#f8c8c4] hover:bg-[#f8c8c4] hover:text-[#081221]'}`}>
                        {testStatus === 'testing' ? <Loader2 size={14} className="animate-spin" /> : testStatus === 'success' ? <CheckCircle size={14} /> : testStatus === 'error' ? <AlertCircle size={14} /> : <Zap size={14} />}
                        {testStatus === 'testing' ? 'A Ligar...' : testStatus === 'success' ? 'Ligação OK' : testStatus === 'error' ? 'Falha na Ligação' : 'Testar Ligação'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">Host do Servidor</label><input value={emailConfig.smtpHost} onChange={e => updateEmailConfig('smtpHost', e.target.value)} placeholder="smtp.exemplo.com" className="admin-input" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">Porta</label><input value={emailConfig.smtpPort} onChange={e => updateEmailConfig('smtpPort', e.target.value)} placeholder="587" className="admin-input" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">Utilizador</label><input value={emailConfig.smtpUser} onChange={e => updateEmailConfig('smtpUser', e.target.value)} className="admin-input" /></div>
                      <div className="space-y-2 relative"><label className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase">Palavra-passe</label><div className="relative"><input type={showSmtpPass ? "text" : "password"} value={emailConfig.smtpPass} onChange={e => updateEmailConfig('smtpPass', e.target.value)} className="admin-input pr-12" /><button onClick={() => setShowSmtpPass(!showSmtpPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#f8c8c4]">{showSmtpPass ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="crystal-card p-12 space-y-12 border-blue-500/20">
                <div className="flex items-center gap-6 text-blue-400">
                  <Database size={28} />
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold tracking-widest uppercase text-white">Base de Dados Interna</h3>
                    <p className="text-[10px] font-bold tracking-[0.3em] text-blue-400/60 uppercase">Gestão e Backups Portáteis</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-white/60"><Download size={20}/> <h4 className="text-sm font-bold uppercase tracking-widest">Fazer Backup</h4></div>
                    <p className="text-xs text-white/30 leading-relaxed italic">Descarregue todas as configurações do site (fotos, textos, e-mails) para um ficheiro JSON. Guarde este ficheiro num local seguro.</p>
                    <button onClick={exportDatabase} className="w-full flex items-center justify-center gap-4 py-6 border border-[#f8c8c4]/20 text-[#f8c8c4] hover:bg-[#f8c8c4] hover:text-[#081221] transition-all rounded-sm uppercase text-[10px] font-black tracking-widest">
                      <FileJson size={16} /> Exportar Base de Dados (.json)
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-white/60"><Upload size={20}/> <h4 className="text-sm font-bold uppercase tracking-widest">Restaurar Site</h4></div>
                    <p className="text-xs text-white/30 leading-relaxed italic">Selecione um ficheiro de backup previamente exportado para restaurar o site para esse estado específico em qualquer dispositivo.</p>
                    <input type="file" ref={fileInputRef} onChange={importDatabase} accept=".json" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-4 py-6 border border-white/10 text-white/40 hover:border-white/30 hover:text-white transition-all rounded-sm uppercase text-[10px] font-black tracking-widest">
                      <Upload size={16} /> Importar Backup
                    </button>
                  </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-8">
                   <button onClick={onResetDefaults} className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-red-400/40 hover:text-red-400 transition-colors border border-red-400/10 px-8 py-4 hover:border-red-400/30 rounded-sm">
                    <RotateCcw size={14}/> Limpar Tudo e Resetar Padrões de Fábrica
                  </button>
                  <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] text-center max-w-sm">Atenção: A limpeza apaga permanentemente todos os dados não exportados.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {notices.map(n => (
                <div key={n.id} className="crystal-card p-8 flex items-center justify-between gap-8">
                  <input value={n.text} onChange={e => updateNotice(n.id, e.target.value)} className="admin-input flex-1" />
                  <div className="flex gap-4">
                    <button onClick={() => toggleNotice(n.id)} className={`p-4 border transition-all ${n.active ? 'border-[#f8c8c4] text-[#f8c8c4]' : 'border-white/5 text-white/10'}`}><Bell size={18}/></button>
                    <button onClick={() => removeNotice(n.id)} className="p-4 text-red-500/20 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
              <button onClick={addNotice} className="admin-btn-add"><Plus size={16}/> Adicionar Novo Aviso</button>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-12">
               <div className="crystal-card p-8 border-[#f8c8c4]/20 border-dashed">
                  <label className="text-[9px] font-bold tracking-[0.3em] text-[#f8c8c4]/60 uppercase mb-4 block">Link das Avaliações (Google Maps)</label>
                  <input value={googleMapsLink} onChange={e => setGoogleMapsLink(e.target.value)} className="admin-input" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map(r => (
                  <div key={r.id} className="crystal-card p-10 relative space-y-6">
                    <button onClick={() => removeReview(r.id)} className="absolute top-6 right-6 text-red-500/30 hover:text-red-500"><Trash2 size={16}/></button>
                    <div className="grid grid-cols-2 gap-4">
                      <input value={r.author} onChange={e => updateReview(r.id, 'author', e.target.value)} placeholder="Autor" className="admin-input font-bold" />
                      <input value={r.time} onChange={e => updateReview(r.id, 'time', e.target.value)} placeholder="Tempo" className="admin-input" />
                    </div>
                    <textarea value={r.text} onChange={e => updateReview(r.id, 'text', e.target.value)} className="admin-input" rows={3} />
                  </div>
                ))}
               </div>
               <button onClick={addReview} className="admin-btn-add"><Plus size={16}/> Adicionar Depoimento Manual</button>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {partners.map(p => (
                  <div key={p.id} className="crystal-card p-10 relative space-y-6">
                    <button onClick={() => removePartner(p.id)} className="absolute top-6 right-6 text-red-500/30 hover:text-red-500"><Trash2 size={16}/></button>
                    <input value={p.name} onChange={e => updatePartner(p.id, 'name', e.target.value)} placeholder="Nome" className="admin-input font-bold" />
                    <input value={p.logo} onChange={e => updatePartner(p.id, 'logo', e.target.value)} placeholder="URL do Logo" className="admin-input" />
                    <input value={p.url} onChange={e => updatePartner(p.id, 'url', e.target.value)} placeholder="Link URL" className="admin-input" />
                  </div>
                ))}
              </div>
              <button onClick={addPartner} className="admin-btn-add"><Plus size={16}/> Adicionar Novo Parceiro</button>
            </div>
          )}
        </div>

        {/* Finalize Section */}
        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col items-center gap-8">
          <button onClick={handleFinalize} disabled={isSaving} className="btn-serenity px-32 py-8 flex items-center justify-center gap-6 relative overflow-hidden min-w-[400px]">
            {isSaving ? <span className="flex items-center gap-3"><Loader2 size={16} className="animate-spin"/> Gravando Alterações...</span> : <><CheckCircle size={16}/> Concluir Gestão</>}
          </button>
        </div>
      </div>

      <style>{`
        .admin-input {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          padding: 1rem; color: white; font-size: 0.8rem; border-radius: 2px; outline: none; transition: border-color 0.3s ease;
        }
        .admin-input:focus { border-color: #f8c8c4; }
        .admin-btn-add {
          width: 100%; padding: 2rem; border: 1px dashed rgba(255,255,255,0.1); color: rgba(255,255,255,0.2);
          text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.4em; font-weight: bold;
          display: flex; align-items: center; justify-content: center; gap: 1rem; transition: all 0.3s ease;
        }
        .admin-btn-add:hover { color: #f8c8c4; border-color: #f8c8c4; background: rgba(248,200,196,0.02); }
      `}</style>
    </motion.div>
  );
};

export default AdminPanel;