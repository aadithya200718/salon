'use client';

import Image from 'next/image';
import DitherArtwork from './DitherArtwork';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, Expand, Menu, Plus, X } from 'lucide-react';
import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { business, categories, Category, categoryCopy, gallery, Service, services, team } from '@/lib/content';

const imagePath = (name: string) => `/images/${name}`;
const navItems = [['About Us', '#about'], ['Services', '#services'], ['Gallery', '#gallery'], ['Contact', '#contact']];
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function BracketLabel({ children }: { children: ReactNode }) { return <span className="bracket-label"><i aria-hidden="true" /><span>{children}</span></span>; }

function Logo({ footer = false }: { footer?: boolean }) {
  return <a className={`brand ${footer ? 'brand-footer' : ''}`} href="#home" aria-label="BEAUTI BOX home"><Image src={imagePath('beauti-box-logo.png')} width={52} height={52} alt="Original BEAUTI BOX orange logo" /><span>BEAUTI BOX<small>BEAUTY STUDIO</small></span></a>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!open) return; const close = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); menuButton.current?.focus(); } }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, [open]);
  return <header className="site-header"><Logo /><nav className="desktop-nav" aria-label="Main navigation">{navItems.map(([name, href]) => <a key={href} href={href}>{name}</a>)}</nav><a href="#appointment" className="button nav-book">Book an Appointment <ArrowUpRight size={14} /></a><button ref={menuButton} className="mobile-menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X size={18} /> : <Menu size={18} />}<span>{open ? 'Close' : 'Menu'}</span></button><AnimatePresence>{open && <motion.nav initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">{navItems.map(([name, href], index) => <a key={href} href={href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{name}<ArrowUpRight size={22} /></a>)}<a href="#appointment" className="mobile-book" onClick={() => setOpen(false)}>Book an Appointment <ArrowUpRight size={22} /></a><p>BEAUTI BOX · CONCEPT PREVIEW</p></motion.nav>}</AnimatePresence></header>;
}

function Hero() {
  const reduced = useReducedMotion();
  return <section className="hero" id="home" aria-label="BEAUTI BOX beauty studio"><DitherArtwork name="electric-gaze" /><div className="hero-shade" /><Navbar /><motion.div className="hero-content" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}><div className="hero-intro"><p>Your beauty, our passion.</p><a href="#appointment" className="text-link light">Book an Appointment <ArrowUpRight size={20} /></a></div><div className="hero-meta"><span>BEAUTI BOX</span><span className="concept-mark">CONCEPT PREVIEW</span></div><h1>BEAUTY SALON</h1><div className="hero-bottom"><span>A LITTLE TIME. ALL YOURS.</span><a href="#about" aria-label="Discover BEAUTI BOX"><ArrowDown size={18} /></a><span>CARE / BEAUTY / CONFIDENCE</span></div></motion.div></section>;
}

function About() {
  return <section id="about" className="about section-pad"><Reveal><h2 className="statement">WE <BracketLabel>ABOUT US</BracketLabel> CREATE<br className="desktop-break" /> BEAUTIFUL MOMENTS<br className="desktop-break" /> THAT MAKE YOU FEEL<br className="desktop-break" /> YOUR <BracketLabel>BEAUTI BOX</BracketLabel> BEST.</h2><p className="center-copy">A space for beauty, care, and a little time for yourself. Discover BEAUTI BOX — thoughtful hair, skin and beauty experiences, shaped around the way you want to feel.</p><a className="text-link" href="#gallery">Discover our studio <ArrowUpRight size={18} /></a></Reveal></section>;
}

function ServiceOverview({ select }: { select: (category: Category | 'All') => void }) {
  const tiles: { title: Category; image: string; detail: string }[] = [{ title: 'Skin Care', image: 'skin.jpg', detail: 'A fresh start for your skin' }, { title: 'Wellness & Care', image: 'wellness.jpg', detail: 'Your moment of calm' }, { title: 'Hair Treatments', image: 'hair.jpg', detail: 'Care from root to tip' }];
  return <section className="service-overview section-pad"><Reveal><div className="section-topline"><span>01 / THE BEAUTY MENU</span><span>THOUGHTFUL CARE. PERSONAL TO YOU.</span></div><h2 className="section-heading">OUR SERVICES</h2><div className="overview-grid">{tiles.map(tile => <a key={tile.title} className="overview-tile" href="#services" onClick={() => select(tile.title)}><Image src={imagePath(tile.image)} alt={`${tile.title} — illustrative photography`} fill sizes="(max-width: 600px) 90vw, 32vw" /><div><h3>{tile.title}</h3><p>{tile.detail}</p></div><ArrowUpRight className="tile-arrow" size={22} /></a>)}</div><a className="text-link" href="#services" onClick={() => select('All')}>Explore all services <ArrowDown size={16} /></a></Reveal></section>;
}

function ServiceCard({ service, book }: { service: Service; book: (service: Service) => void }) {
  return <article className="service-card"><span className="card-category">{service.category}</span><h3>{service.title}</h3><div className="service-price">{money(service.price)} <span>sample</span></div><p>{service.description}</p><div className="service-card-bottom"><span><Clock3 size={13} /> {service.duration} min</span><button onClick={() => book(service)} aria-label={`Book ${service.title}`}>Book now <ArrowUpRight size={14} /></button></div></article>;
}

function Services({ active, setActive, book }: { active: Category | 'All'; setActive: (category: Category | 'All') => void; book: (service: Service) => void }) {
  const list = active === 'All' ? services : services.filter(service => service.category === active);
  return <section id="services" className="services section-pad"><Reveal><h2 className="section-heading">OUR <BracketLabel>THE MENU</BracketLabel> SERVICES</h2><div className="category-filters" role="group" aria-label="Filter services by category">{(['All', ...categories] as const).map((category, index) => <button key={category} className={active === category ? 'active' : ''} aria-pressed={active === category} onClick={() => setActive(category)}><span className="category-index">0{index + 1}</span><span>{category}</span><Plus size={17} /></button>)}</div><div className="service-intro"><h3>{active === 'All' ? 'BEAUTY, YOUR WAY.' : active}</h3><div><p>{active === 'All' ? 'Find your everyday ritual or make time for something special. Explore our sample beauty menu and choose the care that speaks to you.' : categoryCopy[active]}</p><p className="sample-note">Concept menu · All prices in INR are illustrative. Final services, duration and pricing will be confirmed by the studio.</p></div></div><div className="filter-status" role="status" aria-live="polite">{list.length} sample services · {active === 'All' ? 'All categories' : active}</div><div className="service-grid">{list.slice(0, 4).map(service => <ServiceCard key={service.title} service={service} book={book} />)}<div className="service-treatment"><Image src={imagePath(active === 'Hair Treatments' ? 'hair.jpg' : 'treatment.jpg')} alt="A considered beauty treatment — illustrative photograph" fill sizes="(max-width: 600px) 90vw, 50vw" /><span>CARE IS IN THE DETAILS.</span></div><div className="service-motif"><BracketLabel>MADE FOR<br />YOUR MOMENT</BracketLabel></div>{list.slice(4).map(service => <ServiceCard key={service.title} service={service} book={book} />)}{list.length < 5 && <div className="service-consult"><h3>NOT SURE WHERE<br />TO BEGIN?</h3><p>Start with a conversation. Tell us what you have in mind.</p><a href="#appointment" className="text-link">Let’s find your ritual <ArrowUpRight size={16} /></a></div>}</div></Reveal></section>;
}

function Experience() {
  return <><section className="experience section-pad"><Reveal><h2 className="statement">GOOD HAIR.<br />FRESH SKIN. <BracketLabel>THE FEELING</BracketLabel><br />A LITTLE MORE YOU.</h2><div className="experience-bottom"><span>02 / THE EXPERIENCE</span><p>Beauty is personal. From your first consultation to the finishing touch, this is time to slow down, explore your style, and enjoy being looked after.</p><a href="#appointment" className="text-link">Find your moment <ArrowUpRight size={18} /></a></div></Reveal></section><section className="story"><DitherArtwork name="ink-garden" lazy /><div className="story-shade" /><Reveal className="story-copy"><BracketLabel>BEAUTI BOX</BracketLabel><h2>MORE THAN<br />A BEAUTY<br />APPOINTMENT.</h2><p>A pause in your day. A fresh perspective. A place to express what beauty means to you.</p><p>Discover hair, skin and beauty care with room for conversation, inspiration, and your own individual style.</p><a href="#gallery" className="text-link light">Step into our space <ArrowUpRight size={18} /></a><small>Illustrative atmosphere · Explore the actual studio below</small></Reveal></section></>;
}

function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (selected === null) return;
    returnFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    const prior = returnFocus.current;
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') setSelected(value => value === null ? null : (value + 1) % gallery.length);
      if (event.key === 'ArrowLeft') setSelected(value => value === null ? null : (value + gallery.length - 1) % gallery.length);
      if (event.key === 'Tab') { const focusable = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button'); if (!focusable?.length) return; const first = focusable[0], last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', keydown); prior?.focus(); };
  }, [selected === null]);
  return <section id="gallery" className="gallery section-pad"><div className="section-topline"><span>03 / INSIDE BEAUTI BOX</span><span>A SPACE FOR YOURSELF.</span></div><div className="gallery-grid"><h2 className="gallery-title">OUR <BracketLabel>GALLERY</BracketLabel> SPACE</h2>{gallery.map((item, index) => <Reveal key={item.src} className={`gallery-item ${item.className}`}><button onClick={() => setSelected(index)} aria-label={`Enlarge ${item.title}`}><span className="gallery-image"><Image src={imagePath(item.src)} alt={`${item.title} — ${item.caption}`} fill sizes="(max-width: 600px) 90vw, 45vw" /></span><span className="gallery-caption"><strong>{item.title}</strong><Expand size={16} /></span><span className="gallery-disclosure">{item.caption}</span></button></Reveal>)}</div><div className="gallery-bottom"><p>The original BEAUTI BOX studio, alongside an illustrative mood for the experience.</p><a href="#appointment" className="button">Book an Appointment <ArrowUpRight size={18} /></a></div><AnimatePresence>{selected !== null && <motion.div className="lightbox-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}><div className="lightbox" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="lightbox-title"><button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close gallery"><X size={24} /></button><div className="lightbox-image"><Image src={imagePath(gallery[selected].src)} alt={gallery[selected].caption} fill sizes="90vw" style={{ objectFit: 'contain' }} /></div><div className="lightbox-details"><div><h3 id="lightbox-title">{gallery[selected].title}</h3><p>{gallery[selected].caption}</p></div><div className="lightbox-controls"><button aria-label="Previous photograph" onClick={() => setSelected((selected + gallery.length - 1) % gallery.length)}>←</button><span>{selected + 1} / {gallery.length}</span><button aria-label="Next photograph" onClick={() => setSelected((selected + 1) % gallery.length)}>→</button></div></div></div></motion.div>}</AnimatePresence></section>;
}

function Team() {
  return <section className="team section-pad"><Reveal><div className="section-topline"><span>04 / THE PEOPLE</span><span>PERSONAL CARE STARTS WITH CONNECTION.</span></div><h2 className="section-heading">THE HUMAN <BracketLabel>OUR TEAM</BracketLabel> TOUCH</h2><p className="team-intro">A place for the people behind your experience.<br />Meet the BEAUTI BOX team here when their profiles are ready.</p><div className="team-grid">{team.map((member, i) => <article key={member.role}><div className="team-photo"><Image src={imagePath(member.src)} alt={`Illustrative portrait for ${member.role.toLowerCase()} — demo profile`} fill sizes="(max-width:600px) 90vw, 32vw" /><span>DEMO PROFILE</span></div><div className="team-caption"><h3>{member.role}</h3><span>0{i + 1}</span></div><p>Team member details coming soon</p></article>)}</div></Reveal></section>;
}

type BookingData = { name: string; phone: string; category: string; date: string; time: string; notes: string };
const emptyBooking: BookingData = { name: '', phone: '', category: '', date: '', time: '', notes: '' };
function localToday() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; }
function AppointmentForm({ selectedService, requestId }: { selectedService: Service | null; requestId: number }) {
  const [data, setData] = useState<BookingData>(emptyBooking);
  const [step, setStep] = useState<'form' | 'review' | 'complete'>('form');
  const [errors, setErrors] = useState<Partial<BookingData>>({});
  const [today, setToday] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { setToday(localToday()); }, []);
  useEffect(() => { if (selectedService) { setData(value => ({ ...value, category: selectedService.category })); setStep('form'); } }, [selectedService, requestId]);
  function update(field: keyof BookingData, value: string) { setData(current => ({ ...current, [field]: value })); setErrors(current => ({ ...current, [field]: undefined })); }
  function review(event: FormEvent) {
    event.preventDefault();
    const next: Partial<BookingData> = {};
    if (data.name.trim().length < 2) next.name = 'Please enter your name (at least 2 characters).';
    if (!/^[+\d\s()-]{8,20}$/.test(data.phone.trim()) || data.phone.replace(/\D/g, '').length < 8) next.phone = 'Please enter a valid phone number.';
    if (!categories.includes(data.category as Category)) next.category = 'Please choose a service category.';
    if (!data.date || data.date < localToday()) next.date = 'Choose today or a future date.';
    if (!data.time) next.time = 'Please choose a preferred time.';
    setErrors(next);
    if (Object.keys(next).length) { requestAnimationFrame(() => document.getElementById(`booking-${Object.keys(next)[0]}`)?.focus()); return; }
    setStep('review'); requestAnimationFrame(() => heading.current?.focus());
  }
  const error = (name: keyof BookingData) => errors[name] ? <span className="field-error" id={`${name}-error`}>{errors[name]}</span> : null;
  return <div className="appointment-form" aria-live="polite">{step === 'complete' ? <div className="form-complete"><span className="complete-icon"><Check size={28} /></span><p className="eyebrow">DEMO COMPLETE</p><h3 ref={heading} tabIndex={-1}>YOUR MOMENT,<br />PREVIEWED.</h3><p>Thank you, {data.name.split(' ')[0]}. You’ve completed the appointment demo. Nothing has been sent to BEAUTI BOX and no appointment has been reserved.</p><p className="sample-note">A real booking connection will be added before launch.</p><button className="button" onClick={() => { setData(emptyBooking); setStep('form'); }}>Start a new preview <ArrowRight size={17} /></button></div> : step === 'review' ? <div className="booking-review"><p className="eyebrow">02 / REVIEW YOUR REQUEST</p><h3 ref={heading} tabIndex={-1}>LOOKING GOOD.</h3><p>Review your preferences before trying the simulated submission.</p><dl>{[['Name', data.name], ['Phone', data.phone], ['Category', data.category], ...(selectedService && selectedService.category === data.category ? [['Service', `${selectedService.title} · sample ${money(selectedService.price)}`]] : []), ['Preferred date', new Date(`${data.date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })], ['Preferred time', data.time], ['Notes', data.notes || 'None added']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="demo-note">Demo mode: submitting this preview sends no information and does not confirm a salon booking.</p><div className="review-actions"><button className="button" onClick={() => { setStep('complete'); requestAnimationFrame(() => heading.current?.focus()); }}>Simulate submission <ArrowRight size={18} /></button><button className="text-link" onClick={() => setStep('form')}>Edit details</button></div></div> : <form onSubmit={review} noValidate><div className="form-topline"><span>01 / YOUR PREFERENCES</span><span>DEMO BOOKING</span></div>{selectedService && selectedService.category === data.category && <p className="selected-service"><Check size={14} /> {selectedService.title} selected · sample {money(selectedService.price)}</p>}<div className="form-grid"><label htmlFor="booking-name">Your name <span>*</span><input id="booking-name" name="name" autoComplete="name" placeholder="Enter your full name" value={data.name} onChange={e => update('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} required />{error('name')}</label><label htmlFor="booking-phone">Phone number <span>*</span><input id="booking-phone" name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" value={data.phone} onChange={e => update('phone', e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} required />{error('phone')}</label><label className="full" htmlFor="booking-category">Service category <span>*</span><select id="booking-category" value={data.category} onChange={e => update('category', e.target.value)} aria-invalid={!!errors.category} aria-describedby={errors.category ? 'category-error' : undefined} required><option value="">Choose your experience</option>{categories.map(category => <option key={category}>{category}</option>)}</select>{error('category')}</label><label htmlFor="booking-date">Preferred date <span>*</span><input id="booking-date" type="date" min={today} value={data.date} onChange={e => update('date', e.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'date-error' : undefined} required />{error('date')}</label><label htmlFor="booking-time">Preferred time <span>*</span><select id="booking-time" value={data.time} onChange={e => update('time', e.target.value)} aria-invalid={!!errors.time} aria-describedby={errors.time ? 'time-error' : undefined} required><option value="">Select a time</option>{['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map(time => <option key={time}>{time}</option>)}</select>{error('time')}</label><label className="full" htmlFor="booking-notes">Anything else? <span className="optional">(optional)</span><textarea id="booking-notes" placeholder="Tell us what you have in mind" rows={2} maxLength={1000} value={data.notes} onChange={e => update('notes', e.target.value)} /></label></div><p className="demo-note">This is a concept preview. Your details stay in this page; no appointment is sent or reserved. Times shown are sample preferences.</p><button className="button form-submit" type="submit">Review your appointment <ArrowRight size={18} /></button></form>}</div>;
}

function Booking({ selectedService, requestId }: { selectedService: Service | null; requestId: number }) {
  return <section id="appointment" className="booking"><div className="consultation-banner"><Image src={imagePath('skin.jpg')} alt="Softly lit beauty portrait — illustrative photography" fill sizes="(max-width: 800px) 100vw, 45vw" /><div className="consultation-shade" /><div className="consultation-copy"><BracketLabel>YOUR NEXT CHAPTER</BracketLabel><h2>A LITTLE TIME.<br />A BEAUTIFUL<br />DIFFERENCE.</h2><p>Not sure where to begin? Tell us what you have in mind. Your next beauty moment starts with a conversation.</p><a href="#booking-details" className="text-link light">Let’s make time for you <ArrowDown size={18} /></a></div></div><div className="booking-panel" id="booking-details"><div className="booking-heading"><span className="eyebrow">05 / YOUR MOMENT</span><h2>MAKE TIME<br />FOR <BracketLabel>BOOKING<br />PREVIEW</BracketLabel> YOU.</h2></div><AppointmentForm selectedService={selectedService} requestId={requestId} /></div></section>;
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  return sent ? <div className="contact-success" role="status"><Check size={25} /><h3>MESSAGE PREVIEWED.</h3><p>Thank you. This demo has not sent your message. Contact details will be connected before launch.</p><button className="text-link" onClick={() => setSent(false)}>Write another message <ArrowRight size={16} /></button></div> : <form className="contact-form" onSubmit={submit}><label htmlFor="contact-name">Full name *<input id="contact-name" name="name" autoComplete="name" placeholder="Enter your name" minLength={2} required /></label><label htmlFor="contact-email">Email *<input id="contact-email" name="email" type="email" autoComplete="email" placeholder="Enter your email" required /></label><label htmlFor="contact-message">Message *<textarea id="contact-message" name="message" placeholder="Say hello" minLength={5} maxLength={2000} rows={2} required /></label><div className="contact-form-bottom"><p>Demo form. No message will be sent.</p><button className="button" type="submit">Preview message <ArrowUpRight size={18} /></button></div></form>;
}

function Contact() {
  return <section id="contact" className="contact section-pad"><Reveal><div className="contact-grid"><div><h2>WE’D <BracketLabel>GET IN<br />TOUCH</BracketLabel><br />LOVE TO HEAR<br />FROM YOU.</h2><p className="contact-intro">A question, an idea, or a beauty moment in mind?<br />Let’s start a conversation.</p><div className="contact-data"><div><h3>VISIT US</h3><p>{business.address}</p></div><div><h3>OPENING HOURS</h3><p>{business.hours}</p></div><div><h3>CALL / EMAIL</h3><p>{business.phone ? <a href={`tel:${business.phone}`}>{business.phone}</a> : 'Phone to be added'}<br />{business.email ? <a href={`mailto:${business.email}`}>{business.email}</a> : 'Email to be added'}</p></div></div></div><ContactForm /></div></Reveal></section>;
}

function Footer({ select }: { select: (category: Category | 'All') => void }) {
  return <footer className="footer"><div className="footer-grid"><div className="footer-brand"><Logo footer /><p>Your beauty, our passion.<br />A little time. All yours.</p><span className="concept-mark">CONCEPT PREVIEW</span></div><div><h2>EXPLORE</h2>{navItems.map(([name, href]) => <a href={href} key={href}>{name}</a>)}</div><div><h2>YOUR BEAUTY MENU</h2>{categories.map(category => <a href="#services" key={category} onClick={() => select(category)}>{category}</a>)}</div><div><h2>LET’S CONNECT</h2>{business.instagram ? <a href={business.instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={12} /></a> : <span>Instagram coming soon</span>}{business.whatsappNumber ? <a href={`https://wa.me/${business.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">Book via WhatsApp <ArrowUpRight size={12} /></a> : <span>WhatsApp to be connected</span>}<a href="#appointment">Book an Appointment <ArrowUpRight size={12} /></a></div></div><div className="footer-wordmark" aria-hidden="true">BEAUTI BOX</div><div className="footer-bottom"><span>© {new Date().getFullYear()} BEAUTI BOX · Website concept</span><span>Illustrative services & imagery. Not an official booking site.</span><a href="#home">Back to top ↑</a></div></footer>;
}

export default function StudioSite() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingRequestId, setBookingRequestId] = useState(0);
  function book(service: Service) { setSelectedService(service); setBookingRequestId(value => value + 1); document.getElementById('appointment')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  return <><a className="skip-link" href="#main">Skip to content</a><main id="main"><Hero /><About /><ServiceOverview select={setActiveCategory} /><Services active={activeCategory} setActive={setActiveCategory} book={book} /><Experience /><Gallery /><Team /><Booking selectedService={selectedService} requestId={bookingRequestId} /><Contact /></main><Footer select={setActiveCategory} /></>;
}
