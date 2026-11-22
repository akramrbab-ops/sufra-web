import type { ReactElement } from 'react'
import { DetailsScreen, LocationScreen, OtpScreen, PhoneScreen, Splash, Welcome } from '@/screens/onboarding/Onboarding'
import { Collection, Explore, Home, MapView, Offers, Results } from '@/screens/discover/Discover'
import { GalleryViewer, Restaurant } from '@/screens/restaurant/Restaurant'
import { BookingDetails, Confirmed, Payment } from '@/screens/booking/Booking'
import { Bill, BookingDetail, Bookings, ReviewScreen } from '@/screens/bookings/Bookings'
import { AddCard, Chat, EditProfile, Favourites, Help, Notifications, PaymentMethods, Profile, Settings } from '@/screens/profile/Profile'
import { BuyGift, GiftWallet, Gifts, PointsHistory, Refer, Rewards } from '@/screens/rewards/Rewards'

export const routes: { path: string; element: ReactElement }[] = [
  { path: '/', element: <Splash /> },
  { path: '/welcome', element: <Welcome /> },
  { path: '/signin/phone', element: <PhoneScreen /> },
  { path: '/signin/otp', element: <OtpScreen /> },
  { path: '/signin/details', element: <DetailsScreen /> },
  { path: '/signin/location', element: <LocationScreen /> },
  { path: '/home', element: <Home /> },
  { path: '/explore', element: <Explore /> },
  { path: '/search', element: <Results /> },
  { path: '/map', element: <MapView /> },
  { path: '/offers', element: <Offers /> },
  { path: '/collection/:id', element: <Collection /> },
  { path: '/restaurant/:id', element: <Restaurant /> },
  { path: '/restaurant/:id/gallery', element: <GalleryViewer /> },
  { path: '/book/details', element: <BookingDetails /> },
  { path: '/book/pay', element: <Payment /> },
  { path: '/book/done/:id', element: <Confirmed /> },
  { path: '/bookings', element: <Bookings /> },
  { path: '/booking/:id', element: <BookingDetail /> },
  { path: '/booking/:id/bill', element: <Bill /> },
  { path: '/review/:id', element: <ReviewScreen /> },
  { path: '/profile', element: <Profile /> },
  { path: '/profile/edit', element: <EditProfile /> },
  { path: '/favourites', element: <Favourites /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/payment-methods', element: <PaymentMethods /> },
  { path: '/payment-methods/add', element: <AddCard /> },
  { path: '/settings', element: <Settings /> },
  { path: '/help', element: <Help /> },
  { path: '/help/chat', element: <Chat /> },
  { path: '/rewards', element: <Rewards /> },
  { path: '/rewards/history', element: <PointsHistory /> },
  { path: '/refer', element: <Refer /> },
  { path: '/gifts', element: <Gifts /> },
  { path: '/gifts/buy', element: <BuyGift /> },
  { path: '/gifts/wallet', element: <GiftWallet /> },
]
