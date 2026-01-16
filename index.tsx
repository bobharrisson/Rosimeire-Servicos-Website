import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Menu, X, Home, Building2, Paintbrush, Gem, Mail, Phone, ArrowRight,
  Shield, Wind, Sparkle, Settings, ExternalLink, Bell, Lock, User, Info,
  Star, CheckCircle2, Briefcase, MapPin, ArrowLeft, Globe, Target, Eye, 
  Heart, ShieldCheck, MessageSquare, Flame, Award, Users, Check,
  ChevronLeft, ChevronRight, Save, RotateCcw, Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPanel from './AdminPanel';

// --- Types ---
type Language = 'PT' | 'EN' | 'ES';
type View = 'home' | 'contact' | 'about' | 'careers';

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
  // SMTP Fields
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

// --- Visual Elements ---

const GlassDivider = () => (
  <motion.div 
    initial={{ opacity: 0, scaleX: 0 }}
    whileInView={{ opacity: 1, scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.5, ease: "circOut" }}
    className="glass-divider" 
  />
);

// --- Translations ---
const translations = {
  PT: {
    navHome: "O Início", navServices: "Curadoria", navReviews: "Legado", navContact: "CONTACTO",
    heroSubtitle: "Rosimeire Serviços",
    servicesTitle: "O Rigor do Detalhe",
    servicesSubtitle: "A excelência técnica que preserva o seu legado.",
    servicesDescription: "Dedicamo-nodes à preservação e cuidado da sua propriedade com um rigor inigualável. Através de um serviço de limpeza profissional de alto padrão, os nossos técnicos especializados asseguram que cada detalhe do seu imóvel seja tratado com a máxima perícia, garantindo um ambiente absolutamente imaculado. Aliamos a excelência técnica a uma política de transparência e valor justo, oferecendo-lhe a segurança de um património impecavelmente mantido, sempre que necessitar.",
    s1Title: "Alojamentos e Unidades Turísticas",
    s1Tagline: "Higienização rigorosa para a rotatividade do setor.",
    s1Desc: "Especialistas na preparação de alojamentos locais, hostels e unidades hoteleiras. Garantimos uma limpeza profunda e eficiente entre estadias, assegurando que cada novo hóspede encontre um imóvel com padrões de limpeza impecáveis.",
    s2Title: "Residências Particulares e Diárias",
    s2Tagline: "Manutenção personalizada e assistência de confiança.",
    s2Desc: "Serviços de limpeza diária ou periódica adaptados à rotina da sua casa. Oferecemos o apoio de equipas dedicadas para a gestão do seu santuário pessoal, atuando com a máxima discrição, zelo e regularidade.",
    s3Title: "Detalhe de Precisão",
    s3Tagline: "Foco absoluto nos pormenores e acabamentos.",
    s3Desc: "Um serviço de limpeza minucioso que vai além do essencial. Intervimos nos detalhes mais exigentes e de difícil acesso, garantindo um nível de perfeição e frescura que transforma completamente o ambiente.",
    s4Title: "Limpezas Pós-Obra",
    s4Tagline: "Finalização técnica para entrega de espaços prontos a habitar.",
    s4Desc: "Remoção profunda de poeiras e resíduos de construção em moradias, restaurantes ou lojas. Transformamos o cenário de obra num ambiente limpo e acolhedor, garantindo uma transição perfeita para a utilização final.",
    reviewsTitle: "Vozes de Confiança",
    partnersTitle: "Alianças de Prestígio",
    quoteTitle: "Contacto",
    addressTitle: "Nosso Escritório",
    addressDetail: "R. 25 de Abril 49, 8125-234, Quarteira, Faro Algarve – Portugal",
    name: "Nome Completo", email: "Email", phone: "Contacto Telefónico", message: "Em que podemos ajudar?",
    send: "Enviar Mensagem", success: "Mensagem enviada. Entraremos em contacto brevemente.",
    footerNote: "A alma do Algarve bem cuidada.",
    footerSobre: "Sobre", footerCarreira: "Carreira", developedBy: "Desenvolvido & Gerido Por",
    adminTitle: "Painel Administrativo", adminSlides: "Slides", adminNotices: "Avisos", adminReviews: "Depoimentos", adminPartners: "Parceiros", adminImages: "Visual", adminEmail: "E-mail",
    sirTitle: "SIR - Sistema Integrado", logout: "Fechar Panel", back: "Voltar ao Início",
    aboutSectionTitle: "A Nossa Essência",
    aboutSectionText: "A Rosimeire Serviços iniciou o seu percurso em 2011, fruto da visão e dedicação da sua fundadora, Rosimeire Silva. Atuando inicialmente de forma independente em propriedades exclusivas, o seu rigor técnico, honestidade e um perfeccionismo inabalável tornaram-se a sua assinatura de marca. Esta postura de excelência permitiu fidelizar uma carteira de clientes de prestígio, consolidando os alicerces que impulsionaram o crescimento e a solidez que a empresa apresenta hoje.",
    missionTitle: "Missão", missionText: "Satisfazer o cliente deixando sua propriedade impecavelmente limpa, conforme sua necessidade.",
    visionTitle: "Visão", visionText: "Brevemente nossos serviços serão disponibilizados em outros países da europa, com o mesmo padrão de qualidade que atendemos atualmente em Portugal, para nossos diferentes tipos de clientes.",
    valuesTitle: "Valores",
    val1: "Empatia com os clientes", val2: "Qualidade", val3: "Integridade e Honestidade", val4: "Abertura e Respeito", val5: "Coragem",
    careersTitle: "Carreiras",
    careersHeroTitle: "Junte-se ao Nosso Legado",
    careersHeroSubtitle: "Procuramos profissionais que partilham a nossa paixão pela excelência e o rigor no detalhe.",
    careersAdvisoryTitle: "Aviso de Recrutamento Geográfico",
    careersAdvisoryText: "No momento estamos a recrutar apenas os candidatos do Distrito de Faro que, possam se locomover em meios de transporte públicos ou próprio, nosso foco de recrutamento está sendo o Conselho de Loulé, tendo em vista que nossa sede está situada na Freguesia de Quarteira, para essa Freguesia, conseguimos oferecer carrinhas para transportar, em alguns casos aos, nossos pontos de encontro.",
    careersWhyTitle: "Porquê a Rosimeire Serviços?",
    careersAdv1: "Formação Contínua", careersAdv1Desc: "Desenvolvimento técnico em limpeza especializada.",
    careersAdv2: "Ambiente de Respeito", careersAdv2Desc: "Valorizamos o bem-estar da nossa equipa.",
    careersAdv3: "Reconhecimento", careersAdv3Desc: "Oportunidades de crescimento no Algarve.",
    careersApplyTitle: "Candidate-se Hoje",
    careersApplyDesc: "Se é uma pessoa dedicada, pontual e com olho para o detalhe, queremos conheê-la.",
    careersApplyBtn: "Preencher Formulário de Candidatura",
    careersFormLink: "https://docs.google.com/forms/d/e/1FAIpQLSdo6NUZsw3gcZhigbPrAafa1zb32hgjQi67dDkEKEEByc1rHg/viewform?usp=sf_link"
  },
  EN: {
    navHome: "Home", navServices: "Curation", navReviews: "Legacy", navContact: "CONTACT",
    heroSubtitle: "Rosimeire Serviços",
    servicesTitle: "The Rigor of Detail",
    servicesSubtitle: "The technical excellence that preserves your legacy.",
    servicesDescription: "We are dedicated to the preservation and care of your property with unparalleled rigor. Through a high-standard professional cleaning service, our specialized technicians ensure that every detail of your property is treated with the utmost expertise, guaranteeing an absolutely immaculate environment. We combine technical excellence with a policy of transparency and fair value, offering you the security of an impeccably maintained estate, whenever you need it.",
    s1Title: "Hospitality & Tourist Units",
    s1Tagline: "Rigorous sanitization for sector turnover.",
    s1Desc: "Specialists in preparing local accommodations, hostels, and hotel units. We guarantee a deep and efficient cleaning between stays, ensuring that every new guest finds a property with impeccable cleanliness standards.",
    s2Title: "Private Residences & Daily Cleaning",
    s2Tagline: "Personalized maintenance and trusted assistance.",
    s2Desc: "Daily or periodic cleaning services adapted to your home's routine. We offer the support of dedicated teams for the management of your personal sanctuary, acting with maximum discretion, care, and regularity.",
    s3Title: "Precision Detail",
    s3Tagline: "Absolute focus on details and finishes.",
    s3Desc: "A thorough cleaning service that goes beyond the essential. We intervene in the most demanding and hard-to-reach details, ensuring a level of perfection and freshness that completely transforms the environment.",
    s4Title: "Post-Construction Cleaning",
    s4Tagline: "Technical finishing for move-in ready spaces.",
    s4Desc: "Deep removal of dust and construction residues in villas, restaurants, or shops. We transform the construction site into a clean and welcoming environment, ensuring a perfect transition to final use.",
    reviewsTitle: "Trusted Voices",
    partnersTitle: "Prestige Alliances",
    quoteTitle: "Contact",
    addressTitle: "Our Office",
    addressDetail: "R. 25 de Abril 49, 8125-234, Quarteira, Faro Algarve – Portugal",
    name: "Full Name", email: "Email", phone: "Phone Number", message: "How may we assist?",
    send: "Send Message", success: "Message sent. We will contact you shortly.",
    footerNote: "The soul of a well-kept Algarve.",
    footerSobre: "About", footerCarreira: "Careers", developedBy: "Developed & Managed By",
    adminTitle: "Admin Panel", adminSlides: "Slides", adminNotices: "Notices", adminReviews: "Reviews", adminPartners: "Partners", adminImages: "Visual", adminEmail: "Email",
    sirTitle: "SIR - Integrated System", logout: "Close Panel", back: "Back Home",
    aboutSectionTitle: "Our Essence",
    aboutSectionText: "Rosimeire Serviços began its journey in 2011, born from the vision and dedication of its founder, Rosimeire Silva. Initially operating independently in exclusive properties, her technical rigor, honesty, and unwavering perfectionism became her signature. This pursuit of excellence allowed her to build a portfolio of prestigious clients, consolidating the foundations that drove the growth and stability the company demonstrates today.",
    missionTitle: "Mission", missionText: "To satisfy the client by leaving their property impeccably clean, according to their needs.",
    visionTitle: "Vision", visionText: "Soon our services will be available in other European countries, with the same quality standard we currently provide in Portugal, for our diverse clientele.",
    valuesTitle: "Values",
    val1: "Empathy with clients", val2: "Quality", val3: "Integrity and Honesty", val4: "Openness and Respect", val5: "Courage",
    careersTitle: "Careers",
    careersHeroTitle: "Join Our Legacy",
    careersHeroSubtitle: "We seek professionals who share our passion for excellence and rigor in detail.",
    careersAdvisoryTitle: "Geographic Recruitment Notice",
    careersAdvisoryText: "At the moment we are only recruiting candidates from the Faro District who can travel by public or private transport. Our recruitment focus is the Loulé Council, as our headquarters is located in the Parish of Quarteira. For this Parish, we can provide transport vans, in some cases, to our meeting points.",
    careersWhyTitle: "Why Rosimeire Serviços?",
    careersAdv1: "Continuous Training", careersAdv1Desc: "Technical development in specialized cleaning.",
    careersAdv2: "Respectful Environment", careersAdv2Desc: "We value our team's well-being.",
    careersAdv3: "Recognition", careersAdv3Desc: "Growth opportunities in the Algarve.",
    careersApplyTitle: "Apply Today",
    careersApplyDesc: "If you are dedicated, punctual, and have an eye for detail, we want to meet you.",
    careersApplyBtn: "Fill Application Form",
    careersFormLink: "https://docs.google.com/forms/d/e/1FAIpQLSdo6NUZsw3gcZhigbPrAafa1zb32hgjQi67dDkEKEEByc1rHg/viewform?usp=sf_link"
  },
  ES: {
    navHome: "Inicio", navServices: "Curaduría", navReviews: "Legado", navContact: "CONTACTO",
    heroSubtitle: "Rosimeire Serviços",
    servicesTitle: "El Rigor del Detalle",
    servicesSubtitle: "La excelencia técnica que preserva su legado.",
    servicesDescription: "Nos dedicamos a la preservación y el cuidado de su propriedade con un rigor inigualável. A través de un servicio de limpieza profesional de alto nivel, nuestros técnicos especializados aseguran que cada detalle de su inmueble sea tratado con la máxima pericia, garantizando un ambiente absolutamente inmaculado. Combinamos la excelencia técnica con una política de transparencia e valor justo, ofreciéndole la seguridad de un patrimonio impecablemente mantenido, siempre que lo necesite.",
    s1Title: "Alojamientos y Unidades Turísticas",
    s1Tagline: "Higienização rigorosa para a rotatividade do setor.",
    s1Desc: "Especialistas en la preparación de alojamientos locales, hostales y unidades hoteleras. Garantizamos una limpieza profunda y eficiente entre estadias, aseguran que cada nuevo huésped encuentre un inmueble con estándares de limpieza impecables.",
    s2Title: "Residencias Particulares e Diarias",
    s2Tagline: "Mantenimiento personalizado y asistencia de confianza.",
    s2Desc: "Servicios de limpeza diaria o periódica adaptados a la rutina de su hogar. Ofrecemos el apoyo de equipos dedicados para la gestión de su santuario personal, actuando con la máxima discreción, celo y regularidad.",
    s3Title: "Detalle de Precisão",
    s3Tagline: "Enfoque absoluto en los pormenores y acabados.",
    s3Desc: "Un servicio de limpieza minucioso que va más allá de lo esencial. Intervenimos en los detalles más exigentes y de difícil acceso, garantizando un nivel de perfección y frescura que transforma completamente el ambiente.",
    s4Title: "Limpezas Post-Obra",
    s4Tagline: "Finalización técnica para entrega de espacios listos para habitar.",
    s4Desc: "Eliminación profunda de polvos y residuos de construcción en chalets, restaurantes o tiendas. Transformamos el escenario de obra en un ambiente limpio y acogedor, garantizando una transición perfecta para la utilización final.",
    reviewsTitle: "Voces de Confiança",
    partnersTitle: "Alianças de Prestígio",
    quoteTitle: "Contacto",
    addressTitle: "Nuestra Oficina",
    addressDetail: "R. 25 de Abril 49, 8125-234, Quarteira, Faro Algarve – Portugal",
    name: "Nombre Completo", email: "Email", phone: "Teléfono", message: "¿Cómo podemos ayudar?",
    send: "Enviar Mensagem", success: "Mensaje enviado. Le contactaremos pronto.",
    footerNote: "El alma del Algarve bien cuidada.",
    footerSobre: "Sobre", footerCarreira: "Carrera", developedBy: "Desarrollado y Gestionado Por",
    adminTitle: "Panel Administrativo", adminSlides: "Slides", adminNotices: "Avisos", adminReviews: "Testimonios", adminPartners: "Socios", adminImages: "Visual", adminEmail: "Email",
    sirTitle: "SIR - Sistema Integrado", logout: "Cerrar Panel", back: "Volver al Inicio",
    aboutSectionTitle: "Nuestra Esencia",
    aboutSectionText: "Rosimeire Serviços inició su trayectoria en 2011, fruto de la visión y dedicación de su fundadora, Rosimeire Silva. Actuando inicialmente de forma independiente en propiedades exclusivas, su rigor técnico, honestidade y un perfeccionismo inaquebrantable se convirtieron en su sello distintivo. Esta postura de excelencia permitió fidelizar una cartera de clientes de prestigio, consolidando los cimientos que impulsaron el crecimiento y la solidez que la empresa presenta hoy.",
    missionTitle: "Misión", missionText: "Satisfacer al cliente dejando su propiedad impecablemente limpia, según su necesidad.",
    visionTitle: "Vision", visionText: "Próximamente nuestros servicios estarán disponibles en otros países de Europa, con el mesmo estándar de calidad que atendemos actualmente em Portugal.",
    valuesTitle: "Valores",
    val1: "Empatía con los clientes", val2: "Qualidad", val3: "Integridad e Honestidad", val4: "Abertura e Respeto", val5: "Coraje",
    careersTitle: "Carreras",
    careersHeroTitle: "Únete a Nuestro Legado",
    careersHeroSubtitle: "Buscamos profesionales que compartan nuestra pasión por la excelencia e el rigor en el detalle.",
    careersAdvisoryTitle: "Aviso de Reclutamiento Geográfico",
    careersAdvisoryText: "Actualmente solo estamos reclutando candidatos del Distrito de Faro que puedan desplazarse en transporte público o propio. Nuestro foco de reclutamiento es el Consejo de Loulé, ya que nuestra sede se encuentra en la Parroquia de Quarteira. Para esta Parroquia, podemos ofrecer furgonetas de transporte, em some casos, a nuestros puntos de encuentro.",
    careersWhyTitle: "¿Por qué Rosimeire Serviços?",
    careersAdv1: "Formación Continua", careersAdv1Desc: "Desarrollo técnico en limpeza especializada.",
    careersAdv2: "Ambiente de Respeito", careersAdv2Desc: "Valorizamos el bienestar de nuestro equipo.",
    careersAdv3: "Reconhecimiento", careersAdv3Desc: "Oportunidades de crecimiento no Algarve.",
    careersApplyTitle: "Aplica Hoy",
    careersApplyDesc: "Si eres una persona dedicada, puntual y con ojo para el detalhe, queremos conocerte.",
    careersApplyBtn: "Completar Formulario de Candidatura",
    careersFormLink: "https://docs.google.com/forms/d/e/1FAIpQLSdo6NUZsw3gcZhigbPrAafa1zb32hgjQi67dDkEKEEByc1rHg/viewform?usp=sf_link"
  }
};

const DEFAULT_SLIDES: Slide[] = [
  { 
    id: '1', title: "SERENIDADE & RIGOR", 
    description: "Cuidamos da sua casa para que você possa apenas sentir o momento.", 
    image: "https://images.unsplash.com/photo-1600607687940-4e7a6a353d2c?auto=format&fit=crop&q=80&w=1600",
    tag: "A ESSÊNCIA"
  },
  { 
    id: '2', title: "DETALHES ESSENCIAIS", 
    description: "Uma casa limpa é um refúgio para a alma. Nossa curadoria é invisível, mas sentida.", 
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600",
    tag: "O CUIDADO"
  }
];

const DEFAULT_SECTION_IMAGES: SectionImages = {
  about: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
  careers: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&q=80&w=1200"
};

const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  recipientEmail: "atendimento@rosimeireservicos.com",
  serviceId: "",
  templateId: "",
  publicKey: "",
  smtpHost: "smtp.exemplo.com",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  smtpSecure: true,
  useSmtp: false
};

const DEFAULT_PARTNERS: Partner[] = [
  { id: '1', name: "Algarve Living", logo: "https://images.unsplash.com/photo-1600607687940-4e7a6a353d2c?auto=format&fit=crop&q=80&w=800", url: "#" },
  { id: '2', name: "Ocean Estates", logo: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800", url: "#" },
  { id: '3', name: "Serenity Rentals", logo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200", url: "#" },
  { id: '4', name: "Elite Homes", logo: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800", url: "#" }
];

const DEFAULT_NOTICES: Notice[] = [
  { id: '1', text: "Nova especialidade de Limpeza Técnica de Cristais agora disponível.", active: true }
];

const DEFAULT_REVIEWS: Review[] = [
  { 
    id: '1', 
    author: "Yeudy b", 
    text: "Limpeza impecável, o serviço foi 10/10 e super rápido. Definitivamente contarei com eles no futuro.", 
    time: "12 meses atrás",
    initials: "Y",
    color: "#386624" 
  },
  { 
    id: '2', 
    author: "Alex Alcivar", 
    text: "Auténtico profesionales en el sector, sin duda muy por encima de la competencia!! Cuidan cada detalhe.", 
    time: "12 meses atrás",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    initials: "AA",
    color: "#1a365d"
  }
];

const INITIAL_GOOGLE_MAPS_LINK = "https://www.google.com/search?q=Rosimeire+Servi%C3%A7os+Quarteira&si=AMgyJEs9DArPE9xmb5yVYVjpG4jqWDEKSIpCRSjmm88XZWnGNakrDl7qyiJLF74BYlGsMcE9Da1nUDIZ5DNa9RlMSKMI70hspYaTqbBEPz7oFQkgC81_ZMtEKchYDA-1FddJnX-cdUqx";

// --- Components ---

const ReviewCard: React.FC<{ r: Review; link: string }> = ({ r, link }) => (
  <a 
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="crystal-card p-10 rounded-sm group flex flex-col justify-between h-[350px] w-full max-w-[440px] cursor-pointer hover:border-[#f8c8c4]/40 transition-all block mx-auto"
  >
    <div>
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-16 h-16 rounded-full border border-white/5 shadow-md p-0.5 flex-shrink-0">
          {r.avatar ? (
            <img src={r.avatar} alt={r.author} className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-xs uppercase" style={{ backgroundColor: r.color }}>{r.initials}</div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden p-1">
             <svg viewBox="0 0 24 24" className="w-full h-full"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold tracking-[0.2em] text-[12px] uppercase">{r.author}</h4>
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] mt-1">{r.time}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1 text-[#f8c8c4]">{[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}</div>
        <CheckCircle2 size={14} className="text-[#3b82f6]/60" />
      </div>
      <p className="text-white/40 text-[16px] font-light leading-relaxed italic group-hover:text-white/70 transition-colors line-clamp-4">"{r.text}"</p>
    </div>
    <div className="flex justify-end opacity-0 group-hover:opacity-40 transition-opacity">
      <ExternalLink size={14} className="text-[#f8c8c4]" />
    </div>
    <div className="h-[1px] w-0 bg-[#f8c8c4]/30 group-hover:w-full transition-all duration-1000 mt-6"></div>
  </a>
);

const PartnerCard: React.FC<{ p: Partner }> = ({ p }) => (
  <a 
    href={p.url}
    target="_blank"
    rel="noopener noreferrer"
    className="crystal-card block h-[180px] w-[360px] flex-shrink-0 mx-6 group relative overflow-hidden rounded-sm"
  >
    <img 
      src={p.logo} 
      alt={p.name} 
      className="w-full h-full object-cover transition-all duration-700 opacity-30 grayscale group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#081221] via-transparent to-transparent opacity-80" />
    <div className="absolute bottom-6 left-8 z-10">
      <span className="text-[10px] font-bold tracking-[0.5em] text-white/40 group-hover:text-[#f8c8c4] transition-colors uppercase">{p.name}</span>
    </div>
    <div className="absolute inset-0 bg-[#f8c8c4]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </a>
);

const App = () => {
  const [lang, setLang] = useState<Language>('PT');
  const [view, setView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'slides' | 'notices' | 'reviews' | 'partners' | 'images' | 'email'>('slides');
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const STORAGE_KEY_PREFIX = 'rosimeire_config_v12';

  const [slides, setSlides] = useState<Slide[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_slides`);
    return saved ? JSON.parse(saved) : DEFAULT_SLIDES;
  });

  const [sectionImages, setSectionImages] = useState<SectionImages>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_section_images`);
    return saved ? JSON.parse(saved) : DEFAULT_SECTION_IMAGES;
  });

  const [emailConfig, setEmailConfig] = useState<EmailConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_email_config`);
    return saved ? JSON.parse(saved) : DEFAULT_EMAIL_CONFIG;
  });
  
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_notices`);
    return saved ? JSON.parse(saved) : DEFAULT_NOTICES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_reviews`);
    return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
  });

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_partners`);
    return saved ? JSON.parse(saved) : DEFAULT_PARTNERS;
  });

  const [googleMapsLink, setGoogleMapsLink] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_maps`);
    return saved || INITIAL_GOOGLE_MAPS_LINK;
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const t = translations[lang];

  // Auto-play for Hero Slides
  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(p => (p + 1) % (slides.length || 1)), 9000);
    return () => clearInterval(interval);
  }, [slides]);

  // Auto-play for Review Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (reviews.length > 0) {
        setCurrentReviewIndex(prev => (prev + 1) % reviews.length);
      }
    }, 8000); // 8 segundos para leitura
    return () => clearInterval(interval);
  }, [reviews]);

  // Handle LocalStorage Persistence
  useEffect(() => {
    setIsSyncing(true);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_slides`, JSON.stringify(slides));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_section_images`, JSON.stringify(sectionImages));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_email_config`, JSON.stringify(emailConfig));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_notices`, JSON.stringify(notices));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_reviews`, JSON.stringify(reviews));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_partners`, JSON.stringify(partners));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_maps`, googleMapsLink);
    
    const timer = setTimeout(() => setIsSyncing(false), 800);
    return () => clearTimeout(timer);
  }, [slides, sectionImages, emailConfig, notices, reviews, partners, googleMapsLink]);

  const handleResetDefaults = () => {
    if (confirm("Tem certeza que deseja apagar todas as personalizações e voltar aos padrões de fábrica?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const handleAdminAccess = () => {
    if (isAuthenticated) setIsAdminOpen(true);
    else setIsLoginOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'rosimeire2025') {
      setIsAuthenticated(true);
      setIsLoginOpen(false);
      setIsAdminOpen(true);
      setLoginError(false);
    } else setLoginError(true);
  };

  const handleNavClick = (sectionId: string) => {
    setView('home');
    setIsMenuOpen(false);
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulação de envio considerando as configurações de e-mail
    if (emailConfig.useSmtp) {
      console.log(`Tentando envio via SMTP: ${emailConfig.smtpHost}:${emailConfig.smtpPort}`);
      console.log(`Mensagem encaminhada para: ${emailConfig.recipientEmail}`);
    } else {
      console.log(`Enviando formulário via API/Serviço para: ${emailConfig.recipientEmail}`);
    }

    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen selection:bg-[#f8c8c4] selection:text-[#081221]">
      
      {/* --- HEADER Assembly (Unified Z-Index) --- */}
      <div className={`fixed top-0 w-full flex flex-col transition-all duration-500 ${isMenuOpen ? 'z-[1000]' : 'z-[900]'}`}>
        <AnimatePresence>
          {notices.filter(n => n.active).map((notice) => (
            <motion.button 
              key={notice.id}
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onClick={() => { setView('contact'); setIsMenuOpen(false); }}
              className="w-full bg-[#f8c8c4] text-[#081221] py-3 px-8 flex justify-center items-center gap-6 relative cursor-pointer hover:brightness-105 transition-all outline-none"
              aria-label={`Aviso: ${notice.text}. Clique para entrar em contacto.`}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bell size={18} strokeWidth={2.5} />
              </motion.div>
              <span className="text-[10px] md:text-[11px] font-black tracking-[0.3em] uppercase text-center leading-tight">{notice.text}</span>
            </motion.button>
          ))}
        </AnimatePresence>

        <header className={`transition-all duration-500 ${isMenuOpen ? 'bg-transparent border-transparent' : 'glass-nav border-b border-white/5 shadow-2xl'}`}>
          <div className="px-8 md:px-16 py-4 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => { setView('home'); setIsMenuOpen(false); }}
            >
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-light tracking-[0.3em] text-white uppercase leading-none">ROSIMEIRE</span>
                <span className="text-[8px] font-bold tracking-[0.5em] text-[#f8c8c4] uppercase mt-1">SERVIÇOS</span>
              </div>
            </motion.div>
            
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex gap-4">
                {['PT', 'EN', 'ES'].map(l => (
                  <button key={l} onClick={() => setLang(l as Language)} className={`text-[8px] font-black tracking-widest ${lang === l ? 'text-[#f8c8c4]' : 'text-white/10 hover:text-white/40'}`}>{l}</button>
                ))}
              </div>
              <div className="w-[1px] h-3 bg-white/5"></div>
              <button 
                onClick={() => setView('contact')} 
                className={`btn-serenity !py-2 !px-6 ${view === 'contact' ? 'bg-[#f8c8c4] text-[#081221]' : ''}`}
              >
                {t.navContact}
              </button>
              <div className="w-[1px] h-3 bg-white/5"></div>
              <a href="https://sir.rosimeire.pt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[8px] font-bold tracking-[0.3em] text-[#f8c8c4]/60 hover:text-[#f8c8c4] transition-all group uppercase">
                SIR <ExternalLink size={10} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button onClick={handleAdminAccess} className={`transition-colors ${isAuthenticated ? 'text-[#f8c8c4]' : 'text-white/20 hover:text-[#f8c8c4]'}`}>
                <Settings size={14} />
              </button>
            </div>
            
            <button 
              className={`lg:hidden relative z-[1100] transition-colors duration-300 ${isMenuOpen ? 'text-[#f8c8c4]' : 'text-white/60'}`} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
          
          <div className={`${isMenuOpen ? 'hidden' : 'hidden lg:block border-t border-white/5'}`}>
            <nav className="container mx-auto flex justify-center py-4">
              <div className="flex gap-16 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                {['Home', 'Services', 'Reviews'].map((item) => (
                  <button 
                    key={item} 
                    onClick={() => handleNavClick(item.toLowerCase())} 
                    className="hover:text-white transition-all hover:tracking-[0.5em]"
                  >
                    {t[`nav${item}` as keyof typeof t]}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </header>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[950] bg-[#081221]/98 backdrop-blur-2xl lg:hidden flex flex-col pt-32 px-12"
          >
            <div className="flex flex-col gap-12 mt-12">
              {[
                { label: t.navHome, id: 'home' },
                { label: t.navServices, id: 'services' },
                { label: t.navReviews, id: 'reviews' }
              ].map((item, idx) => (
                <motion.button 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  onClick={() => handleNavClick(item.id)}
                  className="text-4xl font-light tracking-[0.2em] text-white/60 text-left hover:text-[#f8c8c4] transition-all uppercase"
                >
                  {item.label}
                </motion.button>
              ))}
              
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => { setView('contact'); setIsMenuOpen(false); }}
                className={`text-4xl font-light tracking-[0.2em] text-left uppercase ${view === 'contact' ? 'text-[#f8c8c4]' : 'text-white/60'}`}
              >
                {t.navContact}
              </motion.button>
            </div>

            <div className="mt-auto pb-24 space-y-12">
              <div className="flex gap-10 items-center">
                <Globe size={16} className="text-[#f8c8c4]/40" />
                <div className="flex gap-8">
                  {['PT', 'EN', 'ES'].map(l => (
                    <button key={l} onClick={() => setLang(l as Language)} className={`text-sm font-black tracking-widest ${lang === l ? 'text-[#f8c8c4]' : 'text-white/20'}`}>{l}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <a href="https://sir.rosimeire.pt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-xs font-bold tracking-[0.4em] text-[#f8c8c4] uppercase">
                  SIR - SISTEMA INTEGRADO <ExternalLink size={14} />
                </a>
                <button onClick={handleAdminAccess} className="flex items-center gap-4 text-xs font-bold tracking-[0.4em] text-white/20 uppercase">
                  <Settings size={14} /> GESTÃO
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- OVERLAYS --- */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1200] flex items-center justify-center bg-[#081221]/80 backdrop-blur-md px-8">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="crystal-card w-full max-md p-12 relative">
              <button onClick={() => setIsLoginOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={20}/></button>
              <div className="text-center mb-8">
                <Lock className="mx-auto text-[#f8c8c4] mb-6" size={32} />
                <h3 className="heading-serif text-3xl">Acesso Restrito</h3>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mt-4">Somente para Gestão</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 flex items-center gap-2"><User size={10}/> Utilizador</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 text-sm rounded outline-none focus:border-[#f8c8c4]/50 transition-all" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 flex items-center gap-2"><Lock size={10}/> Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 text-sm rounded outline-none focus:border-[#f8c8c4]/50 transition-all" required />
                </div>
                {loginError && <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest text-center italic">Credenciais Inválidas</p>}
                <button type="submit" className="w-full btn-serenity py-4">Entrar</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} onLogout={() => { setIsAuthenticated(false); setIsAdminOpen(false); }}
            slides={slides} setSlides={setSlides}
            sectionImages={sectionImages} setSectionImages={setSectionImages}
            emailConfig={emailConfig} setEmailConfig={setEmailConfig}
            notices={notices} setNotices={setNotices} reviews={reviews} setReviews={setReviews}
            partners={partners} setPartners={setPartners}
            googleMapsLink={googleMapsLink} setGoogleMapsLink={setGoogleMapsLink} activeTab={activeAdminTab} setActiveTab={setActiveAdminTab} t={translations[lang]}
            isSyncing={isSyncing}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div 
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* --- HERO --- */}
            <section id="home" className="min-h-screen h-screen relative flex overflow-hidden group/hero">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0">
                   <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slides[currentSlide]?.image})` }} />
                   <div className="absolute inset-0 bg-gradient-to-r from-[#081221] via-[#081221]/60 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Slider Navigation */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between z-30 px-0 pointer-events-none">
                <motion.button onClick={prevSlide} className="pointer-events-auto flex items-center group/btn-left cursor-pointer">
                  <div className="w-10 h-10 md:w-20 md:h-20 flex items-center justify-center text-white/10 group-hover/btn-left:text-[#f8c8c4] transition-all">
                    <ChevronLeft size={28} strokeWidth={0.5} />
                  </div>
                </motion.button>
                <motion.button onClick={nextSlide} className="pointer-events-auto flex items-center group/btn-right cursor-pointer">
                  <div className="w-10 h-10 md:w-20 md:h-20 flex items-center justify-center text-white/10 group-hover/btn-right:text-[#f8c8c4] transition-all">
                    <ChevronRight size={28} strokeWidth={0.5} />
                  </div>
                </motion.button>
              </div>

              {/* Content Container: Optimized for vertical centering */}
              <div className="container mx-auto px-8 md:px-32 lg:px-64 relative z-10 flex flex-col justify-center h-full pt-20 md:pt-32">
                <motion.div 
                   key={`content-${currentSlide}`}
                   initial={{ opacity: 0, y: 20 }} 
                   animate={{ opacity: 1, y: 0 }} 
                   className="flex flex-col max-w-4xl text-left"
                >
                  <span className="tagline tagline-hero mb-3 block">{slides[currentSlide]?.tag}</span>
                  <h1 className="heading-serif text-3xl md:text-6xl lg:text-[5.5rem] text-white mb-5 leading-[1.1] uppercase tracking-tighter">
                    {slides[currentSlide]?.title.split(' ')[0]}<br/>
                    <span className="italic font-light opacity-60 text-[#f8c8c4]">{slides[currentSlide]?.title.split(' ').slice(1).join(' ')}</span>
                  </h1>
                  <p className="text-[10px] md:text-lg font-light text-white/50 max-w-lg leading-relaxed mb-8">
                    {slides[currentSlide]?.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-8 items-start sm:items-center">
                    <button onClick={() => setView('contact')} className="btn-serenity !px-8 !py-3">{t.navContact}</button>
                    <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-[#f8c8c4] flex items-center gap-3 group transition-all">
                      EXPLORAR <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                  </div>

                  {/* Indicators */}
                  <div className="flex items-center gap-3 mt-10 md:mt-20">
                    {slides.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentSlide(idx)} className="group py-2">
                        <div className={`h-[1px] transition-all duration-700 ${currentSlide === idx ? 'w-10 md:w-20 bg-[#f8c8c4]' : 'w-4 md:w-6 bg-white/10 group-hover:bg-white/30'}`}></div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            <GlassDivider />

            {/* --- SERVICES --- */}
            <section id="services" className="py-32 md:py-64 relative">
              <div className="container mx-auto px-8 md:px-16">
                <div className="flex flex-col md:flex-row justify-between items-start mb-32 gap-16 md:gap-24">
                   <div className="max-w-3xl">
                     <span className="tagline mb-10 block text-sm md:text-base">{t.servicesTitle}</span>
                     <h2 className="heading-serif text-6xl md:text-[9rem] text-white leading-none">{t.servicesSubtitle}</h2>
                   </div>
                   <div className="space-y-10 max-w-2xl pt-6">
                     <p className="text-white/60 text-lg md:text-2xl font-light leading-relaxed tracking-wide">
                        {t.servicesDescription}
                     </p>
                     <div className="flex gap-6 text-[#f8c8c4]/60"><Shield size={28}/><Wind size={28}/><Sparkle size={28}/></div>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                  {[
                    { title: t.s1Title, tagline: t.s1Tagline, desc: t.s1Desc, icon: <Building2 size={32}/> },
                    { title: t.s2Title, tagline: t.s2Tagline, desc: t.s2Desc, icon: <Home size={32}/> },
                    { title: t.s3Title, tagline: t.s3Tagline, desc: t.s3Desc, icon: <Sparkle size={32}/> },
                    { title: t.s4Title, tagline: t.s4Tagline, desc: t.s4Desc, icon: <Paintbrush size={32}/> }
                  ].map((s, idx) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} key={idx} className="crystal-card p-14 rounded-sm group flex flex-col justify-between h-auto min-h-[600px]">
                       <div className="space-y-10">
                         <div className="text-[#f8c8c4]/60 group-hover:scale-110 transition-transform duration-700">{s.icon}</div>
                         <div className="space-y-5">
                           <h3 className="text-3xl md:text-4xl font-light text-white tracking-tighter uppercase leading-tight">{s.title}</h3>
                           <p className="text-[#f8c8c4]/80 text-[11px] md:text-xs font-bold uppercase tracking-[0.4em] leading-relaxed italic">{s.tagline}</p>
                         </div>
                         <p className="text-white/50 text-base md:text-lg font-light leading-relaxed group-hover:text-white/70 transition-colors">{s.desc}</p>
                       </div>
                       <div className="h-[1px] w-0 bg-[#f8c8c4]/40 group-hover:w-full transition-all duration-1000 mt-12"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <GlassDivider />

            {/* --- REVIEWS (CAROUSEL) --- */}
            <section id="reviews" className="py-40 bg-[#060d18] relative overflow-hidden">
              <div className="container mx-auto px-8 md:px-16">
                <div className="text-center mb-24">
                  <span className="tagline mb-8 block">{t.reviewsTitle}</span>
                  <h2 className="heading-serif text-4xl md:text-6xl text-white">Confiança em<br/><span className="italic opacity-60 text-[#f8c8c4]">cada detalhe</span></h2>
                </div>
              </div>

              <div className="container mx-auto px-8 md:px-16 relative">
                <div className="max-w-5xl mx-auto relative group">
                  <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-16 z-30">
                    <button onClick={prevReview} className="w-12 h-12 md:w-16 md:h-16 rounded-full glass-nav border border-white/5 flex items-center justify-center text-[#f8c8c4] hover:bg-[#f8c8c4] hover:text-[#081221] transition-all shadow-2xl active:scale-90">
                      <ChevronLeft size={24} strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-16 z-30">
                    <button onClick={nextReview} className="w-12 h-12 md:w-16 md:h-16 rounded-full glass-nav border border-white/5 flex items-center justify-center text-[#f8c8c4] hover:bg-[#f8c8c4] hover:text-[#081221] transition-all shadow-2xl active:scale-90">
                      <ChevronRight size={24} strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="overflow-hidden relative px-2 py-8">
                    <motion.div className="flex gap-0" animate={{ x: `-${currentReviewIndex * 100}%` }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                      {reviews.map((r, idx) => (
                        <div key={r.id} className="w-full flex-shrink-0 px-4 md:px-8">
                          <ReviewCard r={r} link={googleMapsLink} />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                  <div className="flex justify-center gap-4 mt-12">
                    {reviews.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentReviewIndex(idx)} className={`h-1 transition-all duration-500 rounded-full ${currentReviewIndex === idx ? 'w-12 bg-[#f8c8c4]' : 'w-4 bg-white/10 hover:bg-white/20'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <GlassDivider />

            {/* --- PARTNERS --- */}
            <section id="partners" className="py-40 bg-[#081221] relative overflow-hidden">
              <div className="container mx-auto px-8 md:px-16 mb-24 text-center">
                <span className="tagline mb-8 block">{t.partnersTitle}</span>
              </div>
              <div className="relative w-full overflow-hidden py-4 flex">
                <motion.div className="flex whitespace-nowrap" animate={{ x: [0, "-50%"] }} transition={{ ease: "linear", duration: 50, repeat: Infinity }} whileHover={{ animationPlayState: "paused" }}>
                  <div className="flex">
                    {partners.map((p) => <PartnerCard p={p} key={`p1-${p.id}`} />)}
                  </div>
                  <div className="flex">
                    {partners.map((p) => <PartnerCard p={p} key={`p2-${p.id}`} />)}
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        ) : view === 'about' ? (
          <motion.div key="about-view" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8 }} className="pt-48 pb-64 relative">
            <div className="container mx-auto px-8 md:px-16 relative z-10">
               <button onClick={() => setView('home')} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 hover:text-[#f8c8c4] transition-all mb-16 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform"/> {t.back}
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-48">
                <div>
                  <span className="tagline mb-8 block">{t.aboutSectionTitle}</span>
                  <h2 className="heading-serif text-5xl md:text-8xl text-white mb-12 leading-none uppercase">
                    SOBRE<br/><span className="italic text-[#f8c8c4]/60 font-light">Rosimeire</span>
                  </h2>
                  <div className="space-y-8">
                    <p className="text-xl font-light text-white/60 leading-relaxed max-w-xl">{t.aboutSectionText}</p>
                    <div className="h-[1px] w-32 bg-[#f8c8c4]/20"></div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#f8c8c4]/5 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                  <img src={sectionImages.about} className="w-full h-[650px] object-cover rounded-sm border border-white/5 relative z-10 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-48">
                <motion.div whileHover={{ y: -10 }} className="crystal-card p-16 rounded-sm space-y-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target size={120} />
                  </div>
                  <div className="flex items-center gap-6 text-[#f8c8c4]">
                    <Target size={32} strokeWidth={1} />
                    <h3 className="text-3xl font-light tracking-tighter uppercase">{t.missionTitle}</h3>
                  </div>
                  <p className="text-white/50 leading-loose text-xl font-light italic">{t.missionText}</p>
                </motion.div>
                <motion.div whileHover={{ y: -10 }} className="crystal-card p-16 rounded-sm space-y-10 relative overflow-hidden group border-[#f8c8c4]/10">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Eye size={120} />
                  </div>
                  <div className="flex items-center gap-6 text-[#f8c8c4]">
                    <Eye size={32} strokeWidth={1} />
                    <h3 className="text-3xl font-light tracking-tighter uppercase">{t.visionTitle}</h3>
                  </div>
                  <p className="text-white/50 leading-loose text-xl font-light italic">{t.visionText}</p>
                </motion.div>
              </div>
              <div className="space-y-32">
                <div className="text-center">
                  <span className="tagline block mb-6">Nossos Pilares</span>
                  <h3 className="heading-serif text-6xl md:text-8xl text-white uppercase">{t.valuesTitle}</h3>
                  <div className="w-24 h-[1px] bg-[#f8c8c4]/40 mx-auto mt-12"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
                  {[
                    { title: t.val1, icon: <Heart size={28} /> },
                    { title: t.val2, icon: <Sparkle size={28} /> },
                    { title: t.val3, icon: <ShieldCheck size={28} /> },
                    { title: t.val4, icon: <MessageSquare size={28} /> },
                    { title: t.val5, icon: <Flame size={28} /> }
                  ].map((val, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="flex flex-col items-center text-center space-y-8 group cursor-default">
                      <div className="w-20 h-20 border border-white/5 rounded-full flex items-center justify-center text-[#f8c8c4]/30 group-hover:bg-[#f8c8c4] group-hover:text-[#081221] group-hover:scale-110 transition-all duration-700 shadow-xl">
                        {val.icon}
                      </div>
                      <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/30 group-hover:text-[#f8c8c4] transition-colors leading-relaxed px-4">{val.title}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : view === 'careers' ? (
          <motion.div key="careers-view" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8 }} className="pt-48 pb-64 relative">
            <div className="container mx-auto px-8 md:px-16 relative z-10">
               <button onClick={() => setView('home')} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 hover:text-[#f8c8c4] transition-all mb-16 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform"/> {t.back}
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-48">
                <div>
                  <span className="tagline mb-8 block">{t.careersTitle}</span>
                  <h2 className="heading-serif text-5xl md:text-8xl text-white mb-12 uppercase leading-none">
                    {t.careersHeroTitle.split(' ').slice(0, 2).join(' ')}<br/>
                    <span className="italic text-[#f8c8c4]/60 font-light">{t.careersHeroTitle.split(' ').slice(2).join(' ')}</span>
                  </h2>
                  <p className="text-xl font-light text-white/40 leading-relaxed max-w-xl italic mb-12">"{t.careersHeroSubtitle}"</p>
                  <a href={t.careersFormLink} target="_blank" rel="noopener noreferrer" className="btn-serenity inline-flex items-center gap-4 group">
                    {t.careersApplyBtn} <ExternalLink size={14} className="group-hover:translate-x-2 transition-transform" />
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#f8c8c4]/10 rounded-full blur-[100px]" />
                  <img src={sectionImages.careers} alt="Careers at Rosimeire Serviços" className="w-full h-[600px] object-cover rounded-sm border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl" />
                </div>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mb-48 crystal-card p-12 md:p-16 rounded-sm border-l-4 border-l-[#f8c8c4]/60 bg-white/[0.03] backdrop-blur-3xl">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="w-16 h-16 rounded-full bg-[#f8c8c4]/10 flex items-center justify-center text-[#f8c8c4] flex-shrink-0"><MapPin size={32} /></div>
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold tracking-[0.5em] text-[#f8c8c4] uppercase">{t.careersAdvisoryTitle}</h4>
                    <div className="text-lg font-light text-white/60 leading-relaxed italic">
                      {lang === 'PT' ? (
                        <p>No momento estamos a recrutar apenas os candidatos do <a href="https://pt.wikipedia.org/wiki/Distrito_de_Faro" target="_blank" rel="noopener noreferrer" className="text-white/90 underline decoration-[#f8c8c4]/30 hover:text-[#f8c8c4] transition-all">Distrito de Faro</a> que, possam se locomover em meios de transporte públicos ou próprio, nosso foco de recrutamento está sendo o <a href="https://pt.wikipedia.org/wiki/Loul%C3%A9" target="_blank" rel="noopener noreferrer" className="text-white/90 underline decoration-[#f8c8c4]/30 hover:text-[#f8c8c4] transition-all">Conselho de Loulé</a>, tendo em vista que nossa sede está situada na <a href="https://pt.wikipedia.org/wiki/Quarteira" target="_blank" rel="noopener noreferrer" className="text-white/90 underline decoration-[#f8c8c4]/30 hover:text-[#f8c8c4] transition-all">Freguesia de Quarteira</a>, para essa Freguesia, conseguimos oferecer carrinhas para transportar, em alguns casos aos, nossos pontos de encontro.</p>
                      ) : (
                        <p>{t.careersAdvisoryText}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="mb-48">
                <div className="text-center mb-24">
                  <span className="tagline block mb-4">O que oferecemos</span>
                  <h3 className="heading-serif text-4xl md:text-6xl text-white uppercase">{t.careersWhyTitle}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { title: t.careersAdv1, desc: t.careersAdv1Desc, icon: <Award size={32} /> },
                    { title: t.careersAdv2, desc: t.careersAdv2Desc, icon: <Users size={32} /> },
                    { title: t.careersAdv3, desc: t.careersAdv3Desc, icon: <Briefcase size={32} /> }
                  ].map((adv, idx) => (
                    <motion.div key={idx} whileHover={{ y: -10 }} className="crystal-card p-12 rounded-sm space-y-8 group border-white/5">
                      <div className="text-[#f8c8c4]/40 group-hover:text-[#f8c8c4] transition-colors">{adv.icon}</div>
                      <div className="space-y-4">
                        <h4 className="text-xl font-bold tracking-tight text-white uppercase">{adv.title}</h4>
                        <p className="text-white/40 text-sm leading-relaxed">{adv.desc}</p>
                      </div>
                      <div className="h-[1px] w-0 bg-[#f8c8c4]/40 group-hover:w-full transition-all duration-1000" />
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="crystal-card p-16 md:p-32 rounded-sm text-center space-y-12 border-[#f8c8c4]/10 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#f8c8c4]/5 blur-[120px] rounded-full -translate-y-1/2" />
                <div className="relative z-10 space-y-8">
                  <h3 className="heading-serif text-5xl md:text-7xl text-white">{t.careersApplyTitle}</h3>
                  <p className="text-xl font-light text-white/40 max-w-2xl mx-auto">{t.careersApplyDesc}</p>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-8">
                    <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-[#f8c8c4] uppercase"><Check size={16} /> Flexibilidade</div>
                    <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-[#f8c8c4] uppercase"><Check size={16} /> Profissionalismo</div>
                    <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-[#f8c8c4] uppercase"><Check size={16} /> Rigor</div>
                  </div>
                  <div className="pt-12"><a href={t.careersFormLink} target="_blank" rel="noopener noreferrer" className="btn-serenity px-16 py-6 group inline-flex items-center gap-4">{t.careersApplyBtn} <ExternalLink size={14} className="group-hover:translate-x-2 transition-transform" /></a></div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="contact-view" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.8, ease: "circOut" }} className="pt-48 pb-64">
            <div className="container mx-auto px-8 md:px-16">
              <button onClick={() => setView('home')} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 hover:text-[#f8c8c4] transition-all mb-16 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform"/> {t.back}
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
                <div className="space-y-16">
                  <div>
                    <span className="tagline mb-8 block">{t.quoteTitle}</span>
                    <h2 className="heading-serif text-5xl md:text-8xl text-white mb-12 tracking-tighter leading-none">Rosimeire<br/><span className="text-[#f8c8c4]/60 italic">Serviços</span></h2>
                    <div className="space-y-12">
                      <div className="flex items-start gap-8 group">
                        <div className="w-14 h-14 border border-white/5 rounded-full flex items-center justify-center text-[#f8c8c4]/40 group-hover:bg-[#f8c8c4] group-hover:text-[#081221] transition-all flex-shrink-0"><MapPin size={24}/></div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase">{t.addressTitle}</p>
                          <p className="text-xl font-light text-white/60 leading-relaxed max-sm">{t.addressDetail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 group">
                        <div className="w-14 h-14 border border-white/5 rounded-full flex items-center justify-center text-[#f8c8c4]/40 group-hover:bg-[#f8c8c4] group-hover:text-[#081221] transition-all flex-shrink-0"><Mail size={24}/></div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase">Email</p>
                           <p className="text-xl font-light text-white/40 group-hover:text-white transition-colors">atendimento@rosimeireservicos.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 group">
                        <div className="w-14 h-14 border border-white/5 rounded-full flex items-center justify-center text-[#f8c8c4]/40 group-hover:bg-[#f8c8c4] group-hover:text-[#081221] transition-all flex-shrink-0"><Phone size={24}/></div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase">{t.phone}</p>
                           <p className="text-xl font-light text-white/40 group-hover:text-white transition-colors">+351 912 525 649</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[500px] crystal-card overflow-hidden rounded-sm shadow-2xl relative border-[#f8c8c4]/10 group/map">
                    <iframe title="Rosimeire Serviços Location" src="https://www.google.com/maps?q=Rosimeire%20Servi%C3%A7os&output=embed&hl=pt-BR&z=14" width="100%" height="100%" style={{ border: 0, filter: 'brightness(1.0)' }} allowFullScreen={true} loading="lazy" />
                    <div className="absolute top-5 left-5 z-20 pointer-events-auto">
                      <div className="bg-white/95 backdrop-blur-sm p-5 shadow-2xl rounded-sm border border-gray-200 min-w-[240px] transition-transform hover:scale-[1.02] cursor-default">
                        <div className="flex justify-between items-start mb-1"><h4 className="text-gray-900 font-bold text-sm leading-tight">Rosimeire Serviços</h4></div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-gray-700 text-xs font-bold">4.8</span>
                          <div className="flex text-yellow-400"><Star key={0} size={12} fill="currentColor" stroke="none" /><Star key={1} size={12} fill="currentColor" stroke="none" /><Star key={2} size={12} fill="currentColor" stroke="none" /><Star key={3} size={12} fill="currentColor" stroke="none" /><Star key={4} size={12} fill="currentColor" stroke="none" className="opacity-40" /></div>
                          <span className="text-blue-600 text-[11px] font-medium">(22)</span>
                        </div>
                        <p className="text-gray-500 text-[11px] mb-3">Empresa de limpeza em Quarteira</p>
                        <div className="flex border-t border-gray-100 pt-3 gap-4">
                          <a href="https://www.google.com/maps?q=Rosimeire+Servi%C3%A7os+&si=AMgyJEs9DArPE9xmb5yVYVjpG4jqWDEKSIpCRSjmm88XZWnGNakrDl7qyiJLF74BYlGsMcE9Da1nUDIZ5DNa9RlMSKMI70hspYaTqbBEPz7oFQkgC81_ZMtEKchYDA-1FddJnX-cdUqx" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><ExternalLink size={14} /></div>
                            <span className="text-blue-600 text-[9px] font-bold uppercase tracking-tighter">Ver no Google</span>
                          </a>
                          <a href="https://maps.app.goo.gl/EEd76dbxeRv8kYos9?g_st=ac" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><MapPin size={14} /></div>
                            <span className="text-blue-600 text-[9px] font-bold uppercase tracking-tighter">Como chegar</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="crystal-card p-12 md:p-24 rounded-sm border-[#f8c8c4]/10">
                    <form onSubmit={handleContactSubmit} className="space-y-16">
                      <div className="space-y-2 group"><label className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20 group-focus-within:text-[#f8c8c4] transition-colors">{t.name}</label><input required type="text" className="w-full bg-transparent border-b border-white/10 py-6 text-2xl font-light outline-none focus:border-[#f8c8c4] transition-all" /></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-2 group"><label className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20 group-focus-within:text-[#f8c8c4] transition-colors">{t.email}</label><input required type="email" className="w-full bg-transparent border-b border-white/10 py-6 text-2xl font-light outline-none focus:border-[#f8c8c4] transition-all" /></div>
                        <div className="space-y-2 group"><label className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20 group-focus-within:text-[#f8c8c4] transition-colors">{t.phone}</label><input required type="tel" className="w-full bg-transparent border-b border-white/10 py-6 text-2xl font-light outline-none focus:border-[#f8c8c4] transition-all" /></div>
                      </div>
                      <div className="space-y-6 group"><label className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20 group-focus-within:text-[#f8c8c4] transition-colors block">{t.message}</label><textarea required rows={5} className="w-full bg-transparent border-b border-white/10 py-6 text-2xl font-light outline-none focus:border-[#f8c8c4] transition-all resize-none" /></div>
                      <button disabled={formStatus !== 'idle'} className={`w-full py-12 rounded-sm font-bold text-[12px] uppercase tracking-[0.8em] transition-all relative overflow-hidden group shadow-xl ${formStatus === 'success' ? 'bg-green-900 text-white' : 'btn-serenity'}`}><span className="relative z-10">{formStatus === 'idle' ? t.send : formStatus === 'sending' ? "..." : "✓ " + t.success}</span>{formStatus === 'idle' && <motion.div className="absolute inset-0 bg-[#f8c8c4] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />}</button>
                    </form>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassDivider />

      {/* --- FOOTER --- */}
      <footer className="py-24 bg-[#040911] border-t border-white/5">
        <div className="container mx-auto px-8 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
            <div className="text-left">
              <div className="flex items-center gap-4 mb-8"><h5 className="text-white font-light tracking-[0.4em] text-lg uppercase">ROSIMEIRE SERVIÇOS</h5></div>
              <p className="text-[10px] font-bold tracking-[0.5em] text-white/20 uppercase max-w-xs">{t.footerNote}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 md:gap-24">
              <div className="flex flex-col gap-6">
                <p className="text-[9px] font-black tracking-[0.3em] text-[#f8c8c4]/40 uppercase mb-2">Empresa</p>
                <button onClick={() => setView('about')} className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-[#f8c8c4] transition-colors text-left">{t.footerSobre}</button>
                <button onClick={() => setView('careers')} className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-[#f8c8c4] transition-colors text-left">{t.footerCarreira}</button>
              </div>
              <div className="flex flex-col gap-6">
                <p className="text-[9px] font-black tracking-[0.3em] text-[#f8c8c4]/40 uppercase mb-2">Social</p>
                <a href="https://instagram.com/rosimeireservicos" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-[#f8c8c4] transition-colors">Instagram</a>
                <a href="https://pt.linkedin.com/company/rosimeireservicos" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-[#f8c8c4] transition-colors">LinkedIn</a>
              </div>
              <div className="flex flex-col gap-6">
                <p className="text-[9px] font-black tracking-[0.3em] text-[#f8c8c4]/40 uppercase mb-2">Região</p>
                <a href="https://pt.wikipedia.org/wiki/Algarve" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-[#f8c8c4] transition-colors">Algarve</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/5 gap-8">
            <p className="text-[9px] font-bold tracking-[0.4em] text-white/10 uppercase italic">© 2025. Rosimeire Serviços - IT Department.</p>
            <div className="text-center md:text-right">
              <p className="text-[8px] font-bold tracking-[0.4em] text-white/10 uppercase mb-1">{t.developedBy}</p>
              <p className="text-[10px] font-black tracking-[0.2em] text-[#f8c8c4]/40 uppercase">Bob Harrisson Gracindo Madeiro</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);