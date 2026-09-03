# GameClubFinder gaming-only frontend audit

## Preserved architecture

- Vue 3, Vite, Composition API, Vue Router and Pinia remain unchanged.
- Venue repositories still isolate mock data and can be replaced by API adapters later.
- Favorites and recently viewed history retain their browser-storage behavior.
- Telegram initialization, theme adaptation and back-button integration remain active.
- Leaflet map, viewport search, geolocation and marker selection remain intact.
- Existing reusable UI, feedback, review and owner-workspace components are preserved.

## Gaming-only changes

- Discovery categories now cover PC Gaming, PlayStation, VR, Private Room, Bootcamp and Open 24/7.
- Mock clubs use Uzbek names, addresses, UZS prices, availability, hardware tiers, installed games and gaming amenities.
- Home, explore, cards, map previews and detail screens prioritize availability, price, distance and hardware.
- Detail screens include tier availability, structured hardware and installed games.
- Booking is enabled through a local repository and Pinia store, with a six-step frontend flow and booking history tabs.
- The primary navigation is Home, Explore, Bookings, Saved and Profile.

## Backend boundaries

- Club discovery uses `VenueRepository`.
- Booking creation and cancellation use `BookingRepository`.
- Mock availability is clearly isolated and can be replaced without rewriting pages.
- No backend, payment flow or new dependency was introduced.
