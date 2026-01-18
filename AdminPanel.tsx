
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Trash2, Plus, Save, Bell, X, Star, User, Link as LinkIcon, 
  Briefcase, CheckCircle, Image as ImageIcon, RotateCcw, Cloud, Mail, 
  Key, Server, Eye, EyeOff, ShieldCheck, Zap, AlertCircle, Loader2, 
  Info, Lightbulb, Check, Database, Download, Upload, FileJson, ExternalLink, Link, RefreshCw, CloudOff,
  Instagram, Linkedin, Palette, MessageSquare, Lock, Phone, MapPin, ToggleLeft, ToggleRight, Shield
} from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  buttonLink?: string;
  buttonText?: string;
}

interface SectionImages {
  about: string;
  careers: string;
}

interface SocialLinks {
  instagram: string;
  linkedin: string;
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
  socialLinks: SocialLinks;
  setSocialLinks: (links: SocialLinks) => void;
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
  contactPhone: string;
  setContactPhone: (phone: string) => void;
  addressDetail: string;
  setAddressDetail: (address: string) => void;
  adminUsername: string;
  setAdminUsername: (user: string) => void;
  adminPassword: string;
  setAdminPassword: (pass: string) => void;
  activeTab: 'slides' | 'notices' | 'reviews' | 'partners' | 'images' | 'email' | 'user';
  setActiveTab: (tab: any) => void;
  t: any;
  isSyncing: boolean;
  onResetDefaults: () => void;
  gasUrl: string;
  setGasUrl: (url: string) => void;
  onPublishToCloud: () => Promise<boolean>;
  cloudStatus: 'idle' | 'loading' | 'connected' | 'error';
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen, onClose, onLogout, slides, setSlides, sectionImages, setSectionImages, socialLinks, setSocialLinks, emailConfig, setEmailConfig, notices, setNotices, reviews, setReviews, 
  partners, setPartners, googleMapsLink, setGoogleMapsLink, contactPhone, setContactPhone, addressDetail, setAddressDetail, adminUsername, setAdminUsername, adminPassword, setAdminPassword, activeTab, setActiveTab, t, isSyncing, onResetDefaults, gasUrl, setGasUrl, onPublishToCloud, cloudStatus
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  if (!isOpen) return null;

  // Handlers
  const addSlide = () => {
    const newSlide: Slide = { id: Date.now().toString(), title: "Novo Slide", description: "Descrição...", image: slides[0]?.image || "", tag: "NOVO", buttonLink: "contact", buttonText: "SABER MAIS" };
    setSlides([...slides, newSlide]);
  };
  const removeSlide = (id: string) => slides.length > 1 && setSlides(slides.filter(s => s.id !== id));
  const updateSlide = (id: string, field: keyof Slide, value: string) => setSlides(slides.map(s => s.id === id ? { ...s, [field]: value } : s));

  const updateSectionImage = (key: keyof SectionImages, value: string) => setSectionImages({ ...sectionImages, [key]: value });

  const updateSocialLink = (key: keyof SocialLinks, value: string) => setSocialLinks({ ...socialLinks, [key]: value });

  const updateEmailConfig = (key: keyof EmailConfig, value: any) => {
    setEmailConfig({ ...emailConfig, [key]: value });
  };

  const addNotice = () => setNotices([...notices, { id: Date.now().toString(), text: "Novo aviso...", active: true }]);
  const removeNotice = (id: string) => setNotices(notices.filter(n => n.id !== id));
  const updateNotice = (id: string, text: string) => setNotices(notices.map(n => n.id === id ? { ...n, text } : n));
  const toggleNotice = (id: string) => setNotices(notices.map(n => n.id === id ? { ...n, active: !n.active } : n));

  const addReview = () => setReviews([...reviews, { id: Date.now().toString(), author: "Novo Autor", text: "Conteúdo...", time: "1 mês atrás", initials: "NA", color: "#f8c8c4", avatar: "" }]);
  const removeReview = (id: string) => setReviews(reviews.filter(r => r.id !== id));
  const updateReview = (id: string, field: keyof Review, value: string) => setReviews(reviews.map(r => r.id === id ? { ...r, [field]: value } : r));

  const addPartner = () => setPartners([...partners, { id: Date.now().toString(), name: "Novo Parceiro", logo: "", url: "https://" }]);
  const removePartner = (id: string) => setPartners(partners.filter(p => p.id !== id));
  const updatePartner = (id: string, field: keyof Partner, value: string) => setPartners(partners.map(p => p.id === id ? { ...p, [field]: value } : p));

  const handleFinalize = async () => {
    setIsSaving(true);
    await onPublishToCloud();
    setTimeout(() => { setIsSaving(false); onClose(); }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-[1000] bg-[#081221] text-white overflow-y-auto"
    >
      <div className="container mx-auto px-8 md:px-32 py-24 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
          <div className="flex items-center gap-8">
            <h2 className="heading-serif text-4xl md:text-7xl">Painel de Controlo</h2>
          </div>
          <div className="flex gap-6 items-center">
            <button onClick={onLogout} className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors">Sair</button>
            <button onClick={onClose} className="text-white/20 hover:text-white transition-colors ml-4"><X size={32}/></button>
          </div>
        </div>

        {/* Card de Informações Técnicas e Status Integrado */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-sm gap-8">
           <div className="flex items-center gap-6 flex-1 overflow-hidden">
             <div className="p-3 bg-white/5 rounded-sm">
                <Server size={18} className="text-[#f8c8c4]/40" />
             </div>
             <div className="flex flex-col gap-1 min-w-0">
               <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Endpoint SIR (Database API)</span>
               <span className="text-[10px] font-mono text-[#f8c8c4]/60 break-all select-all leading-relaxed">{gasUrl}</span>
             </div>
           </div>

           <div className={`flex items-center gap-4 px-6 py-4 rounded-sm bg-white/5 border border-white/5 transition-all duration-500`}>
              {cloudStatus === 'loading' ? <RefreshCw size={16} className="text-blue-400 animate-spin" /> : 
               cloudStatus === 'connected' ? <Cloud size={16} className="text-green-400" /> : 
               cloudStatus === 'error' ? <CloudOff size={16} className="text-red-400" /> : 
               <CloudOff size={16} className="text-white/20" />}
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                  {cloudStatus === 'connected' ? 'Sincronizado' : cloudStatus === 'loading' ? 'A Sincronizar...' : 'Estado Offline'}
                </span>
                <span className="text-[7px] font-bold tracking-[0.1em] text-white/20 uppercase">Acesso à Nuvem SIR Ativo</span>
              </div>
           </div>
        </div>

        {/* Separadores Reorganizados em Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-16">
          {[
            { id: 'slides', icon: <ImageIcon size={14}/>, label: 'Slides' },
            { id: 'images', icon: <Palette size={14}/>, label: 'Visual' },
            { id: 'email', icon: <Mail size={14}/>, label: 'Contacto' },
            { id: 'notices', icon: <Bell size={14}/>, label: 'Avisos' },
            { id: 'reviews', icon: <Star size={14}/>, label: 'Depoimentos' },
            { id: 'partners', icon: <Briefcase size={14}/>, label: 'Parceiros' },
            { id: 'user', icon: <User size={14}/>, label: 'Utilizador' }
          ].map((tab) => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id as any)} 
              className={`p-6 text-[10px] font-bold tracking-[0.3em] uppercase transition-all flex flex-col items-center justify-center gap-4 rounded-sm border ${activeTab === tab.id ? 'text-[#f8c8c4] border-[#f8c8c4] bg-[#f8c8c4]/5 shadow-[0_0_20px_rgba(248,200,196,0.05)]' : 'text-white/20 border-white/5 bg-white/[0.01] hover:text-white/40 hover:bg-white/[0.03]'}`}
            >
              <div className={`${activeTab === tab.id ? 'text-[#f8c8c4]' : 'text-white/10'}`}>
                {tab.icon}
              </div>
              <span className="text-center">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[50vh]">
          {activeTab === 'slides' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {slides.map(s => (
                  <div key={s.id} className="crystal-card p-10 relative space-y-6">
                    <button onClick={() => removeSlide(s.id)} className="absolute top-6 right-6 text-red-500/30 hover:text-red-500"><Trash2 size={16}/></button>
                    <div className="space-y-2">
                      <label className="admin-label">URL da Imagem de Fundo</label>
                      <input value={s.image} onChange={e => updateSlide(s.id, 'image', e.target.value)} placeholder="https://..." className="admin-input" />
                    </div>
                    <div className="space-y-2">
                      <label className="admin-label">Título Principal</label>
                      <input value={s.title} onChange={e => updateSlide(s.id, 'title', e.target.value)} placeholder="Título" className="admin-input font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="admin-label">Breve Descrição</label>
                      <textarea value={s.description} onChange={e => updateSlide(s.id, 'description', e.target.value)} placeholder="Descrição" className="admin-input text-xs" rows={2} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-sm border border-white/5">
                      <div className="space-y-3">
                        <label className="admin-label flex items-center gap-2 text-[#f8c8c4]/80"><MessageSquare size={10}/> Texto do Botão</label>
                        <input value={s.buttonText || ""} onChange={e => updateSlide(s.id, 'buttonText', e.target.value)} placeholder="Ex: Saiba Mais" className="admin-input !bg-white/5" />
                        <span className="text-[7px] text-white/20 uppercase font-bold">Vazio = padrão CONTACTO</span>
                      </div>
                      <div className="space-y-3">
                        <label className="admin-label flex items-center gap-2 text-[#f8c8c4]/80"><ExternalLink size={10}/> Link do Botão</label>
                        <input value={s.buttonLink || ""} onChange={e => updateSlide(s.id, 'buttonLink', e.target.value)} placeholder="Ex: contact" className="admin-input !bg-white/5" />
                        <span className="text-[7px] text-white/20 uppercase font-bold">Dicas: home, about, careers, contact</span>
                      </div>
                    </div>
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
                    <label className="admin-label">Foto da Página Sobre (Equipa/Essência)</label>
                    <input value={sectionImages.about} onChange={e => updateSectionImage('about', e.target.value)} placeholder="URL da foto" className="admin-input" />
                  </div>
                  <div className="space-y-2 group">
                    <label className="admin-label">Foto da Página Carreiras (Escritório/Fardas)</label>
                    <input value={sectionImages.careers} onChange={e => updateSectionImage('careers', e.target.value)} placeholder="URL da foto" className="admin-input" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-12 max-w-5xl mx-auto">
               <div className="crystal-card p-12 space-y-10 border-[#f8c8c4]/10">
                <div className="flex items-center gap-6 text-[#f8c8c4]/60"><Mail size={24}/><h3 className="text-xl font-bold tracking-widest uppercase text-white">Configurações de Contacto</h3></div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="admin-label flex items-center gap-2"><Mail size={12}/> E-mail de Recebimento</label>
                      <input type="email" value={emailConfig.recipientEmail} onChange={e => updateEmailConfig('recipientEmail', e.target.value)} className="admin-input" />
                    </div>
                    <div className="space-y-2">
                      <label className="admin-label flex items-center gap-2"><Phone size={12}/> Número de Telefone (Geral & WhatsApp)</label>
                      <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="admin-input" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="admin-label flex items-center gap-2"><MapPin size={12}/> Morada / Endereço Completo</label>
                    <input value={addressDetail} onChange={e => setAddressDetail(e.target.value)} placeholder="Rua, Número, Localidade, Algarve - Portugal" className="admin-input" />
                  </div>

                  {/* Configurações SMTP Técnicas */}
                  <div className="pt-10 border-t border-white/5 space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-[#f8c8c4]/60">
                        <Server size={20}/>
                        <h4 className="text-sm font-bold tracking-[0.2em] uppercase text-white">Infraestrutura de Envio (SMTP)</h4>
                      </div>
                      <button 
                        onClick={() => updateEmailConfig('useSmtp', !emailConfig.useSmtp)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-sm border transition-all ${emailConfig.useSmtp ? 'bg-[#f8c8c4]/10 border-[#f8c8c4] text-[#f8c8c4]' : 'bg-white/5 border-white/10 text-white/20'}`}
                      >
                        {emailConfig.useSmtp ? <ToggleRight size={20}/> : <ToggleLeft size={20}/>}
                        <span className="text-[9px] font-black uppercase tracking-widest">{emailConfig.useSmtp ? 'SMTP ATIVO' : 'ATIVAR SMTP'}</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {emailConfig.useSmtp && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/[0.01] p-8 rounded-sm border border-white/5">
                            <div className="md:col-span-2 space-y-2">
                              <label className="admin-label">Host SMTP</label>
                              <input value={emailConfig.smtpHost} onChange={e => updateEmailConfig('smtpHost', e.target.value)} placeholder="ex: smtp.gmail.com" className="admin-input" />
                            </div>
                            <div className="space-y-2">
                              <label className="admin-label">Porta</label>
                              <input value={emailConfig.smtpPort} onChange={e => updateEmailConfig('smtpPort', e.target.value)} placeholder="587 / 465" className="admin-input" />
                            </div>
                            <div className="space-y-2">
                              <label className="admin-label">Utilizador SMTP</label>
                              <input value={emailConfig.smtpUser} onChange={e => updateEmailConfig('smtpUser', e.target.value)} placeholder="email@dominio.com" className="admin-input" />
                            </div>
                            <div className="space-y-2">
                              <label className="admin-label">Palavra-passe SMTP</label>
                              <div className="relative">
                                <input 
                                  type={showSmtpPass ? "text" : "password"} 
                                  value={emailConfig.smtpPass} 
                                  onChange={e => updateEmailConfig('smtpPass', e.target.value)} 
                                  className="admin-input pr-12" 
                                />
                                <button onClick={() => setShowSmtpPass(!showSmtpPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                                  {showSmtpPass ? <EyeOff size={14}/> : <Eye size={14}/>}
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 pt-4">
                              <button 
                                onClick={() => updateEmailConfig('smtpSecure', !emailConfig.smtpSecure)}
                                className={`flex items-center gap-3 text-[9px] font-black tracking-widest uppercase transition-colors ${emailConfig.smtpSecure ? 'text-[#f8c8c4]' : 'text-white/20'}`}
                              >
                                <Shield size={16}/> {emailConfig.smtpSecure ? 'SSL/TLS Ativo' : 'Sem Segurança'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[#f8c8c4]/60">
                        <Instagram size={14}/>
                        <label className="admin-label">Instagram URL</label>
                      </div>
                      <input value={socialLinks.instagram} onChange={e => updateSocialLink('instagram', e.target.value)} placeholder="https://instagram.com/..." className="admin-input" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[#f8c8c4]/60">
                        <Linkedin size={14}/>
                        <label className="admin-label">LinkedIn URL</label>
                      </div>
                      <input value={socialLinks.linkedin} onChange={e => updateSocialLink('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." className="admin-input" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {notices.map(n => (
                <div key={n.id} className="crystal-card p-8 flex flex-col gap-4">
                  <label className="admin-label">Mensagem do Aviso</label>
                  <div className="flex items-center justify-between gap-8">
                    <input value={n.text} onChange={e => updateNotice(n.id, e.target.value)} className="admin-input flex-1" />
                    <div className="flex gap-4">
                      <button onClick={() => toggleNotice(n.id)} className={`p-4 border transition-all ${n.active ? 'border-[#f8c8c4] text-[#f8c8c4]' : 'border-white/5 text-white/10'}`}><Bell size={18}/></button>
                      <button onClick={() => removeNotice(n.id)} className="p-4 text-red-500/20 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addNotice} className="admin-btn-add"><Plus size={16}/> Novo Aviso</button>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-12">
               <div className="crystal-card p-8 border-[#f8c8c4]/20 border-dashed space-y-2">
                  <label className="admin-label">Link Completo de Avaliações Google Maps</label>
                  <input value={googleMapsLink} onChange={e => setGoogleMapsLink(e.target.value)} className="admin-input" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map(r => (
                  <div key={r.id} className="crystal-card p-10 relative space-y-8">
                    <button onClick={() => removeReview(r.id)} className="absolute top-6 right-6 text-red-500/30 hover:text-red-500"><Trash2 size={16}/></button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="admin-label">Nome do Cliente</label>
                        <input value={r.author} onChange={e => updateReview(r.id, 'author', e.target.value)} placeholder="Ex: Maria S." className="admin-input font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="admin-label">Data/Tempo do Comentário</label>
                        <input value={r.time} onChange={e => updateReview(r.id, 'time', e.target.value)} placeholder="Ex: 2 meses atrás" className="admin-input" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="admin-label">URL da Foto de Perfil (Avatar)</label>
                        <div className="flex gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                            {r.avatar ? <img src={r.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">Sem Foto</div>}
                          </div>
                          <input value={r.avatar || ""} onChange={e => updateReview(r.id, 'avatar', e.target.value)} placeholder="https://..." className="admin-input" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="admin-label flex items-center gap-2">Cor do Círculo (Fallback) <Palette size={10}/></label>
                        <div className="flex gap-3">
                          <div className="w-12 h-12 rounded-full flex-shrink-0 border border-white/10" style={{ backgroundColor: r.color || '#f8c8c4' }} />
                          <input value={r.color} onChange={e => updateReview(r.id, 'color', e.target.value)} placeholder="#HEX" className="admin-input font-mono" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="admin-label">Texto do Depoimento</label>
                      <textarea value={r.text} onChange={e => updateReview(r.id, 'text', e.target.value)} className="admin-input" rows={3} placeholder="Escreva aqui o comentário do cliente..." />
                    </div>

                    <div className="space-y-2">
                      <label className="admin-label">Iniciais (Para quando não há foto)</label>
                      <input value={r.initials} onChange={e => updateReview(r.id, 'initials', e.target.value)} maxLength={2} className="admin-input w-24 text-center font-bold" />
                    </div>
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
                    <div className="space-y-2">
                      <label className="admin-label">Nome do Parceiro/Empresa</label>
                      <input value={p.name} onChange={e => updatePartner(p.id, 'name', e.target.value)} placeholder="Nome" className="admin-input font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="admin-label">URL do Logótipo (Fundo Transparente)</label>
                      <input value={p.logo} onChange={e => updatePartner(p.id, 'logo', e.target.value)} placeholder="URL do Logo" className="admin-input" />
                    </div>
                    <div className="space-y-2">
                      <label className="admin-label">Link URL do Website</label>
                      <input value={p.url} onChange={e => updatePartner(p.id, 'url', e.target.value)} placeholder="https://..." className="admin-input" />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addPartner} className="admin-btn-add"><Plus size={16}/> Adicionar Novo Parceiro</button>
            </div>
          )}

          {activeTab === 'user' && (
            <div className="space-y-12 max-w-4xl mx-auto">
              <div className="crystal-card p-12 space-y-10 border-[#f8c8c4]/10">
                <div className="flex items-center gap-6 text-[#f8c8c4]/60 mb-4">
                  <ShieldCheck size={24}/>
                  <h3 className="text-xl font-bold tracking-widest uppercase text-white">Segurança & Acesso</h3>
                </div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="admin-label flex items-center gap-2"><User size={12}/> Utilizador Administrador</label>
                      <input 
                        value={adminUsername} 
                        onChange={e => setAdminUsername(e.target.value)} 
                        placeholder="Nome de utilizador" 
                        className="admin-input" 
                      />
                      <span className="text-[7px] text-white/20 uppercase font-bold">Identificador de acesso ao painel</span>
                    </div>
                    <div className="space-y-3">
                      <label className="admin-label flex items-center gap-2"><Lock size={12}/> Palavra-passe</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          value={adminPassword} 
                          onChange={e => setAdminPassword(e.target.value)} 
                          placeholder="Password segura" 
                          className="admin-input pr-12" 
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#f8c8c4] transition-colors"
                        >
                          {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      </div>
                      <span className="text-[7px] text-white/20 uppercase font-bold">Mantenha esta chave em segurança</span>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-6">
                    <div className="flex items-center gap-3 text-[#f8c8c4]/40">
                      <Zap size={14}/>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">Sincronização Database SIR</span>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-4">
                       <p className="text-[10px] font-light text-white/40 leading-relaxed italic">
                         As suas credenciais de acesso são sincronizadas automaticamente com a base de dados via Google Apps Script (SIR). Isto garante que as definições de acesso sejam consistentes em todos os dispositivos.
                       </p>
                       <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${cloudStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                         <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-white/20">Ligação SIR: {cloudStatus === 'connected' ? 'Ativa' : 'Offline'}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col items-center gap-8">
          <button 
            onClick={handleFinalize} 
            disabled={isSaving} 
            className="btn-serenity px-32 py-8 flex items-center justify-center gap-6 min-w-[400px] group overflow-hidden relative"
          >
            {isSaving ? (
              <div className="flex items-center gap-4">
                <Loader2 size={16} className="animate-spin text-white"/>
                <span className="text-white">A SINCRONIZAR COM A NUVEM...</span>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-[#f8c8c4]/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                <Check size={16} className="relative z-10" /> 
                <span className="relative z-10">GUARDAR & FINALIZAR</span>
              </>
            )}
          </button>
          
          <button onClick={onResetDefaults} className="text-[8px] font-bold tracking-[0.5em] text-red-400/20 hover:text-red-400 transition-all uppercase">
            Resetar cache local
          </button>
        </div>
      </div>

      <style>{`
        .admin-label {
          display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(248, 200, 196, 0.4); margin-bottom: 0.5rem;
        }
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
