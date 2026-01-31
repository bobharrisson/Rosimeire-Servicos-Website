import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Trash2, Plus, Save, Bell, X, Star, User, Link as LinkIcon, 
  Briefcase, CheckCircle, Image as ImageIcon, RotateCcw, Cloud, Mail, 
  Key, Server, Eye, EyeOff, ShieldCheck, Zap, AlertCircle, Loader2, 
  Info, Lightbulb, Check, Database, Download, Upload, FileJson, ExternalLink, Link, RefreshCw, CloudOff,
  Instagram, Linkedin, Palette, MessageSquare, Lock, Phone, MapPin, ToggleLeft, ToggleRight, Shield,
  Layout, Facebook, Youtube, Music, Wand2, Sparkles, Clock, Calendar, Send
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

interface MagicEffect {
  active: boolean;
  code: string;
  prompt: string;
  expiryDate: string;
  durationDays: number;
}

interface SiteConfig {
  logoUrl: string;
  companyName: string;
  companySubtitle: string;
  footerNote: string;
  footerCopyright: string;
  developedBy: string;
  magicEffect: MagicEffect;
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

  if (!isOpen) return null;

  const addSlide = () => {
    const newSlide: Slide = { id: Date.now().toString(), title: "Novo Slide", description: "Descrição...", image: slides[0]?.image || "", tag: "NOVO", buttonLink: "contact", buttonText: "SABER MAIS" };
    setSlides([...slides, newSlide]);
  };
  const removeSlide = (id: string) => slides.length > 1 && setSlides(slides.filter(s => s.id !== id));
  const updateSlide = (id: string, field: keyof Slide, value: string) => setSlides(slides.map(s => s.id === id ? { ...s, [field]: value } : s));
  const updateSiteConfig = (field: keyof SiteConfig, value: any) => setSiteConfig({ ...siteConfig, [field]: value });
  const updateSectionImage = (key: keyof SectionImages, value: string) => setSectionImages({ ...sectionImages, [key]: value });
  const updateSocialLink = (key: keyof SocialLinks, value: string) => setSocialLinks({ ...socialLinks, [key]: value });
  const updateEmailConfig = (key: keyof EmailConfig, value: any) => setEmailConfig({ ...emailConfig, [key]: value });
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
  const updateMagicEffect = (field: keyof MagicEffect, value: any) => { setSiteConfig({ ...siteConfig, magicEffect: { ...(siteConfig.magicEffect || { active: false, code: "", prompt: "", expiryDate: "", durationDays: 7 }), [field]: value } }); };

  const handleGenerateMagic = async () => {
    const magic = siteConfig.magicEffect || { active: false, code: "", prompt: "", expiryDate: "", durationDays: 7 };
    if (!magic.prompt.trim()) return;
    setIsMagicLoading(true);
    try {
      // Initialize GoogleGenAI with the API key from environment variables before the request
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Você é um designer web de luxo especializado em efeitos atmosféricos. Gere APENAS código CSS para um efeito visual imersivo e elegante baseado na descrição: "${magic.prompt}". Cores: #081221, #f8c8c4, dourado suave. Alvo: .magic-event-layer.`;
      // Use gemini-3-pro-preview for complex coding and reasoning tasks
      const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
      const cleanedCode = (response.text || "").replace(/```css/g, '').replace(/```/g, '').trim();
      const expiry = new Date(); expiry.setDate(expiry.getDate() + magic.durationDays);
      updateSiteConfig('magicEffect', { ...magic, code: cleanedCode, active: true, expiryDate: expiry.toISOString() });
    } catch (err) { alert("Erro ao conectar com a IA."); } finally { setIsMagicLoading(false); }
  };

  const handleDeactivateMagic = () => { updateMagicEffect('active', false); updateMagicEffect('code', ''); };
  const handleFinalize = async () => { setIsSaving(true); await onPublishToCloud(); setIsSaving(false); onClose(); };

  const magicEffect = siteConfig.magicEffect || { active: false, code: "", prompt: "", expiryDate: "", durationDays: 7 };

  return (
    <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-[1000] bg-[#081221] text-white overflow-y-auto">
      <div className="container mx-auto px-8 md:px-32 py-24 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
          <h2 className="heading-serif text-4xl md:text-7xl">Painel de Controlo</h2>
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
            { id: 'email', icon: <Mail size={14}/>, label: 'Contacto' },
            { id: 'notices', icon: <Bell size={14}/>, label: 'Avisos' },
            { id: 'reviews', icon: <Star size={14}/>, label: 'Legado' },
            { id: 'partners', icon: <Briefcase size={14}/>, label: 'Parceiros' },
            { id: 'user', icon: <User size={14}/>, label: 'Conta' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`p-6 text-[10px] font-bold tracking-[0.3em] uppercase transition-all flex flex-col items-center justify-center gap-4 rounded-sm border ${activeTab === tab.id ? 'text-[#f8c8c4] border-[#f8c8c4] bg-[#f8c8c4]/5' : 'text-white/20 border-white/5 bg-white/[0.01] hover:text-white/40'}`}>
              {tab.icon}
              <span className="text-center">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[50vh]">
          {activeTab === 'site' && (
            <div className="space-y-12 max-w-5xl mx-auto">
              <div className="crystal-card p-12 space-y-10 border-[#f8c8c4]/30 bg-gradient-to-br from-[#f8c8c4]/5 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 text-[#f8c8c4]/10"><Wand2 size={120} strokeWidth={0.5} /></div>
                <div className="flex items-center gap-6 text-[#f8c8c4]"><Sparkles size={24}/><h3 className="text-xl font-bold tracking-widest uppercase text-white">Eventos Mágicos</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                   <div className="space-y-6">
                      <label className="admin-label">Descreva o efeito visual desejado</label>
                      <textarea value={magicEffect.prompt} onChange={e => updateMagicEffect('prompt', e.target.value)} placeholder="Ex: Neve rosa caindo..." className="admin-input !bg-white/5 min-h-[120px]" />
                      <button onClick={handleGenerateMagic} disabled={isMagicLoading || !magicEffect.prompt} className="btn-serenity !py-4 flex items-center gap-4 w-full justify-center">
                        {isMagicLoading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />} ATIVAR MAGIA
                      </button>
                   </div>
                   <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-sm">
                      {magicEffect.active ? (
                        <div className="space-y-6">
                           <div className="flex items-center gap-4 text-white/40"><Calendar size={14}/><span className="text-[10px] font-bold uppercase">Expira em: {magicEffect.expiryDate ? new Date(magicEffect.expiryDate).toLocaleDateString() : 'N/A'}</span></div>
                           <button onClick={handleDeactivateMagic} className="w-full py-4 border border-red-500/20 text-red-400 text-[9px] font-bold tracking-[0.4em] uppercase hover:bg-red-500/10">DESATIVAR EVENTO</button>
                        </div>
                      ) : <p className="text-[10px] text-center opacity-20 py-10 uppercase">Nenhum evento ativo</p>}
                   </div>
                </div>
              </div>
              <div className="crystal-card p-12 space-y-10 border-[#f8c8c4]/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-sm">
                        <label className="admin-label">Identidade de Marca</label>
                        <div className="space-y-6">
                           <input value={siteConfig.logoUrl || ""} onChange={e => updateSiteConfig('logoUrl', e.target.value)} placeholder="URL Logomarca" className="admin-input" />
                           <input value={siteConfig.companyName || ""} onChange={e => updateSiteConfig('companyName', e.target.value)} placeholder="Nome Empresa" className="admin-input font-bold" />
                           <input value={siteConfig.companySubtitle || ""} onChange={e => updateSiteConfig('companySubtitle', e.target.value)} placeholder="Slogan" className="admin-input" />
                        </div>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-sm">
                        <label className="admin-label">Personalização Rodapé</label>
                        <div className="space-y-6">
                           <textarea value={siteConfig.footerNote || ""} onChange={e => updateSiteConfig('footerNote', e.target.value)} className="admin-input" rows={2} />
                           <input value={siteConfig.footerCopyright || ""} onChange={e => updateSiteConfig('footerCopyright', e.target.value)} className="admin-input" />
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
                  <div key={s.id} className="crystal-card p-10 relative space-y-6">
                    <button onClick={() => removeSlide(s.id)} className="absolute top-6 right-6 text-red-500/30 hover:text-red-500"><Trash2 size={16}/></button>
                    <input value={s.image} onChange={e => updateSlide(s.id, 'image', e.target.value)} placeholder="URL Imagem" className="admin-input" />
                    <input value={s.title} onChange={e => updateSlide(s.id, 'title', e.target.value)} placeholder="Título" className="admin-input font-bold" />
                    <textarea value={s.description} onChange={e => updateSlide(s.id, 'description', e.target.value)} placeholder="Descrição" className="admin-input text-xs" rows={2} />
                    <div className="grid grid-cols-2 gap-6">
                      <input value={s.buttonText || ""} onChange={e => updateSlide(s.id, 'buttonText', e.target.value)} placeholder="Texto Botão" className="admin-input !bg-white/5" />
                      <input value={s.buttonLink || ""} onChange={e => updateSlide(s.id, 'buttonLink', e.target.value)} placeholder="Link Botão" className="admin-input !bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addSlide} className="admin-btn-add"><Plus size={16}/> Adicionar Novo Slide</button>
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
                      <p className="text-[7px] text-white/20 uppercase tracking-widest mt-2">Destino das mensagens enviadas pelo formulário do site.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="admin-label flex items-center gap-2"><Phone size={12}/> Telemóvel (Geral & WhatsApp)</label>
                      <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="admin-input" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="admin-label flex items-center gap-2"><MapPin size={12}/> Morada Completa</label>
                    <input value={addressDetail} onChange={e => setAddressDetail(e.target.value)} placeholder="Rua, Algarve - Portugal" className="admin-input" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 border-t border-white/5">
                    {Object.keys(socialLinks).map(platform => (
                      <div key={platform} className="space-y-2">
                        <label className="admin-label uppercase">{platform} URL</label>
                        <input value={(socialLinks as any)[platform]} onChange={e => updateSocialLink(platform as any, e.target.value)} className="admin-input text-xs" />
                      </div>
                    ))}
                  </div>
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
                    <button onClick={() => toggleNotice(n.id)} className={`p-4 border ${n.active ? 'border-[#f8c8c4] text-[#f8c8c4]' : 'border-white/5 text-white/10'}`}><Bell size={18}/></button>
                    <button onClick={() => removeNotice(n.id)} className="p-4 text-red-500/20 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
              <button onClick={addNotice} className="admin-btn-add"><Plus size={16}/> Novo Aviso</button>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-12">
               <input value={googleMapsLink} onChange={e => setGoogleMapsLink(e.target.value)} placeholder="Link Google Maps Reviews" className="admin-input mb-8" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map(r => (
                  <div key={r.id} className="crystal-card p-10 relative space-y-6">
                    <button onClick={() => removeReview(r.id)} className="absolute top-6 right-6 text-red-500/30 hover:text-red-500"><Trash2 size={16}/></button>
                    <input value={r.author} onChange={e => updateReview(r.id, 'author', e.target.value)} placeholder="Cliente" className="admin-input font-bold" />
                    <textarea value={r.text} onChange={e => updateReview(r.id, 'text', e.target.value)} className="admin-input" rows={3} />
                  </div>
                ))}
               </div>
               <button onClick={addReview} className="admin-btn-add"><Plus size={16}/> Novo Depoimento</button>
            </div>
          )}

          {activeTab === 'user' && (
            <div className="max-w-md mx-auto space-y-8">
              <input value={adminUsername} onChange={e => setAdminUsername(e.target.value)} placeholder="Utilizador" className="admin-input" />
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="admin-input" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col items-center gap-8">
          <button onClick={handleFinalize} disabled={isSaving} className="btn-serenity px-32 py-8 flex items-center justify-center gap-6 min-w-[400px]">
            {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Check size={16} />}
            <span>GUARDAR & FINALIZAR</span>
          </button>
          <button onClick={onResetDefaults} className="text-[8px] font-bold text-red-400/20 hover:text-red-400 uppercase tracking-widest">Resetar cache local</button>
        </div>
      </div>

      <style>{`
        .admin-label { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(248, 200, 196, 0.4); margin-bottom: 0.5rem; }
        .admin-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; color: white; font-size: 0.8rem; border-radius: 2px; outline: none; }
        .admin-input:focus { border-color: #f8c8c4; }
        .admin-btn-add { width: 100%; padding: 2rem; border: 1px dashed rgba(255,255,255,0.1); color: rgba(255,255,255,0.2); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.4em; display: flex; align-items: center; justify-content: center; gap: 1rem; }
        .admin-btn-add:hover { color: #f8c8c4; border-color: #f8c8c4; }
      `}</style>
    </motion.div>
  );
};

export default AdminPanel;