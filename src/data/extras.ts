import { img } from './images'
import { restaurants, type Restaurant } from './restaurants'

/* ---------- Set menus ---------- */
export interface SetMenu { id: string; restaurantId: string; name: string; courses: string[]; price: number; image: string; minGuests?: number; note?: string }

const SET_MENUS: Record<string, Omit<SetMenu, 'id' | 'restaurantId'>[]> = {
  'najd-village': [
    { name: 'Najdi Feast', courses: ['Saudi coffee & dates', 'Jareesh & mezze', 'Lamb kabsa to share', 'Kunafa & luqaimat'], price: 195, image: img.kabsa, minGuests: 2 },
    { name: 'Family Sofra', courses: ['Mezze platter', 'Chicken mandi', 'Lamb kabsa', 'Dessert selection', 'Fresh laban'], price: 160, image: img.coffee, minGuests: 4, note: 'Served in the family section' },
  ],
  'hoshi-omakase': [
    { name: 'Chef’s Omakase', courses: ['Seasonal sakizuke', 'Sashimi trio', '10 nigiri', 'Miso soup', 'Yuzu sorbet'], price: 480, image: img.sushi },
  ],
  'beit-mezze': [
    { name: 'Weekend Brunch', courses: ['Hot & cold mezze', 'Manakish', 'Shakshuka', 'Mint lemonade'], price: 120, image: img.mezze },
  ],
  'trattoria-sole': [
    { name: 'Tavola Italiana', courses: ['Burrata & tomatoes', 'Truffle tagliatelle', 'Tiramisu'], price: 175, image: img.pasta },
    { name: 'Pasta Night', courses: ['Bruschetta', 'Any two pastas to share', 'Panna cotta'], price: 140, image: img.pasta, minGuests: 2 },
  ],
  'prime-cut': [
    { name: 'Wagyu Experience', courses: ['Steak tartare', 'Wagyu ribeye 300g', 'Two sides', 'Chocolate fondant'], price: 520, image: img.steak },
  ],
  'bahar-seafood': [
    { name: 'Red Sea Catch', courses: ['Fish soup', 'Grilled catch of the day', 'Saffron rice', 'Umm Ali'], price: 210, image: img.fish },
  ],
  'diwan-terrace': [
    { name: 'Sunset Mezze', courses: ['Cold mezze', 'Mixed grill', 'Kunafa'], price: 150, image: img.terrace },
  ],
}
export const setMenusFor = (id: string): SetMenu[] => (SET_MENUS[id] ?? []).map((m, i) => ({ ...m, id: `${id}-sm${i}`, restaurantId: id }))
export const setMenuById = (id?: string) => (id ? Object.keys(SET_MENUS).flatMap(setMenusFor).find(m => m.id === id) : undefined)

/* ---------- Sufra Festival ---------- */
export const FESTIVAL = {
  name: 'Sufra Festival',
  start: '2026-12-01',
  end: '2026-12-14',
  discount: 50,
  image: img.terrace,
  ids: ['najd-village', 'beit-mezze', 'trattoria-sole', 'sakura-robata', 'umami-house', 'bahar-seafood', 'diwan-terrace', 'al-bustan'],
}
export const inFestival = (id: string) => FESTIVAL.ids.includes(id)
export const festivalRestaurants = (): Restaurant[] => FESTIVAL.ids.map(id => restaurants.find(r => r.id === id)!).filter(Boolean)

/* ---------- Sufra Awards ---------- */
export interface Award { restaurantId: string; category: string; level: 'Winner' | 'Finalist' }
export const AWARDS_YEAR = 2026
export const AWARDS: Award[] = [
  { restaurantId: 'hoshi-omakase', category: 'Restaurant of the Year', level: 'Winner' },
  { restaurantId: 'najd-village', category: 'Best Saudi Cuisine', level: 'Winner' },
  { restaurantId: 'al-bustan', category: 'Best Saudi Cuisine', level: 'Finalist' },
  { restaurantId: 'diwan-terrace', category: 'Best View', level: 'Winner' },
  { restaurantId: 'prime-cut', category: 'Best Steakhouse', level: 'Winner' },
  { restaurantId: 'beit-mezze', category: 'Best Brunch', level: 'Winner' },
  { restaurantId: 'trattoria-sole', category: 'Best Brunch', level: 'Finalist' },
  { restaurantId: 'bahar-seafood', category: 'Best Seafood', level: 'Finalist' },
]
export const awardFor = (id: string) => AWARDS.find(a => a.restaurantId === id)
export const AWARD_CATEGORIES = [...new Set(AWARDS.map(a => a.category))]

/* ---------- Dietary ---------- */
export const DIETS = ['Vegetarian', 'Vegan', 'Pescatarian', 'Gluten-free', 'Dairy-free', 'Low-carb']
export const ALLERGIES = ['Nuts', 'Peanuts', 'Shellfish', 'Fish', 'Eggs', 'Sesame', 'Soy', 'Lactose']
