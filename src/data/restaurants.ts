import { img } from './images'

export interface MenuItem { id: string; name: string; desc: string; price: number; image?: string }
export interface MenuSection { title: string; items: MenuItem[] }
export interface Review { id: string; name: string; initials: string; date: string; guests: number; score: number; body: string; photos?: string[] }
export interface Restaurant {
  id: string
  name: string
  cuisine: string
  area: string
  distanceKm: number
  priceAvg: number
  rating: number
  reviewsCount: number
  image: string
  gallery: string[]
  badges: string[]
  amenities: string[]
  description: string
  address: string
  phone: string
  hours: string
  map: { x: number; y: number }
  /** discount % by time slot, -1 = full */
  slots: Record<string, number>
  subScores: { food: number; service: number; ambience: number; value: number }
  menu: MenuSection[]
  reviews: Review[]
  depositPerGuest: number
  pointsMultiplier?: number
}

export const TIMES = ['6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00']

const dishes = {
  kabsa: { name: 'Lamb Kabsa', desc: 'Slow-cooked lamb shoulder, spiced rice, nuts and raisins.', price: 145, image: img.kabsa },
  fish: { name: 'Grilled Sea Bream', desc: 'Charcoal-grilled, lemon, wild herbs, tahini sauce.', price: 120, image: img.fish },
  mezze: { name: 'Mezze Platter', desc: 'Hummus, fattoush, tabbouleh, halloumi, warm bread.', price: 85, image: img.mezze },
  kunafa: { name: 'Kunafa', desc: 'Crispy kataifi, melted cheese, crushed pistachio.', price: 45, image: img.kunafa },
  coffee: { name: 'Saudi Coffee & Dates', desc: 'Cardamom coffee served with Khalas dates.', price: 30, image: img.coffee },
  pasta: { name: 'Truffle Tagliatelle', desc: 'Hand-rolled pasta, black truffle, aged parmesan.', price: 95, image: img.pasta },
  sushi: { name: 'Omakase Nigiri (8 pcs)', desc: 'Chef’s selection of the day: otoro, uni, hamachi, scallop.', price: 260, image: img.sushi },
  steak: { name: 'Wagyu Ribeye 300g', desc: 'Dry-aged 28 days, bone marrow butter, chimichurri.', price: 340, image: img.steak },
}
let mid = 0
const m = (d: Omit<MenuItem, 'id'>): MenuItem => ({ id: `m${++mid}`, ...d })
const extra = (name: string, desc: string, price: number): MenuItem => m({ name, desc, price })

const reviewsPool: Omit<Review, 'id'>[] = [
  { name: 'Sara M.', initials: 'SM', date: '12 Nov', guests: 2, score: 9.5, body: 'Beautiful setting and the food was perfect. Service was quick even on a busy Thursday night.', photos: [img.kabsa] },
  { name: 'Faisal A.', initials: 'FA', date: '8 Nov', guests: 4, score: 9.0, body: 'Great family section and generous portions. The offer made it excellent value.' },
  { name: 'Noura K.', initials: 'NK', date: '2 Nov', guests: 2, score: 8.5, body: 'Lovely atmosphere for a date night. Desserts are a must — the kunafa is outstanding.', photos: [img.kunafa] },
  { name: 'Omar S.', initials: 'OS', date: '28 Oct', guests: 6, score: 9.2, body: 'Booked last minute through Sufra and got a great table. Staff remembered my birthday note.' },
  { name: 'Lama H.', initials: 'LH', date: '21 Oct', guests: 3, score: 7.8, body: 'Food was very good, a little slow on drinks. Would come back for the terrace.' },
]
const reviews = (seed: number): Review[] => reviewsPool.map((r, i) => ({ ...r, id: `rv${seed}-${i}` })).slice(seed % 2, (seed % 2) + 4)

const mk = (r: Omit<Restaurant, 'reviews'> & { seed: number }): Restaurant => {
  const { seed, ...rest } = r
  return { ...rest, reviews: reviews(seed) }
}

export const restaurants: Restaurant[] = [
  mk({ seed: 1, id: 'najd-village', name: 'Najd Village', cuisine: 'Saudi', area: 'Al Takhassusi', distanceKm: 1.8, priceAvg: 140, rating: 9.2, reviewsCount: 2431,
    image: img.kabsa, gallery: [img.kabsa, img.coffee, img.kunafa, img.terrace], badges: ['Top 100', 'Family section'],
    amenities: ['Family section', 'Valet parking', 'Private room', 'Kids friendly'], description: 'Traditional Najdi hospitality in a mud-brick courtyard. Famous for slow-cooked lamb kabsa and Saudi coffee served the old way.',
    address: 'King Fahd Rd, Al Takhassusi, Riyadh', phone: '+966 11 464 6530', hours: '1:00 PM – 1:00 AM', map: { x: 38, y: 40 },
    slots: { '6:00': 0, '6:30': 0, '7:00': 25, '7:30': 30, '8:00': 30, '8:30': 0, '9:00': -1, '9:30': 15, '10:00': 0 },
    subScores: { food: 9.4, service: 9.1, ambience: 9.0, value: 8.7 }, depositPerGuest: 50, pointsMultiplier: 2,
    menu: [{ title: 'Mains', items: [m(dishes.kabsa), m(dishes.fish), extra('Chicken Mandi', 'Smoked chicken, mandi rice, daqoos.', 85)] }, { title: 'Starters', items: [m(dishes.mezze), extra('Jareesh', 'Cracked wheat, yoghurt, caramelised onion.', 38)] }, { title: 'Desserts', items: [m(dishes.kunafa), extra('Luqaimat', 'Golden dumplings, date syrup, sesame.', 32)] }, { title: 'Drinks', items: [m(dishes.coffee), extra('Fresh Laban', 'Chilled yoghurt drink with mint.', 18)] }] }),
  mk({ seed: 2, id: 'hoshi-omakase', name: 'Hoshi Omakase', cuisine: 'Japanese', area: 'Al Malqa', distanceKm: 3.4, priceAvg: 320, rating: 9.5, reviewsCount: 860,
    image: img.sushi, gallery: [img.sushi, img.interior, img.fish], badges: ['Insider', 'Chef’s counter'], amenities: ['Counter seating', 'Valet parking', 'Private room'],
    description: 'A twelve-seat counter where the chef serves an evolving omakase of Japanese fish flown in three times a week.', address: 'Anas Ibn Malik Rd, Al Malqa, Riyadh', phone: '+966 11 512 8800',
    hours: '6:00 PM – 12:00 AM', map: { x: 30, y: 18 }, slots: { '6:00': 20, '6:30': 20, '7:00': 0, '7:30': -1, '8:00': -1, '8:30': 0, '9:00': 10, '9:30': 0, '10:00': 0 },
    subScores: { food: 9.7, service: 9.4, ambience: 9.3, value: 8.4 }, depositPerGuest: 100,
    menu: [{ title: 'Omakase', items: [m(dishes.sushi), extra('Seasonal Sashimi', 'Five cuts, fresh wasabi, yuzu soy.', 180)] }, { title: 'Hot', items: [extra('Black Cod Miso', 'Saikyo miso marinated 72 hours.', 155), extra('A5 Wagyu Tataki', 'Ponzu, garlic chips, chives.', 210)] }, { title: 'Desserts', items: [extra('Matcha Tiramisu', 'Uji matcha, mascarpone, sponge.', 55)] }] }),
  mk({ seed: 3, id: 'beit-mezze', name: 'Beit Mezze', cuisine: 'Lebanese', area: 'Al Nakheel', distanceKm: 4.0, priceAvg: 120, rating: 9.0, reviewsCount: 1205,
    image: img.mezze, gallery: [img.mezze, img.terrace, img.kunafa], badges: ['Outdoor terrace'], amenities: ['Outdoor seating', 'Family section', 'Kids friendly'],
    description: 'A sunlit Beiruti terrace with olive trees, string lights and the city’s best hot and cold mezze.', address: 'Al Nakheel District, Riyadh', phone: '+966 11 200 1144',
    hours: '12:00 PM – 1:00 AM', map: { x: 18, y: 58 }, slots: { '6:00': 30, '6:30': 30, '7:00': 20, '7:30': 0, '8:00': 0, '8:30': -1, '9:00': 0, '9:30': 0, '10:00': 15 },
    subScores: { food: 9.1, service: 8.9, ambience: 9.4, value: 9.0 }, depositPerGuest: 0,
    menu: [{ title: 'Cold mezze', items: [m(dishes.mezze), extra('Fattoush', 'Sumac, pomegranate, crispy bread.', 32)] }, { title: 'Grills', items: [extra('Mixed Grill', 'Shish taouk, kafta, lamb chops.', 135), m(dishes.fish)] }, { title: 'Desserts', items: [m(dishes.kunafa)] }] }),
  mk({ seed: 4, id: 'trattoria-sole', name: 'Trattoria Sole', cuisine: 'Italian', area: 'Hittin', distanceKm: 2.1, priceAvg: 150, rating: 8.9, reviewsCount: 1640,
    image: img.pasta, gallery: [img.pasta, img.interior, img.kunafa], badges: ['Tonight’s pick'], amenities: ['Outdoor seating', 'Valet parking', 'Kids friendly'],
    description: 'Hand-rolled pasta, wood-fired mains and a sunlit terrace. 25% off every table before 7 PM.', address: 'Prince Turki Rd, Hittin, Riyadh', phone: '+966 11 818 4040',
    hours: '12:00 PM – 12:30 AM', map: { x: 62, y: 30 }, slots: { '6:00': 25, '6:30': 25, '7:00': 25, '7:30': 10, '8:00': 0, '8:30': -1, '9:00': 0, '9:30': 0, '10:00': 0 },
    subScores: { food: 9.0, service: 8.8, ambience: 9.1, value: 8.6 }, depositPerGuest: 50,
    menu: [{ title: 'Pasta', items: [m(dishes.pasta), extra('Cacio e Pepe', 'Tonnarelli, pecorino, black pepper.', 78)] }, { title: 'Mains', items: [m(dishes.fish), extra('Pollo al Mattone', 'Brick-pressed chicken, salsa verde.', 98)] }, { title: 'Desserts', items: [extra('Tiramisu', 'Classic, made at the table.', 45)] }] }),
  mk({ seed: 5, id: 'prime-cut', name: 'Prime Cut', cuisine: 'Steakhouse', area: 'Al Olaya', distanceKm: 1.2, priceAvg: 260, rating: 9.1, reviewsCount: 980,
    image: img.steak, gallery: [img.steak, img.interior], badges: ['Top 100'], amenities: ['Private room', 'Valet parking', 'Business friendly'],
    description: 'Leather booths, an open grill and dry-aged cuts from our own ageing room.', address: 'Olaya St, Al Olaya, Riyadh', phone: '+966 11 299 7070',
    hours: '6:00 PM – 1:00 AM', map: { x: 54, y: 62 }, slots: { '6:00': 0, '6:30': 0, '7:00': 0, '7:30': 0, '8:00': 15, '8:30': 15, '9:00': -1, '9:30': 0, '10:00': 0 },
    subScores: { food: 9.4, service: 9.0, ambience: 9.2, value: 8.3 }, depositPerGuest: 100,
    menu: [{ title: 'Steaks', items: [m(dishes.steak), extra('Tenderloin 220g', 'Grain-fed, peppercorn sauce.', 240)] }, { title: 'Sides', items: [extra('Truffle Fries', 'Parmesan, truffle mayo.', 42)] }] }),
  mk({ seed: 6, id: 'sakura-robata', name: 'Sakura Robata', cuisine: 'Japanese', area: 'Hittin', distanceKm: 5.1, priceAvg: 210, rating: 8.8, reviewsCount: 540,
    image: img.interior, gallery: [img.interior, img.sushi, img.steak], badges: ['New'], amenities: ['Counter seating', 'Outdoor seating'],
    description: 'Charcoal robata grill and skyline views over Riyadh.', address: 'Hittin, Riyadh', phone: '+966 11 230 1010', hours: '5:00 PM – 1:00 AM', map: { x: 74, y: 22 },
    slots: { '6:00': 20, '6:30': 20, '7:00': 20, '7:30': 0, '8:00': 0, '8:30': 0, '9:00': 0, '9:30': 0, '10:00': 0 },
    subScores: { food: 8.9, service: 8.7, ambience: 9.4, value: 8.2 }, depositPerGuest: 50,
    menu: [{ title: 'Robata', items: [extra('Wagyu Skewers', 'Tare glaze, shichimi.', 120), extra('Black Cod', 'Miso, pickled ginger.', 150)] }, { title: 'Sushi', items: [m(dishes.sushi)] }] }),
  mk({ seed: 7, id: 'umami-house', name: 'Umami House', cuisine: 'Asian', area: 'Al Olaya', distanceKm: 1.2, priceAvg: 180, rating: 8.7, reviewsCount: 720,
    image: img.steak, gallery: [img.steak, img.sushi], badges: [], amenities: ['Family section', 'Kids friendly'], description: 'Pan-Asian small plates and late-night bao.',
    address: 'Al Olaya, Riyadh', phone: '+966 11 400 2020', hours: '1:00 PM – 2:00 AM', map: { x: 46, y: 74 },
    slots: { '6:00': 0, '6:30': 0, '7:00': 15, '7:30': 15, '8:00': 0, '8:30': 0, '9:00': 0, '9:30': 20, '10:00': 20 },
    subScores: { food: 8.8, service: 8.6, ambience: 8.7, value: 8.8 }, depositPerGuest: 0,
    menu: [{ title: 'Small plates', items: [extra('Crispy Bao', 'Short rib, pickles, hoisin.', 52), extra('Rock Shrimp', 'Spicy mayo, lime.', 68)] }] }),
  mk({ seed: 8, id: 'bahar-seafood', name: 'Bahar Seafood', cuisine: 'Seafood', area: 'Al Wurud', distanceKm: 2.9, priceAvg: 190, rating: 8.9, reviewsCount: 612,
    image: img.fish, gallery: [img.fish, img.terrace], badges: ['Fresh daily'], amenities: ['Family section', 'Outdoor seating'], description: 'Red Sea catch of the day, grilled over charcoal and priced by weight.',
    address: 'Al Wurud, Riyadh', phone: '+966 11 455 9090', hours: '12:30 PM – 12:00 AM', map: { x: 66, y: 48 },
    slots: { '6:00': 15, '6:30': 15, '7:00': 0, '7:30': 0, '8:00': 0, '8:30': 10, '9:00': 0, '9:30': 0, '10:00': 0 },
    subScores: { food: 9.2, service: 8.7, ambience: 8.6, value: 8.6 }, depositPerGuest: 50,
    menu: [{ title: 'From the grill', items: [m(dishes.fish), extra('Hammour Sayadieh', 'Spiced rice, caramelised onion.', 115)] }, { title: 'Desserts', items: [m(dishes.kunafa)] }] }),
  mk({ seed: 9, id: 'cafe-dalla', name: 'Café Dalla', cuisine: 'Café', area: 'Diriyah', distanceKm: 12.4, priceAvg: 70, rating: 9.0, reviewsCount: 1880,
    image: img.coffee, gallery: [img.coffee, img.kunafa, img.terrace], badges: ['Heritage'], amenities: ['Outdoor seating', 'Family section'],
    description: 'Saudi coffee rituals, dates and sweets overlooking At-Turaif.', address: 'Bujairi Terrace, Diriyah', phone: '+966 11 800 1212', hours: '8:00 AM – 1:00 AM',
    map: { x: 10, y: 30 }, slots: { '6:00': 0, '6:30': 0, '7:00': 0, '7:30': 0, '8:00': 0, '8:30': 0, '9:00': 0, '9:30': 0, '10:00': 0 },
    subScores: { food: 8.9, service: 9.0, ambience: 9.5, value: 9.0 }, depositPerGuest: 0,
    menu: [{ title: 'Coffee', items: [m(dishes.coffee)] }, { title: 'Sweets', items: [m(dishes.kunafa), extra('Date Cake', 'Toffee sauce, cardamom cream.', 38)] }] }),
  mk({ seed: 10, id: 'diwan-terrace', name: 'Diwan Terrace', cuisine: 'Lebanese', area: 'Al Sahafa', distanceKm: 6.3, priceAvg: 160, rating: 8.6, reviewsCount: 430,
    image: img.terrace, gallery: [img.terrace, img.mezze], badges: ['Rooftop'], amenities: ['Outdoor seating', 'Shisha', 'Valet parking'],
    description: 'Rooftop dining with Kingdom Centre views and a live oud on weekends.', address: 'Al Sahafa, Riyadh', phone: '+966 11 650 3030', hours: '4:00 PM – 2:00 AM', map: { x: 50, y: 12 },
    slots: { '6:00': 20, '6:30': 0, '7:00': 0, '7:30': 0, '8:00': 0, '8:30': 0, '9:00': 0, '9:30': 0, '10:00': 20 },
    subScores: { food: 8.5, service: 8.6, ambience: 9.4, value: 8.2 }, depositPerGuest: 50,
    menu: [{ title: 'Mezze', items: [m(dishes.mezze)] }, { title: 'Grills', items: [extra('Lamb Chops', 'Seven spice, charred lemon.', 125)] }] }),
  mk({ seed: 11, id: 'al-bustan', name: 'Al Bustan Kitchen', cuisine: 'Saudi', area: 'Al Yasmin', distanceKm: 7.5, priceAvg: 95, rating: 8.7, reviewsCount: 1012,
    image: img.kunafa, gallery: [img.kunafa, img.kabsa, img.coffee], badges: ['Desserts'], amenities: ['Family section', 'Kids friendly'],
    description: 'Home-style Saudi dishes and the best kunafa in the north.', address: 'Al Yasmin, Riyadh', phone: '+966 11 210 7777', hours: '12:00 PM – 1:00 AM', map: { x: 24, y: 80 },
    slots: { '6:00': 10, '6:30': 10, '7:00': 0, '7:30': 0, '8:00': 0, '8:30': 0, '9:00': 0, '9:30': 0, '10:00': 0 },
    subScores: { food: 8.9, service: 8.5, ambience: 8.4, value: 9.2 }, depositPerGuest: 0,
    menu: [{ title: 'Mains', items: [m(dishes.kabsa)] }, { title: 'Desserts', items: [m(dishes.kunafa)] }] }),
  mk({ seed: 12, id: 'marina-grill', name: 'Marina Grill', cuisine: 'Seafood', area: 'Al Malqa', distanceKm: 3.8, priceAvg: 230, rating: 8.8, reviewsCount: 377,
    image: img.interior, gallery: [img.interior, img.fish], badges: [], amenities: ['Private room', 'Valet parking'], description: 'Modern seafood grill with a raw bar.',
    address: 'Al Malqa, Riyadh', phone: '+966 11 512 4545', hours: '6:00 PM – 1:00 AM', map: { x: 80, y: 66 },
    slots: { '6:00': 0, '6:30': 0, '7:00': 0, '7:30': 10, '8:00': 10, '8:30': 0, '9:00': 0, '9:30': 0, '10:00': 0 },
    subScores: { food: 8.9, service: 8.8, ambience: 8.9, value: 8.0 }, depositPerGuest: 100,
    menu: [{ title: 'Raw bar', items: [extra('Oysters (6)', 'Mignonette, lemon.', 140)] }, { title: 'Grill', items: [m(dishes.fish)] }] }),
]

export const byId = (id: string) => restaurants.find(r => r.id === id)
export const bestOffer = (r: Restaurant) => Math.max(0, ...Object.values(r.slots))

export const collections = [
  { id: 'brunch', title: 'Best brunch in Riyadh', image: img.terrace, ids: ['beit-mezze', 'cafe-dalla', 'trattoria-sole', 'diwan-terrace'] },
  { id: 'date-night', title: 'Date night', image: img.interior, ids: ['hoshi-omakase', 'sakura-robata', 'prime-cut', 'diwan-terrace'] },
  { id: 'saudi', title: 'Authentic Saudi', image: img.kabsa, ids: ['najd-village', 'al-bustan', 'cafe-dalla'] },
  { id: 'family', title: 'Family favourites', image: img.mezze, ids: ['najd-village', 'beit-mezze', 'umami-house', 'bahar-seafood'] },
]
export const CUISINES = ['Saudi', 'Italian', 'Japanese', 'Lebanese', 'Seafood', 'Steakhouse', 'Asian', 'Café']
export const AREAS = ['Any area', 'Al Olaya', 'Hittin', 'Al Malqa', 'Al Takhassusi', 'Al Nakheel', 'Diriyah']
export const FEATURES = ['Outdoor seating', 'Family section', 'Valet parking', 'Private room', 'Kids friendly']
