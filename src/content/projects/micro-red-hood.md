---
title: Micro Red Hood
category: game-design
summary: A small two-stage pixel-art platformer built in microStudio, with all the art made by me.
cover: /images/projects/micro-red-hood/cover.webp
date: 2026-03-22
featured: true
pixelArt: true
role: Designer, artist, programmer
tools:
  - microStudio
itchUrl: https://redmage-gaming.itch.io/micro-red-hood
gallery:
  - image: /images/projects/micro-red-hood/stage-1.webp
    caption: Stage one
  - image: /images/projects/micro-red-hood/cover.webp
    caption: Stage two
  - image: /images/projects/micro-red-hood/tileset.webp
    caption: Tile set (16×16)
  - image: /images/projects/micro-red-hood/character.webp
    caption: Red Hood character sprite
---

A small platformer made in the microStudio engine, using 16×16 pixel tiles and character sprites. Red Hood has a full set of idle, walk and jump animations.

## What I did

I designed the tile sets and the character, enemy and collectible sprites. I built the levels with a mix of microStudio's tile-based level editor and code: enemies and collectibles are placed programmatically.

## Sprite work

Red Hood's idle, walk and jump animations:

![Red Hood animation frames](/images/projects/micro-red-hood/anim-player.webp)

Collectible gem:

![Gem animation frames](/images/projects/micro-red-hood/anim-gem.webp)

Card pickup:

![Card animation frames](/images/projects/micro-red-hood/anim-card.webp)

Enemy defeat:

![Enemy defeat animation frames](/images/projects/micro-red-hood/anim-enemy.webp)

## What I learned

Most of my time on this project went into a test-and-tweak loop: placing every collectible in both stages by hand-entering coordinates, then playing to check where they landed. It was incredibly tedious, and it gave me a real appreciation for full-featured engines like Godot, Unity and Unreal.

I'm currently remaking and expanding this game in Godot.
