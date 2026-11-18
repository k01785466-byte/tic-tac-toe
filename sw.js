/* Kesug Slots PWA service worker. Bump CACHE_VERSION when shipping a new release. */
const CACHE_VERSION = 'kesug-pwa-v2';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const SHELL_FILES = [
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];
const MAX_RUNTIME_ENTRIES = 240;
const OFFLINE_ASSETS = [
  "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/bold/style.css",
  "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/fill/style.css",
  "https://unpkg.com/@phosphor-icons/web@2.1.2/src/regular/style.css",
  "https://unpkg.com/@phosphor-icons/web@2.1.2/src/bold/style.css",
  "https://unpkg.com/@phosphor-icons/web@2.1.2/src/fill/style.css",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Alien%20monster/3D/alien_monster_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Amphora/3D/amphora_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Anchor/3D/anchor_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Axe/3D/axe_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Battery/3D/battery_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bell/3D/bell_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bone/3D/bone_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cat%20face/3D/cat_face_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cherries/3D/cherries_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Chestnut/3D/chestnut_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Christmas%20tree/3D/christmas_tree_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Classical%20building/3D/classical_building_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Collision/3D/collision_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Comet/3D/comet_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cow/3D/cow_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cowboy%20hat%20face/3D/cowboy_hat_face_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crescent%20moon/3D/crescent_moon_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crocodile/3D/crocodile_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crossed%20swords/3D/crossed_swords_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crown/3D/crown_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crystal%20ball/3D/crystal_ball_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Deer/3D/deer_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Dog%20face/3D/dog_face_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Dog/3D/dog_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Dolphin/3D/dolphin_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Dragon/3D/dragon_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Duck/3D/duck_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Eagle/3D/eagle_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Egg/3D/egg_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fire/3D/fire_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Firecracker/3D/firecracker_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fish/3D/fish_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fishing%20pole/3D/fishing_pole_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Four%20leaf%20clover/3D/four_leaf_clover_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fox/3D/fox_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Full%20moon/3D/full_moon_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Funeral%20urn/3D/funeral_urn_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Game%20die/3D/game_die_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Gear/3D/gear_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Gem%20stone/3D/gem_stone_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Giraffe/3D/giraffe_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Globe%20showing%20Europe-Africa/3D/globe_showing_europe-africa_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Globe%20with%20meridians/3D/globe_with_meridians_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Glowing%20star/3D/glowing_star_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Goblin/3D/goblin_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/High%20voltage/3D/high_voltage_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Honey%20pot/3D/honey_pot_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Honeybee/3D/honeybee_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Hook/3D/hook_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Horse%20face/3D/horse_face_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/House/3D/house_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Keycap%207/3D/keycap_7_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Koala/3D/koala_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Laptop/3D/laptop_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Lemon/3D/lemon_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Lion/3D/lion_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Locomotive/3D/locomotive_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Mermaid/3D/mermaid_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Milky%20way/3D/milky_way_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Moai/3D/moai_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Mobile%20phone/3D/mobile_phone_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Money%20bag/3D/money_bag_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Monkey%20face/3D/monkey_face_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/New%20moon/3D/new_moon_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Octopus/3D/octopus_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Open%20book/3D/open_book_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Owl/3D/owl_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Palm%20tree/3D/palm_tree_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Panda/3D/panda_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Paw%20prints/3D/paw_prints_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Pill/3D/pill_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Police%20officer/3D/police_officer_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Poodle/3D/poodle_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Rabbit%20face/3D/rabbit_face_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Raccoon/3D/raccoon_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Red%20paper%20lantern/3D/red_paper_lantern_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Rhinoceros/3D/rhinoceros_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Robot/3D/robot_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Rocket/3D/rocket_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Scarf/3D/scarf_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Scorpion/3D/scorpion_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Scroll/3D/scroll_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Seedling/3D/seedling_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shark/3D/shark_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shield/3D/shield_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shooting%20star/3D/shooting_star_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Skull/3D/skull_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Slot%20machine/3D/slot_machine_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20sunglasses/3D/smiling_face_with_sunglasses_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Snake/3D/snake_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Snow-capped%20mountain/3D/snow-capped_mountain_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Snowflake/3D/snowflake_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Snowman%20without%20snow/3D/snowman_without_snow_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Speedboat/3D/speedboat_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Star/3D/star_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Strawberry/3D/strawberry_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sun/3D/sun_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sunglasses/3D/sunglasses_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Tangerine/3D/tangerine_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Tennis/3D/tennis_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Tiger%20face/3D/tiger_face_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Tooth/3D/tooth_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Top%20hat/3D/top_hat_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Trident%20emblem/3D/trident_emblem_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Trophy/3D/trophy_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Turtle/3D/turtle_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Water%20pistol/3D/water_pistol_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Water%20wave/3D/water_wave_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Wolf/3D/wolf_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Wrapped%20gift/3D/wrapped_gift_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Zebra/3D/zebra_3d.png"
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(SHELL_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('kesug-pwa-') && name !== SHELL_CACHE && name !== RUNTIME_CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function trimRuntimeCache(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_RUNTIME_ENTRIES) return;
  await Promise.all(keys.slice(0, keys.length - MAX_RUNTIME_ENTRIES).map(key => cache.delete(key)));
}

async function cacheResponse(request, response) {
  if (!response || !(response.ok || response.type === 'opaque')) return;
  const cache = await caches.open(RUNTIME_CACHE);
  await cache.put(request, response.clone());
  await trimRuntimeCache(cache);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(SHELL_CACHE);
          await cache.put('./index.html', response.clone());
        }
        return response;
      } catch (_) {
        const cached = await caches.match(request) || await caches.match('./index.html');
        if (cached) return cached;
        return new Response('Kesug Slots пока не сохранён для офлайн-режима. Открой игру один раз при подключении к интернету.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    })());
    return;
  }

  if (sameOrigin) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && response.ok) await cacheResponse(request, response);
        return response;
      } catch (error) {
        throw error;
      }
    })());
    return;
  }

  // Keep previously loaded external styles, icon fonts, and images available offline.
  // Do not cache audio/video streams or arbitrary API responses.
  const cacheableAsset = ['style', 'font', 'image'].includes(request.destination);
  if (cacheableAsset && (url.protocol === 'https:' || url.protocol === 'http:')) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        await cacheResponse(request, response);
        return response;
      } catch (_) {
        return new Response('', { status: 504, statusText: 'Offline asset unavailable' });
      }
    })());
  }
});


self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'KESUG_PREPARE_OFFLINE') return;
  const reply = event.ports && event.ports[0];
  event.waitUntil((async () => {
    const cache = await caches.open(RUNTIME_CACHE);
    let completed = 0;
    let failed = 0;
    const total = OFFLINE_ASSETS.length;
    const batchSize = 5;
    for (let start = 0; start < total; start += batchSize) {
      const batch = OFFLINE_ASSETS.slice(start, start + batchSize);
      await Promise.all(batch.map(async url => {
        try {
          const request = new Request(url, { mode: 'no-cors', credentials: 'omit', cache: 'reload' });
          if (await cache.match(request)) { completed++; return; }
          const response = await fetch(request);
          if (response && (response.ok || response.type === 'opaque')) {
            await cache.put(request, response.clone());
            completed++;
          } else failed++;
        } catch (_) { failed++; }
      }));
      if (reply) reply.postMessage({ type: 'progress', completed, total, failed });
    }
    await trimRuntimeCache(cache);
    if (reply) reply.postMessage({ type: 'complete', completed, total, failed });
  })());
});
