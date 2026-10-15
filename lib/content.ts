export const business = {
  name: 'BEAUTI BOX',
  phone: null as string | null,
  email: null as string | null,
  address: 'Studio address to be added',
  hours: 'Opening hours to be added',
  instagram: null as string | null,
  whatsappNumber: null as string | null,
};
export const categories = ['Hair Treatments', 'Skin Care', 'Beauty & Makeup', 'Bridal Services', 'Wellness & Care'] as const;
export const team = [{ role: 'HAIR & STYLING', src: 'team-1.jpg' }, { role: 'SKIN & BEAUTY', src: 'team-2.jpg' }, { role: 'MAKEUP & OCCASIONS', src: 'team-3.jpg' }];
export type Category = typeof categories[number];
export const categoryCopy: Record<Category, string> = {
  'Hair Treatments': 'A fresh perspective on your everyday style. Discover cuts, care and finishing touches that let your personality shine.',
  'Skin Care': 'A little time for yourself. Explore thoughtful facial rituals that leave your skin feeling cared for, comfortable and refreshed.',
  'Beauty & Makeup': 'From a subtle glow to a statement look, make space for a beauty experience that feels completely your own.',
  'Bridal Services': 'Your day, your vision. Explore considered beauty preparations and a personal approach to your celebration.',
  'Wellness & Care': 'Slow down and reconnect. Gentle care rituals designed around a welcome moment of rest in your day.',
};
export type Service = { title: string; category: Category; description: string; duration: number; price: number };
export const services: Service[] = [
  { title: 'Signature Haircut', category: 'Hair Treatments', description: 'A personal consultation, precision cut and a finish that feels like you.', duration: 60, price: 900 },
  { title: 'Deep Conditioning', category: 'Hair Treatments', description: 'A nourishing hair ritual with a gentle cleanse and conditioning mask.', duration: 45, price: 1500 },
  { title: 'Wash & Blow-dry', category: 'Hair Treatments', description: 'A refreshing cleanse and considered styling for an effortless finish.', duration: 45, price: 700 },
  { title: 'Glow Facial', category: 'Skin Care', description: 'A cleansing and hydrating facial ritual, tailored during your consultation.', duration: 60, price: 1800 },
  { title: 'Deep Hydration Facial', category: 'Skin Care', description: 'Comforting care for skin that needs a moment of replenishment.', duration: 60, price: 2200 },
  { title: 'Express Skin Refresh', category: 'Skin Care', description: 'A focused cleanse and refreshing mask for a little everyday radiance.', duration: 30, price: 1000 },
  { title: 'Soft Glam Makeup', category: 'Beauty & Makeup', description: 'Soft definition and a luminous finish, created around your occasion.', duration: 60, price: 3000 },
  { title: 'Evening Makeup', category: 'Beauty & Makeup', description: 'Expressive eyes and a beautifully balanced finish for your evening.', duration: 75, price: 4000 },
  { title: 'Bridal Consultation', category: 'Bridal Services', description: 'Share your inspiration and explore a personal plan for your wedding look.', duration: 45, price: 1000 },
  { title: 'Bridal Makeup Trial', category: 'Bridal Services', description: 'Time to discover and refine a look that feels right for your celebration.', duration: 120, price: 5000 },
  { title: 'Scalp Care Ritual', category: 'Wellness & Care', description: 'A soothing scalp massage and gentle hair care for an unhurried pause.', duration: 45, price: 1200 },
  { title: 'Hand & Foot Care', category: 'Wellness & Care', description: 'A simple care ritual with a soak, grooming and a considered finish.', duration: 60, price: 1400 },
];
export const gallery = [
  { src: 'beauti-box-studio.png', title: 'THE BEAUTI BOX STUDIO', caption: 'Actual studio · Supplied photograph', className: 'gallery-actual' },
  { src: 'interior.jpg', title: 'A MOMENT OF CALM', caption: 'Illustrative atmosphere', className: 'gallery-interior' },
  { src: 'relaxation.jpg', title: 'SPACE TO UNWIND', caption: 'Illustrative atmosphere', className: 'gallery-relaxation' },
  { src: 'hair.jpg', title: 'THE FINISHING TOUCH', caption: 'Illustrative treatment', className: 'gallery-detail' },
  { src: 'wellness.jpg', title: 'TIME FOR YOURSELF', caption: 'Illustrative treatment', className: 'gallery-wellness' },
];
