# GameClubFinder universal frontend audit

## Architecture summary

The Vue 3 frontend uses Venue as its primary discovery entity. Pages compose universal venue, category, filter, review, map, and feedback components. Category behavior is supplied by typed configuration and resource attributes rather than page forks. Pinia owns application state, repositories isolate data access, and routes are lazily imported.

Adding a category does not require redesigning Home, Explore, Map, VenueCard, or Venue Detail. The expected change path is category configuration, filter/detail schemas, a fixture, and verification of the existing universal screens.

## Completed requirements

- Universal Venue, VenueListItem, and VenueDetail contracts
- Configuration-driven Gaming, Tennis, Football, and Gym behavior
- Global and category-specific filter schemas
- Universal cards, discovery pages, map markers/previews, and detail sections
- /venue/:slug primary detail route
- Semantic light/dark design tokens and centralized Telegram theme adaptation
- Safe-area variables, dynamic viewport units, mobile bottom navigation, and sticky CTA
- Loading, skeleton, empty, offline, error, missing-image, unauthorized, and maintenance readiness
- Pricing units for hour, session, person, day, and month
- Centralized future feature flags; booking and payment remain disabled
- Category-aware review criteria and owner-reply presentation
- Lazy route chunks, debounced search, cancellable/stale-safe venue and viewport requests, and marker clustering
- Accessible names, focus-visible styling, modal focus restoration/trapping, reduced-motion behavior, and 44px touch targets

## Category stress-test matrix

| Area | Gaming | Tennis | Football | Gym |
| --- | --- | --- | --- | --- |
| VenueCard and long names | Pass | Pass | Pass | Pass |
| Home / Explore | Pass | Pass | Pass | Pass |
| Dynamic filters | Pass | Pass | Pass | Pass |
| Map marker / preview | Pass | Pass | Pass | Pass |
| Venue Detail schemas | Pass | Pass | Pass | Pass |
| Pricing | Hour | Hour | Hour | Month |
| Facilities / amenities | Optional-safe | Optional-safe | Optional-safe | Optional-safe |
| Reviews | Equipment / internet | Court / lighting | Field / changing room | Equipment / crowding |
| Favorites | Pass | Pass | Pass | Pass |

Universal screens contain no Gaming-only presentation branch. Category names, accents, filters, highlights, detail schemas, and review criteria are intentionally category configuration.

## Remaining technical debt

- Fixture repositories must be replaced by production API adapters.
- Automated screenshot regression and accessibility scanning are not yet part of CI.
- The category code union and accent tokens require a small typed configuration update for a new category, but no page redesign.
- Translation currently uses a lightweight key boundary; a full locale loader is a future integration.
- Virtual scrolling is intentionally absent because current fixture/list size does not justify its complexity.

## Known backend/API dependencies

- Venue search, visible-bounds map queries, pagination, and server-side filtering need final backend contracts.
- Review submission, authentication, moderation, and ownership rules remain backend-dependent.
- Telegram user identity and theme data are accessed only through the Telegram service and retain browser fallbacks.
- /club/:id and /card/:id are intentional legacy URL redirects only. No active Club-named UI entity, component, route implementation, or store remains.

## Recommended next phase

Stabilize backend contracts and add integration/visual regression tests for the current MVP. Keep booking, payment, loyalty, chat, events, and AI recommendations disabled until their product and API contracts are approved. Do not create category-specific pages for future categories unless their information cannot be represented through the existing schemas and resource components.
