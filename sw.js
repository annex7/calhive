// CalHive Service Worker — Offline Support
const CACHE_NAME = 'calhive-v1';
const STATIC_ASSETS = [
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/utils.js',
  '/money/take-home-pay.html',
  '/money/mortgage.html',
  '/money/savings-goal.html',
  '/money/compound-interest.html',
  '/money/loan-repayment.html',
  '/money/rent-vs-buy.html',
  '/home/energy-bill.html',
  '/home/paint-coverage.html',
  '/home/moving-cost.html',
  '/home/bills-splitter.html',
  '/health/bmi.html',
  '/health/calorie-target.html',
  '/health/food-calories.html',
  '/health/calorie-distribution.html',
  '/health/macro-calculator.html',
  '/health/protein-calculator.html',
  '/health/water-intake.html',
  '/travel/cost-per-mile.html',
  '/travel/road-trip.html',
  '/travel/trip-budget.html',
  '/life-work/freelance-rate.html',
  '/life-work/true-hourly-wage.html',
  '/life-work/pension-pot.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => cached);
    })
  );
});
