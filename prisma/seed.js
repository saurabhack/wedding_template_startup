const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ShubhVivah Database Seeding with Animated Templates...');

  // 1. Password Hashes
  const adminPassword = await bcrypt.hash('Admin@12345', 10);
  const hostPassword = await bcrypt.hash('Password@123', 10);

  // 2. Upsert Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shubhvivah.com' },
    update: {},
    create: {
      email: 'admin@shubhvivah.com',
      passwordHash: adminPassword,
      fullName: 'Vikramaditya Roy (Admin)',
      phone: '+91 98765 43210',
      role: 'ADMIN',
      emailVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    },
  });

  const demoHost = await prisma.user.upsert({
    where: { email: 'rohan@example.com' },
    update: {},
    create: {
      email: 'rohan@example.com',
      passwordHash: hostPassword,
      fullName: 'Rohan Singhania',
      phone: '+91 98234 56789',
      role: 'USER',
      emailVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    },
  });

  // 3. Subscription Plans
  const plans = [
    {
      planName: 'Shubh Starter',
      slug: 'starter',
      description: 'Perfect for intimate pre-wedding functions and digital saves-the-date.',
      price: 0,
      billingPeriod: 'one_time',
      features: [
        '1 Digital Invitation Microsite',
        'Up to 100 Guest RSVPs',
        'Standard Cultural Templates',
        'WhatsApp Click-to-Chat Link',
        'Standard Resolution Download',
      ],
      isActive: true,
    },
    {
      planName: 'Vivah Premium',
      slug: 'vivah-premium',
      description: 'The complete wedding experience with multi-event scheduling and guest segmentation.',
      price: 1499,
      billingPeriod: 'one_time',
      features: [
        'Unlimited Digital Invitations',
        'Unlimited Guest Tokens & RSVPs',
        'All 15 Animated Cultural Design Engines',
        'Multi-Event Itinerary with Google Maps',
        'Guest Personalization & RSVP Dietary Tracker',
        'Background Shehnai & Sitar Audio',
        '300 DPI Print-Ready PDF & WhatsApp Story Card',
        'Dynamic QR Codes for physical cards',
      ],
      isActive: true,
    },
    {
      planName: 'Royal Planner Edition',
      slug: 'royal-planner',
      description: 'Built for wedding planners, event management firms, and luxury multi-day destination weddings.',
      price: 4999,
      billingPeriod: 'monthly',
      features: [
        'Everything in Vivah Premium',
        'Multi-Project Client Switchboard',
        'Bulk CSV Guest Import & Export',
        'Dedicated OpenGraph Social Previews',
        'White-label Branding (No ShubhVivah watermark)',
        'Priority Phone & Concierge Support',
        'Custom Typography & Custom Font Uploads',
      ],
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }

  // 4. Cultural Categories
  const categoriesData = [
    {
      name: 'Royal Rajasthani',
      slug: 'royal-rajasthani',
      description: 'Regal heritage designs inspired by Rajput palaces, jharokha arches, and antique gold foils.',
      categoryImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
      displayOrder: 1,
    },
    {
      name: 'Traditional Hindu',
      slug: 'traditional-hindu',
      description: 'Sacred Sanskrit shlokas, auspicious kalash, lord Ganesha invocations, and vermillion borders.',
      categoryImage: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?w=600&auto=format&fit=crop&q=80',
      displayOrder: 2,
    },
    {
      name: 'South Indian Vivaham',
      slug: 'south-indian',
      description: 'Kanjeevaram crimson and temple gold, gopuram motifs, banana leaf accents, and jasmine garlands.',
      categoryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      displayOrder: 3,
    },
    {
      name: 'Punjabi Anand Karaj',
      slug: 'punjabi',
      description: 'Vibrant mustard yellows, phulkari embroidery textures, royal navy, and celebratory dhol motifs.',
      categoryImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=600&auto=format&fit=crop&q=80',
      displayOrder: 4,
    },
    {
      name: 'Muslim Nikah Mubarak',
      slug: 'muslim-nikah',
      description: 'Islamic arabesque geometric jaali patterns, emerald green, pristine cream, and Bismillah calligraphy.',
      categoryImage: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80',
      displayOrder: 5,
    },
    {
      name: 'Marathi Vivah',
      slug: 'marathi',
      description: 'Peshwai architectural borders, Paithani peacock artwork, and auspicious saffron-marigold garlands.',
      categoryImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&auto=format&fit=crop&q=80',
      displayOrder: 6,
    },
    {
      name: 'Gujarati Lagan',
      slug: 'gujarati',
      description: 'Bandhani tie-dye textures, festive dandiya beats, intricate rangoli patterns, and coral gold.',
      categoryImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
      displayOrder: 7,
    },
    {
      name: 'Bengali Biye',
      slug: 'bengali',
      description: 'Sacred red and ivory Shankha-Pola aesthetics, Topor motifs, and traditional Alpona floor art.',
      categoryImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80',
      displayOrder: 8,
    },
    {
      name: 'Christian Wedding',
      slug: 'christian',
      description: 'Timeless ivory, champagne tones, silver filigree, baroque monograms, and cathedral veil borders.',
      categoryImage: 'https://images.unsplash.com/photo-1519225424988-518ecda01fa6?w=600&auto=format&fit=crop&q=80',
      displayOrder: 9,
    },
    {
      name: 'Modern Luxury Pastel',
      slug: 'modern-pastel',
      description: 'Rose gold, blush pink, sage foliage, sophisticated editorial serifs, and soft marble textures.',
      categoryImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80',
      displayOrder: 10,
    },
    {
      name: 'Minimalist Chic',
      slug: 'minimalist',
      description: 'Understated elegance, high-contrast monochrome with antique brass accents, and serene whitespace.',
      categoryImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80',
      displayOrder: 11,
    },
    {
      name: 'Floral Romance',
      slug: 'floral-romance',
      description: 'Watercolor lotus blossoms, pastel peonies, hand-painted botanical greenery, and golden dewdrops.',
      categoryImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&auto=format&fit=crop&q=80',
      displayOrder: 12,
    },
    {
      name: 'Destination Wedding',
      slug: 'destination-wedding',
      description: 'Palace resort or beach sunset aesthetics, passport itinerary cards, and travel logistics styling.',
      categoryImage: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=600&auto=format&fit=crop&q=80',
      displayOrder: 13,
    },
    {
      name: 'Emerald Velvet & Gold',
      slug: 'emerald-gold',
      description: 'Deep jewel-tone emerald green paired with opulent chandelier filigree and antique gold borders.',
      categoryImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
      displayOrder: 14,
    },
    {
      name: 'Engagement & Roka',
      slug: 'engagement-roka',
      description: 'Romantic champagne sparkle, intertwining rings motif, starry evening glow, and pre-wedding bliss.',
      categoryImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&auto=format&fit=crop&q=80',
      displayOrder: 15,
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const saved = await prisma.templateCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = saved.id;
  }

  // 5. 15 Brand-New Animated Templates
  const animatedTemplates = [
    {
      categorySlug: 'royal-rajasthani',
      name: 'The Royal Jharokha 3D Unfold',
      slug: 'royal-jharokha-3d-unfold',
      description: 'Grand Rajput palace gates that swing open in 3D perspective with brass knockers, revealing royal parchment with falling crimson rose petals.',
      previewImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
      price: 1499,
      isPremium: true,
      designConfiguration: {
        themeId: 'royal-rajasthani',
        animationType: 'palace-doors',
        colors: {
          primary: '#800020',
          secondary: '#C9A44C',
          background: '#FFF9F0',
          surface: '#FDF5E6',
          accent: '#5A1024',
          text: '#2A1810',
          goldText: '#C9A44C',
        },
        typography: {
          display: 'Cinzel Decorative, serif',
          heading: 'Playfair Display, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Rozha One, serif',
        },
        culturalMotif: 'jharokha-elephant',
        audioTrack: 'shehnai-raag',
        defaultMantra: '॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
        borderStyle: 'ornate-gold-filigree',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'traditional-hindu',
      name: 'Celestial Mandala & Sacred Diya Glow',
      slug: 'celestial-mandala-sacred-diya',
      description: 'Mesmerizing counter-rotating sacred geometric mandalas with floating flickering earthen diyas and Vedic Sanskrit wedding shlokas.',
      previewImage: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?w=800&auto=format&fit=crop&q=80',
      price: 0,
      isPremium: false,
      designConfiguration: {
        themeId: 'traditional-hindu',
        animationType: 'rotating-mandala',
        colors: {
          primary: '#8B0000',
          secondary: '#DAA520',
          background: '#FFFDF9',
          surface: '#FBF4E6',
          accent: '#A52A2A',
          text: '#221100',
          goldText: '#B8860B',
        },
        typography: {
          display: 'Rozha One, serif',
          heading: 'Playfair Display, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Rozha One, serif',
        },
        culturalMotif: 'shree-ganesha-kalash',
        audioTrack: 'temple-veena',
        defaultMantra: '॥ ॐ श्री वरप्रदाय नमः ॥ मांगल्यं तन्तुनानेन मम जीवनहेतुना। कण्ठे बध्नामि शुभगे त्वं जीव शरदः शतम्॥',
        borderStyle: 'traditional-toran',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'south-indian',
      name: 'Thirumangalyam Bells & Jasmine Cascade',
      slug: 'thirumangalyam-bells-jasmine-cascade',
      description: 'Swinging brass temple bells with realistic harmonic oscillation, accompanied by a gentle shower of fresh fragrant white jasmine flowers.',
      previewImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      price: 1499,
      isPremium: true,
      designConfiguration: {
        themeId: 'south-indian',
        animationType: 'temple-bells',
        colors: {
          primary: '#780016',
          secondary: '#D4AF37',
          background: '#FEFDF8',
          surface: '#F7E7C4',
          accent: '#1B4D3E',
          text: '#2E1503',
          goldText: '#D4AF37',
        },
        typography: {
          display: 'Cinzel, serif',
          heading: 'Playfair Display, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Tiro Devanagari Hindi, serif',
        },
        culturalMotif: 'temple-gopuram-jasmine',
        audioTrack: 'nadaswaram-thavil',
        defaultMantra: '॥ சுப முகூர்த்தம் ॥ இறைவனின் திருவருளோடு நடைபெறும் மங்கலத் திருமணம்',
        borderStyle: 'kanjeevaram-zari',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'punjabi',
      name: 'Phulkari Beats & Marigold Shower',
      slug: 'phulkari-beats-marigold-shower',
      description: 'Vibrant celebratory Punjabi wedding card with falling marigold petals, rhythmic festive animations, and auspicious Anand Karaj blessings.',
      previewImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=800&auto=format&fit=crop&q=80',
      price: 0,
      isPremium: false,
      designConfiguration: {
        themeId: 'punjabi',
        animationType: 'marigold-shower',
        colors: {
          primary: '#E68A00',
          secondary: '#1A365D',
          background: '#FFFDF5',
          surface: '#FDF6E2',
          accent: '#8B0000',
          text: '#1C1917',
          goldText: '#D97706',
        },
        typography: {
          display: 'Playfair Display, serif',
          heading: 'Marcellus, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Cinzel, serif',
        },
        culturalMotif: 'ek-onkar-dhol',
        audioTrack: 'punjabi-shehnai',
        defaultMantra: 'ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥ ਹੋਵੈ ਪਰਵਾਣੁ ਕਰਣਾ ਕਿਰਤਾਰੁ ॥',
        borderStyle: 'phulkari-geometric',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'muslim-nikah',
      name: 'Noor-e-Nikah Emerald Starlight',
      slug: 'noor-e-nikah-emerald-starlight',
      description: 'Opulent emerald velvet canvas illuminated by gentle twinkling starlight particles, glowing golden crescent moon, and sacred Bismillah calligraphy.',
      previewImage: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80',
      price: 1499,
      isPremium: true,
      designConfiguration: {
        themeId: 'muslim-nikah',
        animationType: 'starry-sparkles',
        colors: {
          primary: '#0B3B24',
          secondary: '#D4AF37',
          background: '#F9FBF9',
          surface: '#EBF4EE',
          accent: '#062817',
          text: '#112217',
          goldText: '#C5A059',
        },
        typography: {
          display: 'Cinzel Decorative, serif',
          heading: 'Cormorant Garamond, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Playfair Display, serif',
        },
        culturalMotif: 'bismillah-crescent-lattice',
        audioTrack: 'sufi-flute',
        defaultMantra: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ॥ In the Name of Allah, the Most Gracious, the Most Merciful',
        borderStyle: 'islamic-arabesque',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'modern-pastel',
      name: 'Rose Gold Blossom & Petal Drift',
      slug: 'rose-gold-blossom-petal-drift',
      description: 'Chic modern Indian luxury with drifting watercolor pink rose petals, soft rose gold shimmer, and frosted glass aesthetic cards.',
      previewImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&auto=format&fit=crop&q=80',
      price: 1499,
      isPremium: true,
      designConfiguration: {
        themeId: 'modern-pastel',
        animationType: 'falling-petals',
        colors: {
          primary: '#854D58',
          secondary: '#B76E79',
          background: '#FFF9FA',
          surface: '#FDF1F3',
          accent: '#5E7153',
          text: '#2B1C1F',
          goldText: '#B76E79',
        },
        typography: {
          display: 'Playfair Display, serif',
          heading: 'Marcellus, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Playfair Display, serif',
        },
        culturalMotif: 'eucalyptus-rose-gold',
        audioTrack: 'acoustic-romantic',
        defaultMantra: 'Two souls with but a single thought, two hearts that beat as one.',
        borderStyle: 'delicate-botanical',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'engagement-roka',
      name: 'Bollywood Starry Night & Champagne Sparkle',
      slug: 'bollywood-starry-champagne-sparkle',
      description: 'Dazzling cocktail and sangeet invitation featuring twinkling starlight sparkles, champagne shimmer dust, and glamorous gold typography.',
      previewImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop&q=80',
      price: 0,
      isPremium: false,
      designConfiguration: {
        themeId: 'engagement-roka',
        animationType: 'starry-sparkles',
        colors: {
          primary: '#4A154B',
          secondary: '#E0A96D',
          background: '#FCFBFD',
          surface: '#F8EEF8',
          accent: '#C2185B',
          text: '#200521',
          goldText: '#E0A96D',
        },
        typography: {
          display: 'Playfair Display, serif',
          heading: 'Marcellus, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Playfair Display, serif',
        },
        culturalMotif: 'intertwined-diamond-rings',
        audioTrack: 'celebration-acoustic',
        defaultMantra: 'He asked, she said yes! Join us as we dance under the stars and celebrate.',
        borderStyle: 'starburst-sparkle',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'marathi',
      name: 'Peshwai Mor & Golden Dust Drift',
      slug: 'peshwai-mor-gold-dust',
      description: 'Honoring Maharashtrian heritage with rotating golden mandala rings, floating gold leaf particles, and Paithani peacock artwork.',
      previewImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
      price: 0,
      isPremium: false,
      designConfiguration: {
        themeId: 'marathi',
        animationType: 'gold-dust',
        colors: {
          primary: '#800020',
          secondary: '#E68A00',
          background: '#FFFDF8',
          surface: '#FFF5E5',
          accent: '#005F73',
          text: '#2B1704',
          goldText: '#CA8A04',
        },
        typography: {
          display: 'Rozha One, serif',
          heading: 'Playfair Display, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Rozha One, serif',
        },
        culturalMotif: 'paithani-peacock-kalash',
        audioTrack: 'shehnai-traditional',
        defaultMantra: '॥ ॐ श्री गणेशाय नमः ॥ सावधान! शुभमंगल सावधान! ॥',
        borderStyle: 'paithani-zari',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'gujarati',
      name: 'Rangat Bandhani & Festive Marigolds',
      slug: 'rangat-bandhani-festive-marigolds',
      description: 'Festive Gujarati Lagan invitation with cascading marigold petals, Bandhani pattern borders, and energetic dandiya celebration vibes.',
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      price: 1499,
      isPremium: true,
      designConfiguration: {
        themeId: 'gujarati',
        animationType: 'marigold-shower',
        colors: {
          primary: '#9A1B28',
          secondary: '#E5A93B',
          background: '#FFFDF9',
          surface: '#FCF5E8',
          accent: '#0A5C36',
          text: '#261205',
          goldText: '#D97706',
        },
        typography: {
          display: 'Rozha One, serif',
          heading: 'Playfair Display, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Rozha One, serif',
        },
        culturalMotif: 'bandhani-dandiya',
        audioTrack: 'garba-shehnai',
        defaultMantra: '॥ ૐ શ્રી ગણેશાય નમઃ ॥ સપરિવાર પધારવા ભાવભર્યું આમંત્રણ ॥',
        borderStyle: 'bandhani-rangoli',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'bengali',
      name: 'Shubho Alpona & Crimson Petals',
      slug: 'shubho-alpona-crimson-petals',
      description: 'Sacred red and conch-shell ivory Bengali Biye invitation accompanied by floating crimson petals and traditional Topor motifs.',
      previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
      price: 1499,
      isPremium: true,
      designConfiguration: {
        themeId: 'bengali',
        animationType: 'falling-petals',
        colors: {
          primary: '#900C3F',
          secondary: '#FFC300',
          background: '#FFFDF9',
          surface: '#FFF8E7',
          accent: '#581845',
          text: '#220814',
          goldText: '#D4AF37',
        },
        typography: {
          display: 'Playfair Display, serif',
          heading: 'Cormorant Garamond, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Cinzel, serif',
        },
        culturalMotif: 'topor-shankha-alpona',
        audioTrack: 'sankha-dhunuchi',
        defaultMantra: '॥ ওঁ শ্রী শ্রী প্রজাপতয়ে নমঃ ॥ শুভ পরিণয় উপলক্ষে আমাদের সনির্বন্ধ নিমন্ত্রণ ॥',
        borderStyle: 'alpona-artisan',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'destination-wedding',
      name: 'Udaipur Lake Palace 3D Gateways',
      slug: 'udaipur-lake-palace-3d-gateways',
      description: 'Spectacular destination wedding card with 3D swinging royal palace doors, water lake silhouettes, and falling rose petals.',
      previewImage: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&auto=format&fit=crop&q=80',
      price: 1499,
      isPremium: true,
      designConfiguration: {
        themeId: 'destination-wedding',
        animationType: 'palace-doors',
        colors: {
          primary: '#183B56',
          secondary: '#C9A44C',
          background: '#FFFDF9',
          surface: '#F4F7F9',
          accent: '#E65100',
          text: '#0E2439',
          goldText: '#C9A44C',
        },
        typography: {
          display: 'Cinzel Decorative, serif',
          heading: 'Playfair Display, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Cinzel, serif',
        },
        culturalMotif: 'palace-water-boat',
        audioTrack: 'rajasthani-folk-fusion',
        defaultMantra: 'Join us under the stars as we begin our forever in the City of Lakes.',
        borderStyle: 'royal-scallop-border',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'floral-romance',
      name: 'Vrindavan Lotus Bloom & Floating Diyas',
      slug: 'vrindavan-lotus-floating-diyas',
      description: 'Serene sacred romance featuring delicate watercolor lotus blossoms, rotating golden mandala rays, and floating glowing earthen diyas.',
      previewImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80',
      price: 1499,
      isPremium: true,
      designConfiguration: {
        themeId: 'floral-romance',
        animationType: 'floating-diyas',
        colors: {
          primary: '#6B2D5C',
          secondary: '#E8A598',
          background: '#FFFDFC',
          surface: '#FAF0ED',
          accent: '#4A6B56',
          text: '#261220',
          goldText: '#D4AF37',
        },
        typography: {
          display: 'Playfair Display, serif',
          heading: 'Cormorant Garamond, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Playfair Display, serif',
        },
        culturalMotif: 'blooming-pink-lotus',
        audioTrack: 'sitar-morning-raag',
        defaultMantra: '॥ ॐ श्री परमात्मने नमः ॥ Where love blooms, divinity resides.',
        borderStyle: 'watercolor-lotus-garland',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'christian',
      name: 'Cathedral Baroque & Silver Starlight',
      slug: 'cathedral-baroque-silver-starlight',
      description: 'Timeless church wedding invitation with twinkling silver starlight particles, baroque crest monograms, and classic romantic vows.',
      previewImage: 'https://images.unsplash.com/photo-1519225424988-518ecda01fa6?w=800&auto=format&fit=crop&q=80',
      price: 0,
      isPremium: false,
      designConfiguration: {
        themeId: 'christian',
        animationType: 'starry-sparkles',
        colors: {
          primary: '#2C3E50',
          secondary: '#BDC3C7',
          background: '#FAFAFA',
          surface: '#F0F3F4',
          accent: '#7F8C8D',
          text: '#2C3E50',
          goldText: '#95A5A6',
        },
        typography: {
          display: 'Playfair Display, serif',
          heading: 'Cormorant Garamond, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Playfair Display, serif',
        },
        culturalMotif: 'monogram-floral-cross',
        audioTrack: 'canon-in-d',
        defaultMantra: '“Therefore what God has joined together, let no one separate.” — Mark 10:9',
        borderStyle: 'baroque-crest',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'minimalist',
      name: 'Sovereign Fine-Line Gold Leaf Drift',
      slug: 'sovereign-fineline-gold-leaf',
      description: 'Understated ultra-luxury minimalist design with drifting geometric gold leaf flakes and crisp editorial serif typography.',
      previewImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80',
      price: 0,
      isPremium: false,
      designConfiguration: {
        themeId: 'minimalist',
        animationType: 'gold-dust',
        colors: {
          primary: '#1A1A1A',
          secondary: '#C9A44C',
          background: '#FFFFFF',
          surface: '#F8F8F8',
          accent: '#666666',
          text: '#111111',
          goldText: '#C9A44C',
        },
        typography: {
          display: 'Cinzel, serif',
          heading: 'Playfair Display, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Cinzel, serif',
        },
        culturalMotif: 'minimalist-couple-monogram',
        audioTrack: 'piano-ambient',
        defaultMantra: 'Together with their families, invite you to share their joy.',
        borderStyle: 'fine-line-gold',
        aspectRatio: 'vertical',
      },
    },
    {
      categorySlug: 'emerald-gold',
      name: 'Nizam Royal Velvet & Golden Mandala',
      slug: 'nizam-royal-velvet-golden-mandala',
      description: 'Opulent Hyderabadi Nizam emerald velvet featuring continuous rotating golden mandalas and shimmering chandelier filigree.',
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      price: 1499,
      isPremium: true,
      designConfiguration: {
        themeId: 'emerald-gold',
        animationType: 'rotating-mandala',
        colors: {
          primary: '#0A3B2C',
          secondary: '#D4AF37',
          background: '#FAFCFA',
          surface: '#EEF6F2',
          accent: '#800020',
          text: '#061D16',
          goldText: '#D4AF37',
        },
        typography: {
          display: 'Cinzel Decorative, serif',
          heading: 'Playfair Display, serif',
          body: 'Plus Jakarta Sans, sans-serif',
          mantra: 'Cinzel, serif',
        },
        culturalMotif: 'chandelier-filigree',
        audioTrack: 'royal-sitar-orchestra',
        defaultMantra: 'In the presence of almighty, we celebrate the eternal union of two families.',
        borderStyle: 'antique-gold-inlay',
        aspectRatio: 'vertical',
      },
    },
  ];

  const templateMap = {};
  for (const t of animatedTemplates) {
    const categoryId = categoryMap[t.categorySlug];
    const saved = await prisma.template.upsert({
      where: { slug: t.slug },
      update: {
        categoryId,
        name: t.name,
        description: t.description,
        previewImage: t.previewImage,
        thumbnailImage: t.previewImage,
        designConfiguration: t.designConfiguration,
        price: t.price,
        isPremium: t.isPremium,
      },
      create: {
        categoryId,
        name: t.name,
        slug: t.slug,
        description: t.description,
        previewImage: t.previewImage,
        thumbnailImage: t.previewImage,
        designConfiguration: t.designConfiguration,
        price: t.price,
        isPremium: t.isPremium,
      },
    });
    templateMap[t.slug] = saved.id;

    await prisma.templateVersion.upsert({
      where: {
        templateId_versionNumber: {
          templateId: saved.id,
          versionNumber: 1,
        },
      },
      update: {
        designConfiguration: t.designConfiguration,
      },
      create: {
        templateId: saved.id,
        versionNumber: 1,
        designConfiguration: t.designConfiguration,
        isPublished: true,
      },
    });
  }

  // 6. Delete old static templates
  const validSlugs = animatedTemplates.map((t) => t.slug);
  await prisma.template.deleteMany({
    where: {
      slug: { notIn: validSlugs },
    },
  });

  // 7. Demo Wedding Project
  const weddingDate = new Date('2027-02-18T10:00:00Z');
  const demoProject = await prisma.weddingProject.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {
      userId: demoHost.id,
      projectName: 'Rohan & Priya Grand Wedding',
      brideName: 'Priya Sharma',
      groomName: 'Rohan Singhania',
      weddingDate,
      status: 'active',
    },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      userId: demoHost.id,
      projectName: 'Rohan & Priya Grand Wedding',
      brideName: 'Priya Sharma',
      groomName: 'Rohan Singhania',
      weddingDate,
      status: 'active',
    },
  });

  // 8. Family Members
  const familyMembers = [
    {
      fullName: 'Late Shri Dinanath & Smt. Shanti Sharma',
      relationship: 'Paternal Grandparents (Bride)',
      description: 'With divine heavenly blessings',
      displayOrder: 1,
    },
    {
      fullName: 'Smt. Sunita & Shri Ramesh Sharma',
      relationship: 'Parents of the Bride',
      description: 'Warmly invite you to their daughter’s wedding',
      displayOrder: 2,
    },
    {
      fullName: 'Late Shri Manmohan & Smt. Kamla Singhania',
      relationship: 'Paternal Grandparents (Groom)',
      description: 'Blessing from the heavens above',
      displayOrder: 3,
    },
    {
      fullName: 'Smt. Rekha & Shri Vikram Singhania',
      relationship: 'Parents of the Groom',
      description: 'Solicit your gracious presence',
      displayOrder: 4,
    },
  ];

  await prisma.familyMember.deleteMany({ where: { projectId: demoProject.id } });
  for (const fm of familyMembers) {
    await prisma.familyMember.create({
      data: {
        projectId: demoProject.id,
        ...fm,
      },
    });
  }

  // 9. Published Invitation for Rohan & Priya using Royal Jharokha 3D Unfold
  const primaryTemplateId = templateMap['royal-jharokha-3d-unfold'];
  const templateVer = await prisma.templateVersion.findFirst({
    where: { templateId: primaryTemplateId, versionNumber: 1 },
  });

  const demoInvitation = await prisma.invitation.upsert({
    where: { slug: 'rohan-weds-priya' },
    update: {
      projectId: demoProject.id,
      templateId: primaryTemplateId,
      templateVersionId: templateVer ? templateVer.id : null,
      invitationTitle: 'The Wedding Celebration of Rohan & Priya',
      status: 'published',
      publishedAt: new Date(),
      invitationData: {
        mantra: '॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
        welcomeNote: 'Together with our families, we joyfully invite you to celebrate the sacred union of our hearts and heritage.',
        couple: {
          bride: {
            name: 'Priya Sharma',
            parents: 'Smt. Sunita & Shri Ramesh Sharma',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
            bio: 'Daughter of the Sharmas. Software architect, Bharatnatyam classical dancer & chai lover.',
          },
          groom: {
            name: 'Rohan Singhania',
            parents: 'Smt. Rekha & Shri Vikram Singhania',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
            bio: 'Son of the Singhanias. Product builder, amateur chef & mountain trekker.',
          },
          hashtag: '#PriyaFoundHerRohan',
        },
        story: {
          headline: 'How Our Story Began',
          description: 'A serendipitous rainy evening at a quaint café in Indiranagar, Bangalore turned into hours of endless laughter, conversations about life, dreams, and family. Two years later, under the starlight of Udaipur, Rohan asked the question, and Priya said yes!',
          gallery: [
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
          ],
        },
        audio: {
          enabled: true,
          trackUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
          title: 'Auspicious Shehnai Raag - Royal Vivah',
        },
        shagunRegistry: {
          enabled: true,
          upiId: 'rohan.singhania@okhdfcbank',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=rohan.singhania@okhdfcbank&pn=RohanPriyaVivah',
          note: 'Your warm presence and blessings are our greatest treasure. If you wish to grace us with traditional Shagun, a digital blessing via UPI is available.',
        },
        customStyling: {
          primaryColor: '#800020',
          secondaryColor: '#C9A44C',
          backgroundColor: '#FFF9F0',
        },
        animationType: 'palace-doors',
      },
    },
    create: {
      projectId: demoProject.id,
      templateId: primaryTemplateId,
      templateVersionId: templateVer ? templateVer.id : null,
      invitationTitle: 'The Wedding Celebration of Rohan & Priya',
      slug: 'rohan-weds-priya',
      status: 'published',
      publishedAt: new Date(),
      invitationData: {
        mantra: '॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
        welcomeNote: 'Together with our families, we joyfully invite you to celebrate the sacred union of our hearts and heritage.',
        couple: {
          bride: {
            name: 'Priya Sharma',
            parents: 'Smt. Sunita & Shri Ramesh Sharma',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
            bio: 'Daughter of the Sharmas. Software architect, Bharatnatyam classical dancer & chai lover.',
          },
          groom: {
            name: 'Rohan Singhania',
            parents: 'Smt. Rekha & Shri Vikram Singhania',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
            bio: 'Son of the Singhanias. Product builder, amateur chef & mountain trekker.',
          },
          hashtag: '#PriyaFoundHerRohan',
        },
        story: {
          headline: 'How Our Story Began',
          description: 'A serendipitous rainy evening at a quaint café in Indiranagar, Bangalore turned into hours of endless laughter, conversations about life, dreams, and family. Two years later, under the starlight of Udaipur, Rohan asked the question, and Priya said yes!',
          gallery: [
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
          ],
        },
        audio: {
          enabled: true,
          trackUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
          title: 'Auspicious Shehnai Raag - Royal Vivah',
        },
        shagunRegistry: {
          enabled: true,
          upiId: 'rohan.singhania@okhdfcbank',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=rohan.singhania@okhdfcbank&pn=RohanPriyaVivah',
          note: 'Your warm presence and blessings are our greatest treasure. If you wish to grace us with traditional Shagun, a digital blessing via UPI is available.',
        },
        customStyling: {
          primaryColor: '#800020',
          secondaryColor: '#C9A44C',
          backgroundColor: '#FFF9F0',
        },
        animationType: 'palace-doors',
      },
    },
  });

  console.log('🎉 Database Seeding with Animated Templates Completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
