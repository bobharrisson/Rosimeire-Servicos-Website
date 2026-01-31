
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Trash2, Plus, Save, Bell, X, Star, User, Link as LinkIcon, 
  Briefcase, CheckCircle, Image as ImageIcon, RotateCcw, Cloud, Mail, 
  Key, Server, Eye, EyeOff, ShieldCheck, Zap, AlertCircle, Loader2, 
  Info, Lightbulb, Check, Database, Download, Upload, FileJson, ExternalLink, Link, RefreshCw, CloudOff,
  Instagram, Linkedin, Palette, MessageSquare, Lock, Phone, MapPin, ToggleLeft, ToggleRight, Shield,
  Layout, Facebook, Youtube, Music, Wand2, Sparkles, Clock, Calendar, Send, Globe, PlayCircle, Edit3, Power, PowerOff,
  Building2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  buttonLink?: string;
  buttonText?: string;
}

interface MagicEvent {
  id: string;
  name: string;
  code: string;
  prompt: string;
  startDate: string;
  endDate: string;
}

interface MagicEffectManager {
  activeId: string | null;
  items: MagicEvent[];
}

interface SiteConfig {
  logoUrl: string;
  companyName: string;
  companySubtitle: string;
  footerNote: string;
  footerCopyright: string;
  developedBy: string;
  magicEffect: MagicEffectManager;
}

interface SectionImages {
  about: string;
  careers: string;
}

interface SocialLinks {
  instagram: string;
  linkedin: string;
  facebook: string;
  youtube: string;
  tiktok: string;
}

interface EmailConfig {
  recipientEmail: string;
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
  siteConfig: SiteConfig;
  setSiteConfig: (config: SiteConfig) => void;
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
  activeTab: 'slides' | 'notices' | 'reviews' | 'partners' | 'images' | 'email' | 'user' | 'site';
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
  isOpen, onClose, onLogout, siteConfig, setSiteConfig, slides, setSlides, sectionImages, setSectionImages, socialLinks, setSocialLinks, emailConfig, setEmailConfig, notices, setNotices, reviews, setReviews, 
  partners, setPartners, googleMapsLink, setGoogleMapsLink, contactPhone, setContactPhone, addressDetail, setAddressDetail, adminUsername, setAdminUsername, adminPassword, setAdminPassword, activeTab, setActiveTab, t, isSyncing, onResetDefaults, gasUrl, setGasUrl, onPublishToCloud, cloudStatus
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  
  const [magicForm, setMagicForm] = useState<MagicEvent>({
    id: '',
    name: '',
    code: '',
    prompt: '',
    startDate: '',
    endDate: ''
  });

  if (!isOpen) return null;

  const updateSiteConfig = (field: keyof SiteConfig, value: any) => setSiteConfig({ ...siteConfig, [field]: value });
  const updateSectionImage = (key: keyof SectionImages, value: string) => setSectionImages({ ...sectionImages, [key]: value });
  const updateSocialLink = (key: keyof SocialLinks, value: string) => setSocialLinks({ ...socialLinks, [key]: value });
  const updateEmailConfig = (key: keyof EmailConfig, value: any) => setEmailConfig({ ...emailConfig, [key]: value });
  const updateSlide = (id: string, field: keyof Slide, value: string) => setSlides(slides.map(s => s.id === id ? { ...s, [field]: value } : s));
  const removeSlide = (id: string) => slides.length > 1 && setSlides(slides.filter(s => s.id !== id));
  const addSlide = () => {
    const newSlide: Slide = { id: Date.now().toString(), title: "Novo Slide", description: "Descrição...", image: slides[0]?.image || "", tag: "NOVO", buttonLink: "contact", buttonText: "SABER MAIS" };
    setSlides([...slides, newSlide]);
  };
  const addNotice = () => setNotices([...notices, { id: Date.now().toString(), text: "Novo aviso...", active: true }]);
  const removeNotice = (id: string) => setNotices(notices.filter(n => n.id !== id));
  const updateNotice = (id: string, text: string) => setNotices(notices.map(n => n.id === id ? { ...n, text } : n));
  const toggleNotice = (id: string) => setNotices(notices.map(n => n.id === id ? { ...n, active: !n.active } : n));
  
  const addReview = () => setReviews([...reviews, { id: Date.now().toString(), author: "Novo Autor", text: "Conteúdo...", time: "agora mesmo", initials: "NA", color: "#f8c8c4", avatar: "" }]);
  const removeReview = (id: string) => setReviews(reviews.filter(r => r.id !== id));
  const updateReview = (id: string, field: keyof Review, value: string) => setReviews(reviews.map(r => r.id === id ? { ...r, [field]: value } : r));
  
  const addPartner = () => setPartners([...partners, { id: Date.now().toString(), name: "Novo Parceiro", logo: "", url: "https://" }]);
  const removePartner = (id: string) => setPartners(partners.filter(p => p.id !== id));
  const updatePartner = (id: string, field: keyof Partner, value: string) => setPartners(partners.map(p => p.id === id ? { ...p, [field]: value } : p));

  const manager = siteConfig.magicEffect || { activeId: null, items: [] };

  const handleGenerateMagic = async () => {
    if (!magicForm.prompt.trim()) { alert("Descreva o efeito visual primeiro."); return; }
    if (!magicForm.name.trim()) { alert("Dê um nome ao evento."); return; }
    if (!magicForm.startDate || !magicForm.endDate) { alert("Defina as datas de início e fim."); return; }
    
    setIsMagicLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Você é um designer web de luxo especializado em efeitos atmosféricos. Gere APENAS código CSS para um efeito visual imersivo e elegante baseado na descrição: "${magicForm.prompt}". Cores sugeridas: #081221, #f8c8c4, dourado suave. Alvo: .magic-event-layer. Não use markdown.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
      const cleanedCode = (response.text || "").replace(/```css/g, '').replace(/```/g, '').trim();
      
      const newEvent: MagicEvent = {
        ...magicForm,
        id: magicForm.id || Date.now().toString(),
        code: cleanedCode
      };

      let newItems = [...manager.items];
      const existingIdx = newItems.findIndex(i => i.id === newEvent.id);
      if (existingIdx >= 0) newItems[existingIdx] = newEvent;
      else newItems.push(newEvent);

      updateSiteConfig('magicEffect', { ...manager, items: newItems });
      setMagicForm({ id: '', name: '', code: '', prompt: '', startDate: '', endDate: '' });
      alert("Evento gerado e guardado na biblioteca!");
    } catch (err) { alert("Erro ao conectar com a IA."); } finally { setIsMagicLoading(false); }
  };

  const handleTestMagic = (item: MagicEvent) => {
    const styleId = 'dynamic-magic-effect-style';
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = item.code;
    alert(`A testar: ${item.name}. O efeito foi aplicado localmente.`);
  };

  const handleRemoveMagic = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este evento da biblioteca?")) {
      const newItems = manager.items.filter(i => i.id !== id);
      const newActiveId = manager.activeId === id ? null : manager.activeId;
      updateSiteConfig('magicEffect', { items: newItems, activeId: newActiveId });
    }
  };

  const handleActivateMagic = (id: string) => {
    updateSiteConfig('magicEffect', { ...manager, activeId: manager.activeId === id ? null : id });
  };

  const handleEditMagic = (item: MagicEvent) => {
    setMagicForm(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalize = async () => { setIsSaving(true); await onPublishToCloud(); setIsSaving(false); onClose(); };

  const getEventStatus = (item: MagicEvent) => {
    const now = new Date();
    const start = new Date(item.startDate + "T00:00:00");
    const end = new Date(item.endDate + "T23:59:59");
    if (now < start) return "AGENDADO";
    if (now > end) return "EXPIRADO";
    return "DISPONÍVEL";
  };

  return (
    <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-[1000] bg-[#081221] text-white overflow-y-auto">
      <div className="container mx-auto px-8 md:px-32 py-24 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
          <h2 className="heading-serif text-4xl md:text-7xl uppercase tracking-tighter">Painel de Controlo</h2>
          <div className="flex gap-6 items-center">
            <button onClick={onLogout} className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors">Sair</button>
            <button onClick={onClose} className="text-white/20 hover:text-white transition-colors ml-4"><X size={32}/></button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-16">
          {[
            { id: 'site', icon: <Layout size={14}/>, label: 'Geral' },
            { id: 'slides', icon: <ImageIcon size={14}/>, label: 'Slides' },
            { id: 'images', icon: <Palette size={14}/>, label: 'Visual' },
            { id: 'email', icon: <Mail size={14}/>, label: 'E-mail / Redes' },
            { id: 'notices', icon: <Bell size={14}/>, label: 'Avisos' },
            { id: 'reviews', icon: <Star size={14}/>, label: 'Legado' },
            { id: 'partners', icon: <Briefcase size={14}/>, label: 'Parceiros' },
            { id: 'user', icon: <User size={14}/>, label: 'Conta' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`p-6 text-[10px] font-bold tracking-[0.3em] uppercase transition-all flex flex-col items-center justify-center gap-4 rounded-sm border ${activeTab === tab.id ? 'text-[#f8c8c4] border-[#f8c8c4] bg-[#f8c8c4]/5 shadow-[0_0_20px_rgba(248,200,196,0.1)]' : 'text-white/20 border-white/5 bg-white/[0.01] hover:text-white/40'}`}>
              {tab.icon}
              <span className="text-center">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[50vh]">
          {activeTab === 'site' && (
            <div className="space-y-12 max-w-6xl mx-auto">
              <div className="crystal-card p-12 space-y-10 border-[#f8c8c4]/30 bg-gradient-to-br from-[#f8c8c4]/5 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 text-[#f8c8c4]/10"><Wand2 size={120} strokeWidth={0.5} /></div>
                <div className="flex items-center gap-6 text-[#f8c8c4]"><Sparkles size={24}/><h3 className="text-xl font-bold tracking-widest uppercase text-white">Criador de Magia (Biblioteca)</h3></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                   <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                         <div>
                            <label className="admin-label">Nome do Evento</label>
                            <input value={magicForm.name} onChange={e => setMagicForm({...magicForm, name: e.target.value})} placeholder="Ex: Evento de Natal 2025" className="admin-input !bg-white/5" />
                         </div>
                         <div>
                            <label className="admin-label">Descreva o efeito desejado</label>
                            <textarea value={magicForm.prompt} onChange={e => setMagicForm({...magicForm, prompt: e.target.value})} placeholder="Ex: Estrelas douradas cintilantes caindo suavemente no fundo..." className="admin-input !bg-white/5 min-h-[120px]" />
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="admin-label flex items-center gap-2"><Calendar size={10}/> Data de Início</label>
                            <input type="date" value={magicForm.startDate} onChange={e => setMagicForm({...magicForm, startDate: e.target.value})} className="admin-input !py-4 !bg-white/10" />
                         </div>
                         <div>
                            <label className="admin-label flex items-center gap-2"><Calendar size={10}/> Data de Fim</label>
                            <input type="date" value={magicForm.endDate} onChange={e => setMagicForm({...magicForm, endDate: e.target.value})} className="admin-input !py-4 !bg-white/10" />
                         </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button onClick={handleGenerateMagic} disabled={isMagicLoading || !magicForm.prompt} className="btn-serenity !py-6 flex items-center gap-4 flex-1 justify-center text-[10px] font-black tracking-[0.4em]">
                          {isMagicLoading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />} 
                          {magicForm.id ? "ATUALIZAR EVENTO" : "GERAR & GUARDAR NA BIBLIOTECA"}
                        </button>
                        {magicForm.id && (
                          <button onClick={() => setMagicForm({id:'', name:'', prompt:'', code:'', startDate:'', endDate:''})} className="p-4 border border-white/10 text-white/30 hover:text-white transition-colors"><RotateCcw size={20}/></button>
                        )}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <label className="admin-label flex items-center gap-2"><Briefcase size={10}/> Biblioteca de Eventos</label>
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin">
                        {manager.items.length > 0 ? manager.items.map(item => {
                          const status = getEventStatus(item);
                          const isActive = manager.activeId === item.id;
                          return (
                            <div key={item.id} className={`p-6 rounded-sm border transition-all flex flex-col gap-4 ${isActive ? 'bg-[#f8c8c4]/10 border-[#f8c8c4] shadow-[0_0_20px_rgba(248,200,196,0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                               <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                    <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                      {item.name}
                                      {isActive && <span className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">LIVE</span>}
                                    </h4>
                                    <div className="flex items-center gap-4 text-[9px] text-white/30 font-medium">
                                      <span>{new Date(item.startDate).toLocaleDateString()} a {new Date(item.endDate).toLocaleDateString()}</span>
                                      <span className={`font-black ${status === 'EXPIRADO' ? 'text-red-400' : 'text-[#f8c8c4]/40'}`}>• {status}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                     <button onClick={() => handleEditMagic(item)} title="Editar" className="p-2 text-white/20 hover:text-white transition-colors"><Edit3 size={14}/></button>
                                     <button onClick={() => handleRemoveMagic(item.id)} title="Remover" className="p-2 text-white/20 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                                  </div>
                               </div>
                               
                               <div className="grid grid-cols-3 gap-3">
                                  <button onClick={() => handleTestMagic(item)} className="p-2 bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <PlayCircle size={10}/> Testar
                                  </button>
                                  <button onClick={() => handleActivateMagic(item.id)} className={`p-2 border text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isActive ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-[#f8c8c4]/10 border-[#f8c8c4]/20 text-[#f8c8c4] hover:bg-[#f8c8c4]/20'}`}>
                                    {isActive ? <PowerOff size={10}/> : <Power size={10}/>} {isActive ? "Desativar" : "Ativar"}
                                  </button>
                                  <div className="text-[8px] flex items-center justify-center text-white/10 uppercase font-black tracking-tighter">SIR v2.6</div>
                               </div>
                            </div>
                          );
                        }) : (
                          <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-dashed border-white/10 opacity-20 gap-4">
                            <CloudOff size={32} />
                            <p className="text-[9px] font-bold uppercase tracking-widest">Biblioteca vazia</p>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              </div>

              <div className="crystal-card p-12 space-y-10 border-white/5">
                <div className="flex items-center gap-6 text-white/40"><Globe size={24}/><h3 className="text-xl font-bold tracking-widest uppercase text-white">Configurações Gerais</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-6">
                        <label className="admin-label">Identidade Visual</label>
                        <div className="space-y-6">
                           <div>
                              <label className="text-[8px] font-bold uppercase text-white/20 mb-2 block tracking-widest">URL da Logomarca (PNG/SVG)</label>
                              <input value={siteConfig.logoUrl || ""} onChange={e => updateSiteConfig('logoUrl', e.target.value)} placeholder="https://..." className="admin-input" />
                           </div>
                           <div>
                              <label className="text-[8px] font-bold uppercase text-white/20 mb-2 block tracking-widest">Nome Principal</label>
                              <input value={siteConfig.companyName || ""} onChange={e => updateSiteConfig('companyName', e.target.value)} className="admin-input font-bold" />
                           </div>
                           <div>
                              <label className="text-[8px] font-bold uppercase text-white/20 mb-2 block tracking-widest">Slogan / Subtítulo</label>
                              <input value={siteConfig.companySubtitle || ""} onChange={e => updateSiteConfig('companySubtitle', e.target.value)} className="admin-input" />
                           </div>
                        </div>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-6">
                        <label className="admin-label">Rodapé & Copyright</label>
                        <div className="space-y-6">
                           <div>
                              <label className="text-[8px] font-bold uppercase text-white/20 mb-2 block tracking-widest">Nota do Rodapé</label>
                              <textarea value={siteConfig.footerNote || ""} onChange={e => updateSiteConfig('footerNote', e.target.value)} className="admin-input" rows={2} />
                           </div>
                           <div>
                              <label className="text-[8px] font-bold uppercase text-white/20 mb-2 block tracking-widest">Texto de Direitos Autorais</label>
                              <input value={siteConfig.footerCopyright || ""} onChange={e => updateSiteConfig('footerCopyright', e.target.value)} className="admin-input" />
                           </div>
                           <div>
                              <label className="text-[8px] font-bold uppercase text-white/20 mb-2 block tracking-widest">Desenvolvido Por</label>
                              <input value={siteConfig.developedBy || ""} onChange={e => updateSiteConfig('developedBy', e.target.value)} className="admin-input" />
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'slides' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {slides.map(s => (
                  <div key={s.id} className="crystal-card p-10 relative space-y-6 border-white/5 hover:border-[#f8c8c4]/20 transition-all">
                    <button onClick={() => removeSlide(s.id)} className="absolute top-6 right-6 text-red-500/30 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    <div className="flex flex-col gap-6">
                       <div>
                          <label className="admin-label">URL da Imagem de Fundo</label>
                          <input value={s.image} onChange={e => updateSlide(s.id, 'image', e.target.value)} className="admin-input" />
                       </div>
                       <div>
                          <label className="admin-label">Tag Superior</label>
                          <input value={s.tag} onChange={e => updateSlide(s.id, 'tag', e.target.value)} className="admin-input !text-[#f8c8c4]" />
                       </div>
                       <div>
                          <label className="admin-label">Título do Slide</label>
                          <input value={s.title} onChange={e => updateSlide(s.id, 'title', e.target.value)} className="admin-input font-bold" />
                       </div>
                       <div>
                          <label className="admin-label">Descrição Breve</label>
                          <textarea value={s.description} onChange={e => updateSlide(s.id, 'description', e.target.value)} className="admin-input text-xs" rows={2} />
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="admin-label">Texto Botão</label>
                            <input value={s.buttonText || ""} onChange={e => updateSlide(s.id, 'buttonText', e.target.value)} className="admin-input !bg-white/5" />
                          </div>
                          <div>
                            <label className="admin-label">Link/Âncora</label>
                            <input value={s.buttonLink || ""} onChange={e => updateSlide(s.id, 'buttonLink', e.target.value)} className="admin-input !bg-white/5" />
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addSlide} className="admin-btn-add"><Plus size={16}/> Adicionar Novo Slide de Destaque</button>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-12 max-w-5xl mx-auto">
               <div className="crystal-card p-12 border-white/5 space-y-12">
                 <div className="flex items-center gap-6 text-white/40"><Palette size={24}/><h3 className="text-xl font-bold tracking-widest uppercase text-white">Curadoria de Imagens</h3></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <label className="admin-label">Imagem da Secção "Sobre"</label>
                       <div className="relative aspect-video rounded-sm overflow-hidden bg-white/5 border border-white/5 mb-4 group">
                          {sectionImages.about && <img src={sectionImages.about} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[8px] font-black tracking-[0.4em] uppercase opacity-20 group-hover:opacity-100 transition-opacity">Preview</div>
                       </div>
                       <input value={sectionImages.about} onChange={e => updateSectionImage('about', e.target.value)} placeholder="URL da Imagem..." className="admin-input" />
                    </div>
                    <div className="space-y-6">
                       <label className="admin-label">Imagem da Secção "Carreiras"</label>
                       <div className="relative aspect-video rounded-sm overflow-hidden bg-white/5 border border-white/5 mb-4 group">
                          {sectionImages.careers && <img src={sectionImages.careers} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[8px] font-black tracking-[0.4em] uppercase opacity-20 group-hover:opacity-100 transition-opacity">Preview</div>
                       </div>
                       <input value={sectionImages.careers} onChange={e => updateSectionImage('careers', e.target.value)} placeholder="URL da Imagem..." className="admin-input" />
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-12 max-w-5xl mx-auto">
               <div className="crystal-card p-12 space-y-10 border-[#f8c8c4]/30 bg-gradient-to-br from-[#f8c8c4]/5 to-transparent">
                <div className="flex items-center gap-6 text-[#f8c8c4]"><Mail size={24}/><h3 className="text-xl font-bold tracking-widest uppercase text-white">Contactos & Redes Sociais</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <label className="admin-label flex items-center gap-2"><Mail size={12}/> E-mail de Receção</label>
                      <input type="email" value={emailConfig.recipientEmail} onChange={e => updateEmailConfig('recipientEmail', e.target.value)} className="admin-input !bg-white/10" />
                      <label className="admin-label flex items-center gap-2 mt-8"><Phone size={12}/> Telemóvel Geral</label>
                      <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="admin-input" />
                      <label className="admin-label flex items-center gap-2 mt-8"><MapPin size={12}/> Morada Completa</label>
                      <textarea value={addressDetail} onChange={e => setAddressDetail(e.target.value)} className="admin-input" rows={2} />
                   </div>
                   <div className="space-y-6">
                      <label className="admin-label flex items-center gap-2"><Globe size={12}/> Canais Sociais</label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-sm border border-white/5">
                           <Instagram size={16} className="text-[#f8c8c4]/40" />
                           <input value={socialLinks.instagram} onChange={e => updateSocialLink('instagram', e.target.value)} placeholder="Link Instagram" className="bg-transparent border-none outline-none text-xs flex-1 text-white" />
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-sm border border-white/5">
                           <Facebook size={16} className="text-[#f8c8c4]/40" />
                           <input value={socialLinks.facebook} onChange={e => updateSocialLink('facebook', e.target.value)} placeholder="Link Facebook" className="bg-transparent border-none outline-none text-xs flex-1 text-white" />
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-sm border border-white/5">
                           <Youtube size={16} className="text-[#f8c8c4]/40" />
                           <input value={socialLinks.youtube} onChange={e => updateSocialLink('youtube', e.target.value)} placeholder="Link YouTube" className="bg-transparent border-none outline-none text-xs flex-1 text-white" />
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-sm border border-white/5">
                           <Music size={16} className="text-[#f8c8c4]/40" />
                           <input value={socialLinks.tiktok} onChange={e => updateSocialLink('tiktok', e.target.value)} placeholder="Link Tik Tok" className="bg-transparent border-none outline-none text-xs flex-1 text-white" />
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-sm border border-white/5">
                           <Linkedin size={16} className="text-[#f8c8c4]/40" />
                           <input value={socialLinks.linkedin} onChange={e => updateSocialLink('linkedin', e.target.value)} placeholder="Link LinkedIn" className="bg-transparent border-none outline-none text-xs flex-1 text-white" />
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {notices.map(n => (
                <div key={n.id} className="crystal-card p-8 flex items-center justify-between gap-8 border-white/5">
                  <div className="flex-1 space-y-2">
                    <label className="admin-label">Texto do Aviso</label>
                    <input value={n.text} onChange={e => updateNotice(n.id, e.target.value)} className="admin-input" />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button onClick={() => toggleNotice(n.id)} className={`p-4 border transition-all ${n.active ? 'border-[#f8c8c4] text-[#f8c8c4] bg-[#f8c8c4]/10' : 'border-white/5 text-white/10 hover:text-white/30'}`}><Bell size={18}/></button>
                    <button onClick={() => removeNotice(n.id)} className="p-4 text-red-500/20 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
              <button onClick={addNotice} className="admin-btn-add"><Plus size={16}/> Adicionar Novo Aviso</button>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-12">
               <div className="crystal-card p-12 border-white/5 space-y-6">
                 <label className="admin-label flex items-center gap-2"><LinkIcon size={12}/> Link Principal Google Maps (Reviews)</label>
                 <input value={googleMapsLink} onChange={e => setGoogleMapsLink(e.target.value)} placeholder="https://www.google.com/search?q=..." className="admin-input" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map(r => (
                  <div key={r.id} className="crystal-card p-10 relative space-y-6 border-white/5">
                    <button onClick={() => removeReview(r.id)} className="absolute top-6 right-6 text-red-500/30 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    <div className="space-y-4">
                       <div>
                          <label className="admin-label">Nome do Cliente / Autor</label>
                          <input value={r.author} onChange={e => updateReview(r.id, 'author', e.target.value)} className="admin-input font-bold" />
                       </div>
                       <div>
                          <label className="admin-label">Período da Avaliação (Ex: 12 meses atrás)</label>
                          <input value={r.time} onChange={e => updateReview(r.id, 'time', e.target.value)} className="admin-input text-xs" />
                       </div>
                       <div>
                          <label className="admin-label">URL da Foto de Perfil (Opcional)</label>
                          <input value={r.avatar || ""} onChange={e => updateReview(r.id, 'avatar', e.target.value)} placeholder="https://..." className="admin-input text-[10px]" />
                       </div>
                       <div>
                          <label className="admin-label">Depoimento</label>
                          <textarea value={r.text} onChange={e => updateReview(r.id, 'text', e.target.value)} className="admin-input" rows={4} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="admin-label">Iniciais (Avatar Backup)</label>
                             <input value={r.initials} onChange={e => updateReview(r.id, 'initials', e.target.value)} className="admin-input text-center uppercase" maxLength={2} />
                          </div>
                          <div>
                             <label className="admin-label">Cor do Círculo</label>
                             <input type="color" value={r.color} onChange={e => updateReview(r.id, 'color', e.target.value)} className="h-12 w-full bg-transparent border-none cursor-pointer" />
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
               </div>
               <button onClick={addReview} className="admin-btn-add"><Plus size={16}/> Adicionar Novo Depoimento de Cliente</button>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {partners.map(p => (
                  <div key={p.id} className="crystal-card p-8 relative space-y-6 border-white/5">
                    <button onClick={() => removePartner(p.id)} className="absolute top-4 right-4 text-red-500/30 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                    
                    <div className="space-y-6 pt-4">
                      <div>
                        <label className="admin-label flex items-center gap-2">
                          <Building2 size={12} className="text-[#f8c8c4]/40" /> Nome do Parceiro
                        </label>
                        <input value={p.name} onChange={e => updatePartner(p.id, 'name', e.target.value)} placeholder="Ex: Algarve Living" className="admin-input" />
                      </div>

                      <div>
                        <label className="admin-label flex items-center gap-2">
                          <ImageIcon size={12} className="text-[#f8c8c4]/40" /> URL da Logomarca
                        </label>
                        <input value={p.logo} onChange={e => updatePartner(p.id, 'logo', e.target.value)} placeholder="https://..." className="admin-input text-[10px]" />
                      </div>

                      <div>
                        <label className="admin-label flex items-center gap-2">
                          <LinkIcon size={12} className="text-[#f8c8c4]/40" /> Link do Website
                        </label>
                        <input value={p.url} onChange={e => updatePartner(p.id, 'url', e.target.value)} placeholder="https://..." className="admin-input text-[10px]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addPartner} className="admin-btn-add"><Plus size={16}/> Adicionar Parceiro de Prestígio</button>
            </div>
          )}

          {activeTab === 'user' && (
            <div className="max-w-xl mx-auto space-y-12">
               <div className="crystal-card p-12 border-white/5 space-y-10">
                  <div className="flex items-center gap-6 text-[#f8c8c4]"><ShieldCheck size={24}/><h3 className="text-xl font-bold tracking-widest uppercase text-white">Credenciais de Acesso</h3></div>
                  <div className="space-y-8">
                    <div>
                      <label className="admin-label flex items-center gap-2"><User size={12}/> Utilizador Administrativo</label>
                      <input value={adminUsername} onChange={e => setAdminUsername(e.target.value)} placeholder="Utilizador" className="admin-input !text-lg" />
                    </div>
                    <div>
                      <label className="admin-label flex items-center gap-2"><Lock size={12}/> Senha de Acesso</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="admin-input !text-lg" />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 mb-8">
             <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full animate-pulse ${cloudStatus === 'connected' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : (cloudStatus === 'loading' ? 'bg-yellow-500' : 'bg-red-500')}`} />
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40">
                  {cloudStatus === 'connected' ? 'Sincronizado com Google Sheets' : (cloudStatus === 'loading' ? 'A Sincronizar...' : 'Erro de Ligação')}
                </span>
             </div>
          </div>

          <button onClick={handleFinalize} disabled={isSaving} className="btn-serenity px-32 py-10 flex items-center justify-center gap-6 min-w-[400px] text-sm !font-black group hover:scale-[1.02] active:scale-[0.98]">
            {isSaving ? <Loader2 size={20} className="animate-spin text-[#081221]"/> : <Save size={20} className="group-hover:rotate-12 transition-transform" />}
            <span>PUBLICAR ALTERAÇÕES NO SITE</span>
          </button>
          
          <button onClick={onResetDefaults} className="text-[9px] font-bold text-red-400/20 hover:text-red-400 uppercase tracking-[0.4em] transition-all">Limpar Cache Local & Recarregar</button>
          
          <div className="mt-12 opacity-10 flex flex-col items-center gap-2">
             <Database size={24} />
             <span className="text-[8px] font-black uppercase tracking-[0.8em]">SIR Backend System v2.6</span>
          </div>
        </div>
      </div>

      <style>{`
        .admin-label { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(248, 200, 196, 0.4); margin-bottom: 0.5rem; }
        .admin-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 1.25rem; color: white; font-size: 0.85rem; border-radius: 2px; outline: none; transition: all 0.5s ease; }
        .admin-input:focus { border-color: #f8c8c4; background: rgba(255,255,255,0.08); box-shadow: 0 0 30px rgba(248,200,196,0.05); }
        .admin-btn-add { width: 100%; padding: 2.5rem; border: 1px dashed rgba(255,255,255,0.1); color: rgba(255,255,255,0.2); text-transform: uppercase; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.4em; display: flex; align-items: center; justify-content: center; gap: 1rem; transition: all 0.5s ease; border-radius: 4px; }
        .admin-btn-add:hover { color: #f8c8c4; border-color: #f8c8c4; background: rgba(248, 200, 196, 0.03); transform: translateY(-5px); }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(248,200,196,0.1); border-radius: 10px; }
      `}</style>
    </motion.div>
  );
};

export default AdminPanel;
