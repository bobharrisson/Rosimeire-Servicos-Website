import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Menu, X, Home, Building2, Paintbrush, Gem, Mail, Phone, ArrowRight,
  Shield, Wind, Sparkle, Settings, ExternalLink, Bell, Lock, User, Info,
  Star, CheckCircle2, Briefcase, MapPin, ArrowLeft, Globe, Target, Eye, 
  Heart, ShieldCheck, MessageSquare, Flame, Award, Users, Check,
  ChevronLeft, ChevronRight, Save, RotateCcw, Server, Cloud, CloudOff, RefreshCw, Loader2,
  Instagram, Linkedin, Code, Zap
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
    s2Desc: "Serviços de limpeza diária ou periódica adaptados à rotina da sua casa. Oferecemos o apoio de equipas dedicadas para a gestão do seu santuário pessoal, atuando com a máxima discrição, zelo e regularidade.",
    s3Title: "Detalhe de Precisão",
    s3Tagline: "Foco absoluto nos pormenores and acabamentos.",
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
    aboutSectionText: "A Rosimeire Serviços iniciou o seu percurso em 2011, fruto da visão e dedicação da sua fundadora, Rosimeire Silva. Atuando inicialmente de forma independente em propriedades exclusivas, o seu rigor técnico, honestidade e um perfeicionismo inabalável tornaram-se a sua assinatura de marca. Esta postura de excelência permitiu fidelizar uma carteira de clientes de prestígio, consolidando os alicerces que impulsionaram o crescimento e a solidez que a empresa apresenta hoje.",
    missionTitle: "Missão", missionText: "Satisfazer o cliente deixando sua propriedade impecavelmente limpa, conforme sua necessidade.",
    visionTitle: "Visão", visionText: "Brevemente nossos serviços serão disponibilizados em outros países da europa, com o mesmo padrão de qualidade que atendemos atualmente em Portugal, para nossos diferentes tipos de clientes.",
    valuesTitle: "Valores",
    val1: "Empatia com os clientes", val2: "Qualidade", val3: "Integridade e Honestidade", val4: "Abertura e Respecto", val5: "Coragem",
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
    servicesDescription: "Nos dedicamos a la preservación y el cuidado de su propriedade con un rigor inigualável. A través de un servicio de limpeza profesional de alto nivel, nuestros técnicos especializados aseguran que cada detalle de su inmueble sea tratado con la máxima pericia, garantizando un ambiente absolutamente inmaculado. Combinamos la excelencia técnica con una política de transparencia e valor justo, ofreciéndole la seguridad de un patrimonio impecablemente mantenido, siempre que lo necesite.",
    s1Title: "Alojamientos y Unidades Turísticas",
    s1Tagline: "Higienização rigorosa para a rotatividade do setor.",
    s1Desc: "Especialistas en la preparación de alojamientos locales, hostales y unidades hoteleras. Garantizamos una limpieza profunda e eficiente entre estadias, aseguran que cada nuevo huésped encuentre un inmueble con estándares de limpieza impecables.",
    s2Title: "Residencias Particulares e Diarias",
    s2Tagline: "Mantenimiento personalizado y asistencia de confianza.",
    s2Desc: "Servicios de limpeza diaria o periódica adaptados a la rutina de su hogar. Ofrecemos el apoyo de equipos dedicados para la gestión de su santuario personal, actuando con la máxima discreción, celo y regularidad.",
    s3Title: "Detalle de Precisão",
    s3Tagline: "Enfoque absoluto en los pormenores y acabados.",
    s3Desc: "Un servicio de limpieza minucioso que va más allá de lo esencial. Intervenimos en los detalles más exigentes y de difícil acceso, garantizando un nivel de perfección y frescura que transforma completamente el ambiente.",
    s4Title: "Limpezas Post-Obra",
    s4Tagline: "Finalización técnica para entrega de espacios listos para habitar.",
    s4Desc: "Eliminación profunda de polvos y residuos de construcción en chalets, restaurantes o tiendas. Transformamos o escenario de obra em um ambiente limpo e acolhedor, garantindo uma transição perfecta para la utilización final.",
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
    careersAdv3: "Reconhecimento", careersAdv3Desc: "Oportunidades de crescimento no Algarve.",
    careersApplyTitle: "Aplica Hoy",
    careersApplyDesc: "Si eres una persona dedicada, puntual y con ojo para o detalhe, queremos conocerte.",
    careersApplyBtn: "Completar Formulario de Candidatura",
    careersFormLink: "https://docs.google.com/forms/d/e/1FAIpQLSdo6NUZsw3gcZhigbPrAafa1zb32hgjQi67dDkEKEEByc1rHg/viewform?usp=sf_link"
  }
};

const DEFAULT_SLIDES: Slide[] = [
  { 
    id: '1', title: "SERENIDADE & RIGOR", 
    description: "Cuidamos da sua casa para que você possa apenas sentir o momento.", 
    image: "https://images.unsplash.com/photo-1600607687940-4e7a6a353d2c?auto=format&fit=crop&q=80&w=1600",
    tag: "A ESSÊNCIA",
    buttonLink: "contact",
    buttonText: "MARCAR AGORA"
  },
  { 
    id: '2', title: "DETALHES ESSENCIAIS", 
    description: "Uma casa limpa é um refúgio para a alma. Nossa curadoria é invisível, mas sentida.", 
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600",
    tag: "O CUIDADO",
    buttonLink: "about",
    buttonText: "CONHECER EQUIPA"
  }
];

const DEFAULT_SECTION_IMAGES: SectionImages = {
  about: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
  careers: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&q=80&w=1200"
};

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  instagram: "#",
  linkedin: "#"
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
const FIXED_GAS_URL = "https://script.google.com/macros/s/AKfycbzsOBqT_YLZW576jbHX8vAcuBi4bSNhn4CYdqTwcu7ObX6QcqNIhjXlsOYxlud9nqy6/exec";
const SIR_URL = "https://sir.rosimeireservicos.com"; // Placeholder para o sistema integrado

// --- Components ---
const InitialLoader = () => (
  <motion.div 
    initial={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    className="fixed inset-0 z-[2000] bg-[#081221] flex flex-col items-center justify-center gap-8"
  >
    <div className="flex flex-col items-center">
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-light tracking-[0.4em] text-white uppercase"
      >
        ROSIMEIRE
      </motion.span>
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-[10px] font-bold tracking-[0.6em] text-[#f8c8c4] uppercase mt-2"
      >
        SERVIÇOS
      </motion.span>
    </div>
    <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f8c8c4] to-transparent"
      />
    </div>
  </motion.div>
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [cloudStatus, setCloudStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const STORAGE_KEY_PREFIX = 'rosimeire_config_v12';

  // --- Base State Initialization ---
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [sectionImages, setSectionImages] = useState<SectionImages>(DEFAULT_SECTION_IMAGES);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(DEFAULT_EMAIL_CONFIG);
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);
  const [googleMapsLink, setGoogleMapsLink] = useState<string>(INITIAL_GOOGLE_MAPS_LINK);
  const [gasUrl, setGasUrl] = useState<string>(FIXED_GAS_URL);

  // --- Cloud Sync Implementation ---
  const fetchFromCloud = async (url: string) => {
    if (!url) return;
    setCloudStatus('loading');
    try {
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();
      
      if (data && data.slides) {
        setSlides(data.slides);
        setSectionImages(data.sectionImages || DEFAULT_SECTION_IMAGES);
        setSocialLinks(data.socialLinks || DEFAULT_SOCIAL_LINKS);
        setEmailConfig(data.emailConfig || DEFAULT_EMAIL_CONFIG);
        setNotices(data.notices || DEFAULT_NOTICES);
        setReviews(data.reviews || DEFAULT_REVIEWS);
        setPartners(data.partners || DEFAULT_PARTNERS);
        setGoogleMapsLink(data.googleMapsLink || INITIAL_GOOGLE_MAPS_LINK);
        setCloudStatus('connected');
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro ao sincronizar com nuvem:", err);
      setCloudStatus('error');
      return false;
    }
  };

  const publishToCloud = async (url: string) => {
    if (!url) return;
    setIsSyncing(true);
    setCloudStatus('loading');
    try {
      const payload = {
        slides, 
        sectionImages, 
        socialLinks, 
        emailConfig, 
        notices, 
        reviews, 
        partners, 
        googleMapsLink,
        version: "1.2",
        lastSync: new Date().toISOString()
      };
      
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      
      setCloudStatus('connected');
      setTimeout(() => setIsSyncing(false), 2000);
      return true;
    } catch (err) {
      console.error("Erro ao publicar:", err);
      setCloudStatus('error');
      setIsSyncing(false);
      return false;
    }
  };

  // --- Initial Load Sequence ---
  useEffect(() => {
    const initApp = async () => {
      const localSlides = localStorage.getItem(`${STORAGE_KEY_PREFIX}_slides`);
      let hasLocalData = false;

      if (localSlides) {
        setSlides(JSON.parse(localSlides));
        setSectionImages(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}_section_images`) || JSON.stringify(DEFAULT_SECTION_IMAGES)));
        setSocialLinks(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}_social_links`) || JSON.stringify(DEFAULT_SOCIAL_LINKS)));
        setEmailConfig(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}_email_config`) || JSON.stringify(DEFAULT_EMAIL_CONFIG)));
        setNotices(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}_notices`) || JSON.stringify(DEFAULT_NOTICES)));
        setReviews(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}_reviews`) || JSON.stringify(DEFAULT_REVIEWS)));
        setPartners(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}_partners`) || JSON.stringify(DEFAULT_PARTNERS)));
        setGoogleMapsLink(localStorage.getItem(`${STORAGE_KEY_PREFIX}_maps`) || INITIAL_GOOGLE_MAPS_LINK);
        hasLocalData = true;
      }

      if (hasLocalData) {
        setTimeout(() => setIsInitialLoading(false), 800);
      }

      fetchFromCloud(FIXED_GAS_URL).then(success => {
        if (!hasLocalData) {
          setIsInitialLoading(false);
        }
      });
    };

    initApp();
  }, []);

  useEffect(() => {
    if (!isInitialLoading) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_slides`, JSON.stringify(slides));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_section_images`, JSON.stringify(sectionImages));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_social_links`, JSON.stringify(socialLinks));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_email_config`, JSON.stringify(emailConfig));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_notices`, JSON.stringify(notices));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_reviews`, JSON.stringify(reviews));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_partners`, JSON.stringify(partners));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_maps`, googleMapsLink);
    }
  }, [slides, sectionImages, socialLinks, emailConfig, notices, reviews, partners, googleMapsLink, isInitialLoading]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const t = translations[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(p => (p + 1) % (slides.length || 1));
    }, 9000);
    return () => clearInterval(interval);
  }, [slides, currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (reviews.length > 0) {
        setCurrentReviewIndex(prev => (prev + 1) % reviews.length);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [reviews]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (partners.length > 0) {
        setCurrentPartnerIndex(p => (p + 1) % partners.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [partners]);

  const handleNextSlide = () => setCurrentSlide(p => (p + 1) % (slides.length || 1));
  const handlePrevSlide = () => setCurrentSlide(p => (p - 1 + slides.length) % (slides.length || 1));

  const handleNextPartner = () => setCurrentPartnerIndex(p => (p + 1) % partners.length);
  const handlePrevPartner = () => setCurrentPartnerIndex(p => (p - 1 + partners.length) % partners.length);

  const handleResetDefaults = () => {
    if (confirm("Tem certeza que deseja apagar todas as personalizações locais?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleHeroButtonClick = (link?: string) => {
    if (!link) {
      setView('contact');
      return;
    }
    
    const internalViews: View[] = ['home', 'contact', 'about', 'careers'];
    if (internalViews.includes(link as View)) {
      setView(link as View);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else if (link.startsWith('#')) {
      const el = document.querySelector(link);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setView('contact');
    }
  };

  useEffect(() => { window.scrollTo(0, 0); }, [view]);

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
    } else setLoginError(true);
  };

  const handleDemoAccess = () => {
    setUsername('admin');
    setPassword('rosimeire2025');
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    setIsAdminOpen(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen selection:bg-[#f8c8c4] selection:text-[#081221]">
      <AnimatePresence>
        {isInitialLoading && <InitialLoader />}
      </AnimatePresence>
      
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
            >
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Bell size={18} strokeWidth={2.5} />
              </motion.div>
              <span className="text-[10px] md:text-[11px] font-black tracking-[0.3em] uppercase text-center leading-tight">{notice.text}</span>
            </motion.button>
          ))}
        </AnimatePresence>

        <header className={`transition-all duration-500 ${isMenuOpen ? 'bg-transparent border-transparent' : 'glass-nav border-b border-white/5 shadow-2xl'}`}>
          <div className="px-8 md:px-16 py-4 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
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
              <button onClick={() => setView('contact')} className={`btn-serenity !py-2 !px-6 ${view === 'contact' ? 'bg-[#f8c8c4] text-[#081221]' : ''}`}>
                {t.navContact}
              </button>
              <div className="w-[1px] h-3 bg-white/5"></div>
              
              {/* Botão SIR - Acesso do Colaborador */}
              <button 
                onClick={() => window.open(SIR_URL, '_blank')}
                className="group flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-white/30 hover:text-[#f8c8c4] transition-all"
              >
                <Zap size={12} className="group-hover:scale-110 transition-transform"/> SIR
              </button>

              <button onClick={handleAdminAccess} className={`transition-colors ${isAuthenticated ? 'text-[#f8c8c4]' : 'text-white/20 hover:text-[#f8c8c4]'}`}>
                <Settings size={14} />
              </button>
            </div>
            
            <button className={`lg:hidden relative z-[1100] transition-colors duration-300 ${isMenuOpen ? 'text-[#f8c8c4]' : 'text-white/60'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[1050] bg-[#081221] pt-32 px-12 pb-24 flex flex-col justify-between"
          >
            <nav className="flex flex-col gap-10">
              {[
                { label: t.navHome, view: 'home' },
                { label: t.footerSobre, view: 'about' },
                { label: t.footerCarreira, view: 'careers' },
                { label: t.navContact, view: 'contact' }
              ].map((item) => (
                <button 
                  key={item.view} 
                  onClick={() => { setView(item.view as View); setIsMenuOpen(false); }}
                  className="text-left text-3xl font-light tracking-[0.2em] text-white/80 hover:text-[#f8c8c4] uppercase"
                >
                  {item.label}
                </button>
              ))}
              
              {/* SIR Link no Mobile */}
              <button 
                onClick={() => window.open(SIR_URL, '_blank')}
                className="text-left text-sm font-black tracking-[0.4em] text-[#f8c8c4]/40 hover:text-[#f8c8c4] uppercase flex items-center gap-3 pt-6 border-t border-white/5"
              >
                <Zap size={16}/> ACESSO SIR (COLABORADORES)
              </button>
            </nav>

            <div className="flex flex-col gap-8">
              <div className="flex gap-8">
                {['PT', 'EN', 'ES'].map(l => (
                  <button key={l} onClick={() => setLang(l as Language)} className={`text-xs font-bold tracking-widest ${lang === l ? 'text-[#f8c8c4]' : 'text-white/20'}`}>{l}</button>
                ))}
              </div>
              <button onClick={handleAdminAccess} className="flex items-center gap-4 text-xs font-bold tracking-widest text-white/20 uppercase">
                <Settings size={16} /> Painel Administrativo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isInitialLoading && view === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* HERO Section */}
            <section id="home" className="min-h-screen h-screen relative flex overflow-hidden group/hero">
               <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0">
                   <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slides[currentSlide]?.image})` }} />
                   <div className="absolute inset-0 bg-gradient-to-r from-[#081221] via-[#081221]/60 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-10 z-20 pointer-events-none">
                <button onClick={handlePrevSlide} className="p-4 text-white/20 hover:text-[#f8c8c4] transition-all transform hover:scale-125 pointer-events-auto opacity-0 group-hover/hero:opacity-100"><ChevronLeft size={48} strokeWidth={1} /></button>
                <button onClick={handleNextSlide} className="p-4 text-white/20 hover:text-[#f8c8c4] transition-all transform hover:scale-125 pointer-events-auto opacity-0 group-hover/hero:opacity-100"><ChevronRight size={48} strokeWidth={1} /></button>
              </div>

              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                {slides.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-[2px] transition-all duration-700 ${idx === currentSlide ? 'w-12 bg-[#f8c8c4]' : 'w-6 bg-white/20 hover:bg-white/40'}`} />
                ))}
              </div>

              <div className="container mx-auto px-8 md:px-32 lg:px-64 relative z-10 flex flex-col justify-center h-full pt-32">
                <motion.div key={`c-${currentSlide}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col max-w-4xl text-left">
                  <span className="tagline tagline-hero mb-3 block">{slides[currentSlide]?.tag}</span>
                  <h1 className="heading-serif text-4xl md:text-6xl lg:text-[5.5rem] text-white mb-5 leading-[1.1] uppercase tracking-tighter">
                    {slides[currentSlide]?.title.split(' ')[0]}<br/>
                    <span className="italic font-light opacity-60 text-[#f8c8c4]">{slides[currentSlide]?.title.split(' ').slice(1).join(' ')}</span>
                  </h1>
                  <p className="text-xs md:text-lg font-light text-white/50 max-w-lg leading-relaxed mb-8">{slides[currentSlide]?.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-8 items-start sm:items-center">
                    <button 
                      onClick={() => handleHeroButtonClick(slides[currentSlide]?.buttonLink)} 
                      className="btn-serenity !px-8 !py-3"
                    >
                      {slides[currentSlide]?.buttonText || t.navContact}
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            <GlassDivider />

            {/* SERVICES Section */}
            <section id="services" className="py-32 md:py-64 relative">
              <div className="container mx-auto px-8 md:px-16">
                <div className="flex flex-col md:flex-row justify-between items-start mb-32 gap-16 md:gap-24">
                   <div className="max-w-3xl">
                     <span className="tagline mb-10 block text-sm md:text-base">{t.servicesTitle}</span>
                     <h2 className="heading-serif text-6xl md:text-[9rem] text-white leading-none">{t.servicesSubtitle}</h2>
                   </div>
                   <div className="space-y-10 max-w-2xl pt-6">
                     <p className="text-white/60 text-lg md:text-2xl font-light leading-relaxed tracking-wide">{t.servicesDescription}</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                  {[
                    { title: t.s1Title, tagline: t.s1Tagline, desc: t.s1Desc, icon: <Building2 size={32}/> },
                    { title: t.s2Title, tagline: t.s2Tagline, desc: t.s2Desc, icon: <Home size={32}/> },
                    { title: t.s3Title, tagline: t.s3Tagline, desc: t.s3Desc, icon: <Sparkle size={32}/> },
                    { title: t.s4Title, tagline: t.s4Tagline, desc: t.s4Desc, icon: <Paintbrush size={32}/> }
                  ].map((s, idx) => (
                    <div key={idx} className="crystal-card p-14 rounded-sm group flex flex-col justify-between h-auto min-h-[500px]">
                       <div className="space-y-10">
                         <div className="text-[#f8c8c4]/60 group-hover:scale-110 transition-transform duration-700">{s.icon}</div>
                         <h3 className="text-3xl md:text-4xl font-light text-white tracking-tighter uppercase leading-tight">{s.title}</h3>
                         <p className="text-[#f8c8c4]/80 text-[11px] font-bold uppercase tracking-[0.4em] leading-relaxed italic">{s.tagline}</p>
                         <p className="text-white/50 text-base font-light leading-relaxed">{s.desc}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <GlassDivider />

            {/* REVIEWS Section */}
            {reviews.length > 0 && (
              <section id="reviews" className="py-32 md:py-64 relative overflow-hidden">
                <div className="container mx-auto px-8 md:px-16 text-center">
                  <span className="tagline mb-12 block">{t.reviewsTitle}</span>
                  <div className="max-w-5xl mx-auto relative px-12">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={currentReviewIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center gap-12"
                      >
                        <div className="relative group">
                          {reviews[currentReviewIndex].avatar ? (
                            <img src={reviews[currentReviewIndex].avatar} className="w-24 h-24 rounded-full object-cover border-2 border-[#f8c8c4]/30" />
                          ) : (
                            <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl" style={{ backgroundColor: reviews[currentReviewIndex].color }}>
                              {reviews[currentReviewIndex].initials}
                            </div>
                          )}
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-xl flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} fill="#f8c8c4" stroke="#f8c8c4" />
                            ))}
                          </div>
                        </div>
                        <p className="text-2xl md:text-4xl font-light text-white leading-relaxed italic opacity-80 tracking-wide">
                          "{reviews[currentReviewIndex].text}"
                        </p>
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold uppercase tracking-[0.2em] text-white">{reviews[currentReviewIndex].author}</h4>
                          <p className="text-[10px] font-bold tracking-[0.4em] text-[#f8c8c4] uppercase">{reviews[currentReviewIndex].time}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    
                    <div className="flex justify-center gap-12 mt-16">
                       <button onClick={() => setCurrentReviewIndex(p => (p - 1 + reviews.length) % reviews.length)} className="text-white/20 hover:text-[#f8c8c4] transition-colors"><ChevronLeft size={32}/></button>
                       <button onClick={() => setCurrentReviewIndex(p => (p + 1) % reviews.length)} className="text-white/20 hover:text-[#f8c8c4] transition-colors"><ChevronRight size={32}/></button>
                    </div>

                    {googleMapsLink && (
                      <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 mt-16 text-[9px] font-black uppercase tracking-[0.5em] text-white/30 hover:text-[#f8c8c4] transition-all group">
                        Ver todas no Google <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform"/>
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}

            <GlassDivider />

            {/* PARTNERS Section - CARROSSEL "SHOWCASE" PROPORCIONAL (TAMANHO REDUZIDO) */}
            {partners.length > 0 && (
              <section id="partners" className="py-32 md:py-64 relative bg-[#040911]/30">
                <div className="container mx-auto px-8 md:px-16 text-center">
                  <span className="tagline mb-24 block">{t.partnersTitle}</span>
                  
                  <div className="relative max-w-3xl mx-auto flex items-center">
                    {/* Botões de Navegação Manual */}
                    <button 
                      onClick={handlePrevPartner} 
                      className="absolute -left-4 md:-left-28 z-30 p-4 text-white/10 hover:text-[#f8c8c4] transition-all transform hover:scale-125"
                    >
                      <ChevronLeft size={64} strokeWidth={1} />
                    </button>
                    
                    <button 
                      onClick={handleNextPartner} 
                      className="absolute -right-4 md:-right-28 z-30 p-4 text-white/10 hover:text-[#f8c8c4] transition-all transform hover:scale-125"
                    >
                      <ChevronRight size={64} strokeWidth={1} />
                    </button>

                    <div className="w-full overflow-hidden px-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentPartnerIndex}
                          initial={{ opacity: 0, scale: 0.98, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.98, x: -20 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="flex justify-center"
                        >
                          <a 
                            href={partners[currentPartnerIndex].url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="crystal-card p-0 rounded-sm flex flex-col overflow-hidden group max-w-xl w-full border-[#f8c8c4]/10 shadow-2xl"
                          >
                            {/* Contentor de Imagem com escala reduzida e preenchimento total */}
                            <div className="w-full h-48 md:h-72 relative overflow-hidden bg-white/[0.02]">
                              <img 
                                src={partners[currentPartnerIndex].logo} 
                                alt={partners[currentPartnerIndex].name} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 brightness-110 group-hover:brightness-100 group-hover:scale-110" 
                              />
                              {/* Overlay sofisticado */}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#081221]/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                            </div>
                            
                            {/* Nome e Detalhe Inferior - Proporção reduzida */}
                            <div className="p-6 md:p-8 text-center space-y-4 border-t border-white/5 bg-[#081221]/60 backdrop-blur-md">
                              <h4 className="text-lg md:text-xl font-light text-white tracking-[0.3em] uppercase transition-all duration-500 group-hover:text-[#f8c8c4] group-hover:tracking-[0.4em]">{partners[currentPartnerIndex].name}</h4>
                              <div className="w-12 h-[1px] bg-[#f8c8c4]/20 mx-auto transition-all duration-700 group-hover:w-32 group-hover:bg-[#f8c8c4]" />
                            </div>
                          </a>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Indicadores de Carrossel - Reduzidos proporcionalmente */}
                  <div className="flex justify-center gap-3 mt-12">
                    {partners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPartnerIndex(idx)}
                        className={`h-[1px] transition-all duration-700 ${idx === currentPartnerIndex ? 'w-16 bg-[#f8c8c4]' : 'w-4 bg-white/10 hover:bg-white/30'}`}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </motion.div>
        )}

        {view === 'about' && (
          <motion.div key="about" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="pt-48 pb-64">
             <div className="container mx-auto px-8 md:px-16">
               <button onClick={() => setView('home')} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 hover:text-[#f8c8c4] transition-all mb-16 group"><ArrowLeft size={16} /> {t.back}</button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div>
                  <span className="tagline mb-8 block">{t.aboutSectionTitle}</span>
                  <h2 className="heading-serif text-5xl md:text-8xl text-white mb-12 uppercase leading-none">SOBRE<br/><span className="italic text-[#f8c8c4]/60 font-light">Rosimeire</span></h2>
                  <p className="text-xl font-light text-white/60 leading-relaxed max-w-xl">{t.aboutSectionText}</p>
                </div>
                <img src={sectionImages.about} className="w-full h-[600px] object-cover rounded-sm border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl" />
              </div>
            </div>
          </motion.div>
        )}

        {view === 'careers' && (
          <motion.div key="careers" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="pt-48 pb-64">
            <div className="container mx-auto px-8 md:px-16">
               <button onClick={() => setView('home')} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 hover:text-[#f8c8c4] transition-all mb-16 group"><ArrowLeft size={16} /> {t.back}</button>
              <h2 className="heading-serif text-5xl md:text-8xl text-white mb-12 uppercase leading-none">{t.careersHeroTitle}</h2>
              <div className="relative mb-24">
                <img src={sectionImages.careers} className="w-full h-[500px] object-cover rounded-sm border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div className="crystal-card p-16 rounded-sm text-center">
                 <h3 className="heading-serif text-4xl mb-8">{t.careersApplyTitle}</h3>
                 <a href={t.careersFormLink} target="_blank" rel="noopener noreferrer" className="btn-serenity inline-flex items-center gap-4">{t.careersApplyBtn} <ExternalLink size={14}/></a>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'contact' && (
          <motion.div key="contact" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="pt-48 pb-64">
            <div className="container mx-auto px-8 md:px-16">
              <button onClick={() => setView('home')} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 hover:text-[#f8c8c4] transition-all mb-16 group"><ArrowLeft size={16} /> {t.back}</button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                <div className="space-y-12">
                   <h2 className="heading-serif text-6xl text-white">{t.quoteTitle}</h2>
                   <div className="space-y-8">
                     <div className="flex items-start gap-6">
                       <MapPin className="text-[#f8c8c4]/40" />
                       <p className="text-xl font-light text-white/60">{t.addressDetail}</p>
                     </div>
                     <div className="flex items-start gap-6">
                       <Mail className="text-[#f8c8c4]/40" />
                       <p className="text-xl font-light text-white/60">atendimento@rosimeireservicos.com</p>
                     </div>
                   </div>
                </div>
                <div className="crystal-card p-12 rounded-sm">
                  <form onSubmit={handleContactSubmit} className="space-y-12">
                    <div className="space-y-2">
                      <label className="tagline block">{t.name}</label>
                      <input required className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-light outline-none focus:border-[#f8c8c4] transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-2">
                        <label className="tagline block">{t.email}</label>
                        <input type="email" required className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-light outline-none focus:border-[#f8c8c4] transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="tagline block">{t.phone}</label>
                        <input type="tel" required className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-light outline-none focus:border-[#f8c8c4] transition-all" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="tagline block">{t.message}</label>
                      <textarea required rows={4} className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-light outline-none focus:border-[#f8c8c4] transition-all" />
                    </div>
                    
                    <button className="w-full btn-serenity py-8">
                      {formStatus === 'idle' ? t.send : (formStatus === 'sending' ? '...' : t.success)}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminPanel 
        isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} onLogout={() => { setIsAuthenticated(false); setIsAdminOpen(false); }}
        slides={slides} setSlides={setSlides}
        sectionImages={sectionImages} setSectionImages={setSectionImages}
        socialLinks={socialLinks} setSocialLinks={setSocialLinks}
        emailConfig={emailConfig} setEmailConfig={setEmailConfig}
        notices={notices} setNotices={setNotices} reviews={reviews} setReviews={setReviews}
        partners={partners} setPartners={setPartners}
        googleMapsLink={googleMapsLink} setGoogleMapsLink={setGoogleMapsLink}
        activeTab={activeAdminTab} setActiveTab={setActiveAdminTab} t={t}
        isSyncing={isSyncing} onResetDefaults={handleResetDefaults}
        gasUrl={gasUrl} setGasUrl={setGasUrl} onPublishToCloud={() => publishToCloud(gasUrl)}
        cloudStatus={cloudStatus}
      />

      <AnimatePresence>
        {isLoginOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1200] flex items-center justify-center bg-[#081221]/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="crystal-card p-12 max-w-sm w-full">
              <h3 className="heading-serif text-2xl text-center mb-8 uppercase tracking-widest">Acesso Restrito</h3>
              <form onSubmit={handleLogin} className="space-y-6">
                <input placeholder="Utilizador" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded outline-none text-sm placeholder:text-white/20" />
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded outline-none text-sm placeholder:text-white/20" />
                <button type="submit" className="w-full btn-serenity flex items-center justify-center gap-3"><Lock size={12}/> Entrar</button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                <button 
                  onClick={handleDemoAccess} 
                  className="w-full py-3 border border-dashed border-[#f8c8c4]/30 text-[9px] font-black tracking-[0.4em] uppercase text-[#f8c8c4] hover:bg-[#f8c8c4]/5 transition-all flex items-center justify-center gap-3"
                >
                  <Zap size={10}/> Acesso DEMO
                </button>
                <button onClick={() => setIsLoginOpen(false)} className="w-full text-[9px] font-bold tracking-[0.3em] text-white/20 uppercase hover:text-white/40 transition-colors">Cancelar</button>
              </div>

              {loginError && <p className="text-red-400 text-[10px] font-bold text-center mt-6 uppercase tracking-widest">Credenciais incorretas.</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-24 bg-[#040911] border-t border-white/5">
        <div className="container mx-auto px-8 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
            <div className="text-left">
              <h5 className="text-white font-light tracking-[0.4em] text-lg mb-8 uppercase">ROSIMEIRE SERVIÇOS</h5>
              <p className="text-[10px] font-bold tracking-[0.5em] text-white/20 uppercase max-w-xs">{t.footerNote}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-24">
              <div className="flex flex-col gap-6">
                <div className="flex gap-6">
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[#f8c8c4] transition-all transform hover:scale-110 active:scale-95"><Instagram size={20} /></a>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[#f8c8c4] transition-all transform hover:scale-110 active:scale-95"><Linkedin size={20} /></a>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <button onClick={() => setView('about')} className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-[#f8c8c4] transition-colors text-left">{t.footerSobre}</button>
                <button onClick={() => setView('careers')} className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-[#f8c8c4] transition-colors text-left">{t.footerCarreira}</button>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-bold tracking-[0.4em] text-white/10 uppercase italic">© 2025. Rosimeire Serviços - Algarve.</p>
            
            {/* Assinatura do Desenvolvedor */}
            <div className="flex items-center gap-5 text-white/10 group cursor-default">
              <div className="flex flex-col text-right">
                <span className="text-[7px] font-black tracking-[0.3em] uppercase text-white/20 mb-1">{t.developedBy}</span>
                <span className="text-[9px] font-bold tracking-[0.1em] text-white/40 uppercase group-hover:text-[#f8c8c4] transition-colors">Bob Harrisson Gracindo Madeiro</span>
                <span className="text-[7px] font-medium tracking-[0.4em] text-[#f8c8c4]/30 uppercase italic">IT Depart.</span>
              </div>
              <div className="w-[1px] h-8 bg-white/5 group-hover:bg-[#f8c8c4]/20 transition-colors"></div>
              <div className="p-2.5 border border-white/5 rounded-sm group-hover:border-[#f8c8c4]/30 transition-all duration-500">
                <Code size={14} className="group-hover:text-[#f8c8c4] transition-colors opacity-30 group-hover:opacity-100" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);