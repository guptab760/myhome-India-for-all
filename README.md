# MyHome India

A mobile-first, privacy-first home management and Salary & EMI Planner.

## Run locally
Open `index.html` in a browser.

## GitHub Pages
1. Create a GitHub repository, for example `myhome-india`.
2. Upload all files in this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save and wait for GitHub Pages to publish the site.

The app currently stores data in the user's browser using `localStorage`; there is no server or database.

## Suggested next versions
- PWA service worker/offline support
- CSV/Excel export
- PDF reports
- Installable home-screen experience
- Recurring expenses
- More loan calculators
- Cloud sync/login
- Premium subscription
- Apartment/RWA edition
- Bengaluru service-provider marketplace

## v2 signature features
- True Monthly Family Cost
- Annual and quarterly expense annualisation
- Cost per day
- Expensive-month planner
- "Can I Afford This?" purchase simulator
- Monthly and annual cash-flow impact

## Affordability logic
- Estimates whether a purchase leaves positive monthly cash flow.
- Calculates the resulting household monthly-cost ratio.
- When cash flow is negative, identifies spending categories from the user's entered expenses and suggests targeted monthly reductions.
- If the gap remains, suggests changing purchase price/down payment/financing/timing rather than assuming all discretionary expenses can be cut.

- Make It Possible scenario sliders for price, down payment and tenure.

## v5 financial planning features
- Inflation assumption and India CPI reference
- Salary hike assumption
- Expenditure-growth assumption with optional 3/6-month trend inputs
- Five-year income vs family-cost projection
- Household spending-maintenance advice based on the user's numbers
- Guidance to prevent lifestyle inflation from absorbing salary increases

Official India CPI reference used for the default assumption: July 2026 CPI 4.45%; food inflation 5.52% (MoSPI/PIB).

- Colorful rupee-themed background and Good / Warning / Working visual status indicators.

- Financial Offers: investment, insurance and loan comparison links with profile-based guidance.

- Live Data tab with source links for current lender rates, insurance quotes and investment comparison pages; no hard-coded current rates.
