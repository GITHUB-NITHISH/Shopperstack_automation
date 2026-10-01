import { LocatorDef } from './_helpers';

/**
 * Dashboard = https://www.shoppersstack.com/  (title "ShoppersStack | Home" once logged-in)
 *
 * Unauth header : logo, "Login" button, category nav (Men, Women, Kids, Electronic, Beauty)
 * Auth header   : logo, category-scope <select> (all/beauty/men/women/kids/electronics),
 *                 free-text search combobox + magnifier img, "Hello, <NAME>" heading,
 *                 cart link with the item-count as its accessible name, and an
 *                 "Account settings" avatar button that opens a role=menu.
 */
export const DashboardLocators: Record<string, LocatorDef[]> = {
  logo:               [{ engine: 'role', value: 'link', roleOptions: { name: 'logo' } }],

  categoryScopeSelect:[{ engine: 'css', value: 'header select, article > article select' }],
  searchInput:        [{ engine: 'css', value: 'header input[type="text"], article > article input[type="text"]' }],
  searchIcon:         [{ engine: 'css', value: 'header img[alt=""], article > article img[alt=""]' }],

  headerLoginButton:  [{ engine: 'role', value: 'button', roleOptions: { name: 'Login', exact: true } }],
  greetingHeading:    [{ engine: 'role', value: 'heading', roleOptions: { name: /^Hello,/i } }],
  cartLink:           [{ engine: 'css', value: 'a[href="/cart"]' }],
  cartBadge:          [{ engine: 'css', value: 'a[href="/cart"]' }],
  accountSettingsBtn: [{ engine: 'role', value: 'button', roleOptions: { name: 'Account settings' } }],

  navMen:             [{ engine: 'role', value: 'link', roleOptions: { name: 'Men', exact: true } }],
  navWomen:           [{ engine: 'role', value: 'link', roleOptions: { name: 'Women', exact: true } }],
  navKids:            [{ engine: 'role', value: 'link', roleOptions: { name: 'Kids', exact: true } }],
  navElectronics:     [{ engine: 'role', value: 'link', roleOptions: { name: 'Electronic', exact: true } }],
  navBeauty:          [{ engine: 'role', value: 'link', roleOptions: { name: 'Beauty', exact: true } }],
  categoryLink:       [{ engine: 'role', value: 'link', roleOptions: { name: '{{category}}' } }],

  welcomeHeading:     [{ engine: 'role', value: 'heading', roleOptions: { name: /Welcome to ShoppersStack/i } }],
  topCategoriesHeading: [{ engine: 'role', value: 'heading', roleOptions: { name: 'TOP CATEGORIES TO CHOOSE FROM' } }],
  featuredHeading:    [{ engine: 'role', value: 'heading', roleOptions: { name: 'Featured Products' } }],
  bannerSlideItem:    [{ engine: 'css', value: 'button[aria-label^="slide item"]' }],

  productCard:        [{ engine: 'css', value: 'article:has(> h1:has-text("Featured Products")) > div > div' }],
  addToCartButton:    [{ engine: 'role', value: 'button', roleOptions: { name: 'add to cart' } }],

  paginationNav:      [{ engine: 'role', value: 'navigation', roleOptions: { name: 'pagination navigation' } }],
  paginationNext:     [{ engine: 'role', value: 'button', roleOptions: { name: 'Go to next page' } }],
  paginationPrev:     [{ engine: 'role', value: 'button', roleOptions: { name: 'Go to previous page' } }],
  paginationPage:     [{ engine: 'role', value: 'button', roleOptions: { name: 'Go to page {{page}}' } }],
};
