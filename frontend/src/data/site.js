// ===== ISI/UBAH DI SINI: teks situs & link =====
export const site = {
  studio: 'CREATIVE DIGITAL STUDIO',
  title: 'PORTFOLIO SHOWCASE',
  navName: 'MUHAMMAD IBNU AKBAR',
  aboutBadge: 'About',
  about: 'A university student who enjoys exploring design and technology, from visual design and UI/UX to web development. Always learning, creating, and experimenting with new ideas.',
  tagline: 'Learn and create new things with ideas.',
  primaryButton: { label: 'Lihat Semua Proyek', href: '#projects' },
  // Taruh file CV Anda di frontend/public/assets/files/cv.pdf (atau ubah path ini).
  cvButton: { label: 'Unduh CV / Pitch Deck', href: '/assets/files/cv.pdf' },
  footerName: 'MUHAMMAD IBNU AKBAR',
  footerTagline: 'Art direction, spatial UI & experimental frontend engineering. Available\nfor select global commissions.',
  copyright: '©Ibnu VISUALS. ALL RIGHTS RESERVED.',
};

// ===== ISI DI SINI: media sosial =====
// Isi `url` dengan link profil Anda. Yang masih kosong tampil nonaktif (tidak bisa diklik).
// `handle` = teks yang tampil (mis. "@ibnuakbar"). Ikon bisa diganti di public/assets/icons/social/<id>.svg
export const socials = [
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@ibnuakbar_15?is_from_webapp=1&sender_device=pc', handle: '@ibnuakbar_15' },
  { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/6285835695375', handle: '+62 858-3569-5475' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/ibnuakbar_4/', handle: '@ibnuakbar_4' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ibnuakbar15', handle: 'Ibnu Akbar' },
];
export const socialsSection = {
  title: 'SOCIAL MEDIA',
  subtitle: "Let's connect and create something together.",
};

// ===== NAVIGASI (bar mengambang di bawah). Ubah label/urutan di sini; id harus sama dengan id section di halaman. =====
export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Social', href: '#connect' },
];
