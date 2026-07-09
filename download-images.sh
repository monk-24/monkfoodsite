#!/usr/bin/env bash
# Downloads all site photos into assets/img/ so they are self-hosted
# (no dependency on Unsplash). Run this once from the project folder:
#
#     bash download-images.sh
#
# Then commit the images:  git add -A && git commit -m "Self-host images" && git push
#
# Photos are from Unsplash (Unsplash License: free for commercial use, no attribution).
set -e
mkdir -p assets/img

dl () {  # dl <unsplash-id> <filename> <width>
  echo "  downloading $2 ..."
  curl -fsSL "https://images.unsplash.com/photo-$1?w=$3&q=80&auto=format&fit=crop&fm=jpg" -o "assets/img/$2"
}

dl 1504674900247-0877df9cc836 hero-food.jpg        1200
dl 1498837167922-ddd27525d352 hero-mobile.jpg      1200
dl 1513104890138-7c749659a591 tile-pizza.jpg        800
dl 1568901346375-23c9450c58cd tile-burger.jpg       800
dl 1585937421612-70a008356fbe tile-curry.jpg        800
dl 1579584425555-c3ce17fd4351 tile-sushi.jpg        800
dl 1517248135467-4c7edcad34c4 venue-restaurant.jpg  900
dl 1526367790999-0150786686a2 venue-takeaway.jpg    900
dl 1514933651103-005eec06c04b venue-bar.jpg         900
dl 1726064855881-3bbb7000b29f svc-online.jpg        800
dl 1556742502-ec7c0e9f34b1    svc-epos.jpg          800
dl 1595079835357-a94a13cab10c svc-qr.jpg            800
dl 1470256699805-a29e1b58598a svc-menu.jpg          800
dl 1760169799369-2b8574466735 svc-kitchen.jpg       800
dl 1551288049-bebda4e38f71    svc-reports.jpg       800

echo ""
echo "✅ Done — $(ls assets/img | wc -l | tr -d ' ') images saved to assets/img/"
echo "Next:  git add -A && git commit -m \"Self-host images\" && git push"
