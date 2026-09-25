# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library | Type | Notes |
|---------|------|-------|
| **Web Animations API (149 active)** | animation |  |
| Canvas (4 elements) | WebGL/3D | WebGL context detected — likely Three.js or custom shader |

## Scroll Journey

The page is **900px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero
Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section
Scroll position: 0px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section
Scroll position: 0px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page
Scroll position: 0px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content
Scroll position: 0px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer
Scroll position: 0px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer
Scroll position: 0px

![Scroll 100%](../screens/scroll/scroll-100.png)

## Scroll Animation Patterns

| Pattern | Library | Element Count | Duration | Delay | Easing |
|---------|---------|---------------|----------|-------|--------|
| sunrise | AOS | 1 | 2000 | 0 | — |
| fade-up | AOS | 2 | 1200 | 300 | — |

### AOS Implementation

```html
<!-- Add to <head> -->
<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">

<!-- Add before </body> -->
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>AOS.init({ once: true, offset: 80 });</script>
```

```html
<div data-aos="sunrise" data-aos-duration="2000" data-aos-delay="0">...</div>
```

```html
<div data-aos="fade-up" data-aos-duration="1200" data-aos-delay="300">...</div>
```

## CSS Keyframes (93 extracted)

### `@keyframes swal2-animate-error-icon`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-error.swal2-icon-show`, `div:where(.swal2-icon).swal2-warning.swal2-icon-show`, `div:where(.swal2-icon).swal2-info.swal2-icon-show`, `div:where(.swal2-icon).swal2-question.swal2-icon-show`

```css
@keyframes swal2-animate-error-icon {
  0% {
    transform: rotateX(100deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-animate-error-icon`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-error.swal2-icon-show`, `div:where(.swal2-icon).swal2-warning.swal2-icon-show`, `div:where(.swal2-icon).swal2-info.swal2-icon-show`, `div:where(.swal2-icon).swal2-question.swal2-icon-show`

```css
@keyframes swal2-animate-error-icon {
  0% {
    transform: rotateX(100deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes fa-spin`

Duration: `var(--fa-animation-duration,2s)` · Easing: `var(--fa-animation-timing,linear)` · Delay: `0s` · Iteration: `var(--fa-animation-iteration-count,infinite)` · Fill: `none`

Used by: `.fa-spin`, `.fa-pulse, .fa-spin-pulse`, `.pi-spin`

```css
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes fa-spin`

Duration: `var(--fa-animation-duration,2s)` · Easing: `var(--fa-animation-timing,linear)` · Delay: `0s` · Iteration: `var(--fa-animation-iteration-count,infinite)` · Fill: `none`

Used by: `.fa-spin`, `.fa-pulse, .fa-spin-pulse`, `.pi-spin`

```css
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes fa-spin`

Duration: `var(--fa-animation-duration,2s)` · Easing: `var(--fa-animation-timing,linear)` · Delay: `0s` · Iteration: `var(--fa-animation-iteration-count,infinite)` · Fill: `none`

Used by: `.fa-spin`, `.fa-pulse, .fa-spin-pulse`, `.pi-spin`

```css
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes fa-spin`

Duration: `var(--fa-animation-duration,2s)` · Easing: `var(--fa-animation-timing,linear)` · Delay: `0s` · Iteration: `var(--fa-animation-iteration-count,infinite)` · Fill: `none`

Used by: `.fa-spin`, `.fa-pulse, .fa-spin-pulse`, `.pi-spin`

```css
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes fa-spin`

Duration: `var(--fa-animation-duration,2s)` · Easing: `var(--fa-animation-timing,linear)` · Delay: `0s` · Iteration: `var(--fa-animation-iteration-count,infinite)` · Fill: `none`

Used by: `.fa-spin`, `.fa-pulse, .fa-spin-pulse`, `.pi-spin`

```css
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_shutterTravel`

Duration: `6s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.shutter-pulse-0[_ngcontent-ng-c556426719]`, `.shutter-pulse-1[_ngcontent-ng-c556426719]`, `.shutter-pulse-2[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_shutterTravel {
  0%, 100% {
    opacity: 0.3;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.8);
  }
}
```

> Opacity fade · Filter effect (blur/brightness)

### `@keyframes swal2-animate-i-mark`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content`, `div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content`

```css
@keyframes swal2-animate-i-mark {
  0% {
    transform: rotateZ(45deg);
    opacity: 0;
  }
  25% {
    transform: rotateZ(-25deg);
    opacity: 0.4;
  }
  50% {
    transform: rotateZ(15deg);
    opacity: 0.8;
  }
  75% {
    transform: rotateZ(-5deg);
    opacity: 1;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-animate-i-mark`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content`, `div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content`

```css
@keyframes swal2-animate-i-mark {
  0% {
    transform: rotateZ(45deg);
    opacity: 0;
  }
  25% {
    transform: rotateZ(-25deg);
    opacity: 0.4;
  }
  50% {
    transform: rotateZ(15deg);
    opacity: 0.8;
  }
  75% {
    transform: rotateZ(-5deg);
    opacity: 1;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c556426719_heavyRotation`

Duration: `38s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.dominant-orbit[_ngcontent-ng-c556426719]`, `.secondary-orbit[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_heavyRotation {
  0% {
    transform: rotate(35deg);
  }
  50% {
    transform: rotate(55deg);
  }
  100% {
    transform: rotate(35deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_orbitDash`

Duration: `20s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.orbit-primary[_ngcontent-ng-c556426719]`, `.orbit-secondary[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_orbitDash {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -1000;
  }
}
```

> SVG stroke animation

### `@keyframes _ngcontent-ng-c556426719_energyPacket`

Duration: `2s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.energy-flow[_ngcontent-ng-c556426719]`, `.energy-flow-2[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_energyPacket {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -400;
  }
}
```

> SVG stroke animation

### `@keyframes _ngcontent-ng-c2631132637_carousel-scroll-left`

Duration: `75s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.page-view[_ngcontent-ng-c2631132637] .sponsors-track.left-track[_ngcontent-ng-c`, `.page-view[_ngcontent-ng-c2631132637] .investors-track.left-track[_ngcontent-ng-`

```css
@keyframes _ngcontent-ng-c2631132637_carousel-scroll-left {
  0% {
    transform: translate(0px);
  }
  100% {
    transform: translate(-50%);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c2631132637_carousel-scroll-right`

Duration: `75s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.page-view[_ngcontent-ng-c2631132637] .sponsors-track.right-track[_ngcontent-ng-`, `.page-view[_ngcontent-ng-c2631132637] .investors-track.right-track[_ngcontent-ng`

```css
@keyframes _ngcontent-ng-c2631132637_carousel-scroll-right {
  0% {
    transform: translate(-50%);
  }
  100% {
    transform: translate(0px);
  }
}
```

> Transform/motion animation

### `@keyframes progress-bar-stripes`

Duration: `1s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.progress-bar-animated`

```css
@keyframes progress-bar-stripes {
  0% {
    background-position-x: 1rem;
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes placeholder-glow`

Duration: `2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.placeholder-glow .placeholder`

```css
@keyframes placeholder-glow {
  50% {
    opacity: 0.2;
  }
}
```

> Opacity fade

### `@keyframes placeholder-wave`

Duration: `2s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.placeholder-wave`

```css
@keyframes placeholder-wave {
  100% {
    -webkit-mask-position-x: -200%;
    -webkit-mask-position-y: 0%;
  }
}
```

### `@keyframes fa-beat`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,ease-in-out)` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-beat`

```css
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale,1.25));
  }
}
```

> Transform/motion animation

### `@keyframes fa-beat`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,ease-in-out)` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-beat`

```css
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale,1.25));
  }
}
```

> Transform/motion animation

### `@keyframes fa-bounce`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,cubic-bezier(.28,.84,.42,1))` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-bounce`

```css
@keyframes fa-bounce {
  0% {
    transform: scale(1) translateY(0px);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x,1.1),var(--fa-bounce-start-scale-y,.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x,.9),var(--fa-bounce-jump-scale-y,1.1)) translateY(var(--fa-bounce-height,-.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x,1.05),var(--fa-bounce-land-scale-y,.95)) translateY(0);
  }
  57% {
    transform: scale(1) translateY(var(--fa-bounce-rebound,-.125em));
  }
  64% {
    transform: scale(1) translateY(0px);
  }
  100% {
    transform: scale(1) translateY(0px);
  }
}
```

> Transform/motion animation

### `@keyframes fa-bounce`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,cubic-bezier(.28,.84,.42,1))` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-bounce`

```css
@keyframes fa-bounce {
  0% {
    transform: scale(1) translateY(0px);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x,1.1),var(--fa-bounce-start-scale-y,.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x,.9),var(--fa-bounce-jump-scale-y,1.1)) translateY(var(--fa-bounce-height,-.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x,1.05),var(--fa-bounce-land-scale-y,.95)) translateY(0);
  }
  57% {
    transform: scale(1) translateY(var(--fa-bounce-rebound,-.125em));
  }
  64% {
    transform: scale(1) translateY(0px);
  }
  100% {
    transform: scale(1) translateY(0px);
  }
}
```

> Transform/motion animation

### `@keyframes fa-fade`

Easing: `var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-fade`

```css
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity,.4);
  }
}
```

> Opacity fade

### `@keyframes fa-fade`

Easing: `var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-fade`

```css
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity,.4);
  }
}
```

> Opacity fade

### `@keyframes fa-beat-fade`

Easing: `var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-beat-fade`

```css
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity,.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale,1.125));
  }
}
```

> Fade + motion enter animation

### `@keyframes fa-beat-fade`

Easing: `var(--fa-animation-timing,cubic-bezier(.4,0,.6,1))` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-beat-fade`

```css
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity,.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale,1.125));
  }
}
```

> Fade + motion enter animation

### `@keyframes fa-flip`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,ease-in-out)` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-flip`

```css
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),var(--fa-flip-angle,-180deg));
  }
}
```

> Transform/motion animation

### `@keyframes fa-flip`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,ease-in-out)` · Delay: `var(--fa-animation-delay,0s)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-flip`

```css
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),var(--fa-flip-angle,-180deg));
  }
}
```

> Transform/motion animation

### `@keyframes fa-shake`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,linear)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-shake`

```css
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes fa-shake`

Duration: `var(--fa-animation-duration,1s)` · Easing: `var(--fa-animation-timing,linear)` · Iteration: `var(--fa-animation-iteration-count,infinite)`

Used by: `.fa-shake`

```css
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-show`

Duration: `0.3s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-show`

```css
@keyframes swal2-show {
  0% {
    transform: translate3d(0px, -50px, 0px) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: translate3d(0px, 0px, 0px) scale(1);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-hide`

Duration: `0.15s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.swal2-hide`

```css
@keyframes swal2-hide {
  0% {
    transform: translate3d(0px, 0px, 0px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate3d(0px, -50px, 0px) scale(0.9);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-animate-success-line-tip`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip`

```css
@keyframes swal2-animate-success-line-tip {
  0% {
    top: 1.1875em;
    left: 0.0625em;
    width: 0px;
  }
  54% {
    top: 1.0625em;
    left: 0.125em;
    width: 0px;
  }
  70% {
    top: 2.1875em;
    left: -0.375em;
    width: 3.125em;
  }
  84% {
    top: 3em;
    left: 1.3125em;
    width: 1.0625em;
  }
  100% {
    top: 2.8125em;
    left: 0.8125em;
    width: 1.5625em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-animate-success-line-long`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long`

```css
@keyframes swal2-animate-success-line-long {
  0% {
    top: 3.375em;
    right: 2.875em;
    width: 0px;
  }
  65% {
    top: 3.375em;
    right: 2.875em;
    width: 0px;
  }
  84% {
    top: 2.1875em;
    right: 0px;
    width: 3.4375em;
  }
  100% {
    top: 2.375em;
    right: 0.5em;
    width: 2.9375em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-rotate-success-circular-line`

Duration: `4.25s` · Easing: `ease-in` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-lin`

```css
@keyframes swal2-rotate-success-circular-line {
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-animate-error-x-mark`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark`

```css
@keyframes swal2-animate-error-x-mark {
  0% {
    margin-top: 1.625em;
    transform: scale(0.4);
    opacity: 0;
  }
  50% {
    margin-top: 1.625em;
    transform: scale(0.4);
    opacity: 0;
  }
  80% {
    margin-top: -0.375em;
    transform: scale(1.15);
  }
  100% {
    margin-top: 0px;
    transform: scale(1);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-rotate-loading`

Duration: `1.5s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `div:where(.swal2-container) div:where(.swal2-loader)`

```css
@keyframes swal2-rotate-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-animate-question-mark`

Duration: `0.8s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content`

```css
@keyframes swal2-animate-question-mark {
  0% {
    transform: rotateY(-360deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-toast-show`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast.swal2-show`

```css
@keyframes swal2-toast-show {
  0% {
    transform: translateY(-0.625em) rotateZ(2deg);
  }
  33% {
    transform: translateY(0px) rotateZ(-2deg);
  }
  66% {
    transform: translateY(0.3125em) rotateZ(2deg);
  }
  100% {
    transform: translateY(0px) rotateZ(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-toast-hide`

Duration: `0.1s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.swal2-toast.swal2-hide`

```css
@keyframes swal2-toast-hide {
  100% {
    transform: rotateZ(1deg);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-toast-animate-success-line-tip`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip`

```css
@keyframes swal2-toast-animate-success-line-tip {
  0% {
    top: 0.5625em;
    left: 0.0625em;
    width: 0px;
  }
  54% {
    top: 0.125em;
    left: 0.125em;
    width: 0px;
  }
  70% {
    top: 0.625em;
    left: -0.25em;
    width: 1.625em;
  }
  84% {
    top: 1.0625em;
    left: 0.75em;
    width: 0.5em;
  }
  100% {
    top: 1.125em;
    left: 0.1875em;
    width: 0.75em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-toast-animate-success-line-long`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long`

```css
@keyframes swal2-toast-animate-success-line-long {
  0% {
    top: 1.625em;
    right: 1.375em;
    width: 0px;
  }
  65% {
    top: 1.25em;
    right: 0.9375em;
    width: 0px;
  }
  84% {
    top: 0.9375em;
    right: 0px;
    width: 1.125em;
  }
  100% {
    top: 0.9375em;
    right: 0.1875em;
    width: 1.375em;
  }
}
```

> Dimension expand/collapse

### `@keyframes fadeOut`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `#first_page_loading.fade-out`

```css
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
```

> Opacity fade

### `@keyframes cdk-text-field-autofill-start`

Duration: `0s` · Easing: `ease` · Delay: `1ms` · Iteration: `1` · Fill: `none`

Used by: `.cdk-text-field-autofill-monitored:-webkit-autofill`

```css
@keyframes cdk-text-field-autofill-start {
}
```

### `@keyframes cdk-text-field-autofill-end`

Duration: `0s` · Easing: `ease` · Delay: `1ms` · Iteration: `1` · Fill: `none`

Used by: `.cdk-text-field-autofill-monitored:not(:-webkit-autofill)`

```css
@keyframes cdk-text-field-autofill-end {
}
```

### `@keyframes swal2-show`

Duration: `0.3s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-show`

```css
@keyframes swal2-show {
  0% {
    transform: scale(0.7);
  }
  45% {
    transform: scale(1.05);
  }
  80% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-hide`

Duration: `0.15s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.swal2-hide`

```css
@keyframes swal2-hide {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.5);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-animate-success-line-tip`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip`

```css
@keyframes swal2-animate-success-line-tip {
  0% {
    top: 1.1875em;
    left: 0.0625em;
    width: 0px;
  }
  54% {
    top: 1.0625em;
    left: 0.125em;
    width: 0px;
  }
  70% {
    top: 2.1875em;
    left: -0.375em;
    width: 3.125em;
  }
  84% {
    top: 3em;
    left: 1.3125em;
    width: 1.0625em;
  }
  100% {
    top: 2.8125em;
    left: 0.8125em;
    width: 1.5625em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-animate-success-line-long`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long`

```css
@keyframes swal2-animate-success-line-long {
  0% {
    top: 3.375em;
    right: 2.875em;
    width: 0px;
  }
  65% {
    top: 3.375em;
    right: 2.875em;
    width: 0px;
  }
  84% {
    top: 2.1875em;
    right: 0px;
    width: 3.4375em;
  }
  100% {
    top: 2.375em;
    right: 0.5em;
    width: 2.9375em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-rotate-success-circular-line`

Duration: `4.25s` · Easing: `ease-in` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-lin`

```css
@keyframes swal2-rotate-success-circular-line {
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-animate-error-x-mark`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark`

```css
@keyframes swal2-animate-error-x-mark {
  0% {
    margin-top: 1.625em;
    transform: scale(0.4);
    opacity: 0;
  }
  50% {
    margin-top: 1.625em;
    transform: scale(0.4);
    opacity: 0;
  }
  80% {
    margin-top: -0.375em;
    transform: scale(1.15);
  }
  100% {
    margin-top: 0px;
    transform: scale(1);
    opacity: 1;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-rotate-loading`

Duration: `1.5s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `div:where(.swal2-container) div:where(.swal2-loader)`

```css
@keyframes swal2-rotate-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-animate-question-mark`

Duration: `0.8s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content`

```css
@keyframes swal2-animate-question-mark {
  0% {
    transform: rotateY(-360deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-toast-show`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast.swal2-show`

```css
@keyframes swal2-toast-show {
  0% {
    transform: translateY(-0.625em) rotateZ(2deg);
  }
  33% {
    transform: translateY(0px) rotateZ(-2deg);
  }
  66% {
    transform: translateY(0.3125em) rotateZ(2deg);
  }
  100% {
    transform: translateY(0px) rotateZ(0deg);
  }
}
```

> Transform/motion animation

### `@keyframes swal2-toast-hide`

Duration: `0.1s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.swal2-toast.swal2-hide`

```css
@keyframes swal2-toast-hide {
  100% {
    transform: rotateZ(1deg);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swal2-toast-animate-success-line-tip`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip`

```css
@keyframes swal2-toast-animate-success-line-tip {
  0% {
    top: 0.5625em;
    left: 0.0625em;
    width: 0px;
  }
  54% {
    top: 0.125em;
    left: 0.125em;
    width: 0px;
  }
  70% {
    top: 0.625em;
    left: -0.25em;
    width: 1.625em;
  }
  84% {
    top: 1.0625em;
    left: 0.75em;
    width: 0.5em;
  }
  100% {
    top: 1.125em;
    left: 0.1875em;
    width: 0.75em;
  }
}
```

> Dimension expand/collapse

### `@keyframes swal2-toast-animate-success-line-long`

Duration: `0.75s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long`

```css
@keyframes swal2-toast-animate-success-line-long {
  0% {
    top: 1.625em;
    right: 1.375em;
    width: 0px;
  }
  65% {
    top: 1.25em;
    right: 0.9375em;
    width: 0px;
  }
  84% {
    top: 0.9375em;
    right: 0px;
    width: 1.125em;
  }
  100% {
    top: 0.9375em;
    right: 0.1875em;
    width: 1.375em;
  }
}
```

> Dimension expand/collapse

### `@keyframes _ngcontent-ng-c1538231108_traceOutline`

Duration: `3s` · Easing: `cubic-bezier(0.4, 0, 0.2, 1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.loader-logo-container[_ngcontent-ng-c1538231108] .logo-outline[_ngcontent-ng-c1`

```css
@keyframes _ngcontent-ng-c1538231108_traceOutline {
  0% {
    stroke-dashoffset: 3000;
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
  60% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  80% {
    stroke-dashoffset: 0;
    opacity: 0.8;
  }
  100% {
    stroke-dashoffset: -3000;
    opacity: 0.3;
  }
}
```

> Opacity fade · SVG stroke animation

### `@keyframes _ngcontent-ng-c1538231108_fillLeftToRight`

Duration: `3s` · Easing: `cubic-bezier(0.4, 0, 0.2, 1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.loader-logo-container[_ngcontent-ng-c1538231108] .logo-filled[_ngcontent-ng-c15`

```css
@keyframes _ngcontent-ng-c1538231108_fillLeftToRight {
  0% {
    clip-path: inset(0px 100% 0px 0px);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  50% {
    clip-path: inset(0px 0% 0px 0px);
    opacity: 1;
  }
  75% {
    clip-path: inset(0px 0% 0px 0px);
    opacity: 1;
  }
  95% {
    clip-path: inset(0px 0px 0px 100%);
    opacity: 0;
  }
  100% {
    clip-path: inset(0px 100% 0px 0px);
    opacity: 0;
  }
}
```

> Opacity fade · Clip-path reveal

### `@keyframes _ngcontent-ng-c556426719_bgDrift0`

Duration: `180s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.bg-drift-0[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_bgDrift0 {
  0% {
    transform: rotate(0deg);
    transform-origin: 500px 500px;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: 500px 500px;
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_bgDrift1`

Duration: `220s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.bg-drift-1[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_bgDrift1 {
  0% {
    transform: rotate(0deg);
    transform-origin: 500px 500px;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: 500px 500px;
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_bgDrift2`

Duration: `150s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.bg-drift-2[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_bgDrift2 {
  0% {
    transform: rotate(0deg);
    transform-origin: 500px 500px;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: 500px 500px;
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_bgDrift3`

Duration: `280s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.bg-drift-3[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_bgDrift3 {
  0% {
    transform: rotate(0deg);
    transform-origin: 500px 500px;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: 500px 500px;
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_innerRingSpin`

Duration: `25s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.inner-ring[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_innerRingSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_nucleusJitter`

Duration: `14s` · Easing: `cubic-bezier(0.42, 0, 0.58, 1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.nucleus-assembly[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_nucleusJitter {
  0%, 100% {
    transform: translate(0px);
  }
  25% {
    transform: translate(35px, -30px);
  }
  50% {
    transform: translate(-20px, 25px);
  }
  75% {
    transform: translate(25px, 15px);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_gyroSweep1`

Duration: `12s` · Easing: `cubic-bezier(0.45, 0.05, 0.55, 0.95)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.gyro-sweep-1[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_gyroSweep1 {
  0% {
    transform: rotate(0deg) scaleY(1);
  }
  25% {
    transform: rotate(90deg) scaleY(0.7);
  }
  50% {
    transform: rotate(180deg) scaleY(1.2);
  }
  75% {
    transform: rotate(270deg) scaleY(0.8);
  }
  100% {
    transform: rotate(360deg) scaleY(1);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_gyroSweep2`

Duration: `8s` · Easing: `cubic-bezier(0.45, 0.05, 0.55, 0.95)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.gyro-sweep-2[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_gyroSweep2 {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_satOrbit`

Duration: `200s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.sat-rotate[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_satOrbit {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c556426719_satPulse`

Duration: `4s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.sat-pulse[_ngcontent-ng-c556426719]`

```css
@keyframes _ngcontent-ng-c556426719_satPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c2631132637_fadeOut`

Duration: `0.5s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `#first_page_loading.fade-out[_ngcontent-ng-c2631132637]`

```css
@keyframes _ngcontent-ng-c2631132637_fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
```

> Opacity fade

### `@keyframes _ngcontent-ng-c2631132637_rotate-3d-carousel-1`

Duration: `60s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.wheel-1[_ngcontent-ng-c2631132637]`

```css
@keyframes _ngcontent-ng-c2631132637_rotate-3d-carousel-1 {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(-360deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c2631132637_rotate-3d-carousel-2`

Duration: `60s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.wheel-2[_ngcontent-ng-c2631132637]`

```css
@keyframes _ngcontent-ng-c2631132637_rotate-3d-carousel-2 {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c255798220_cinematicReveal`

Duration: `1.8s` · Easing: `cubic-bezier(0.16, 1, 0.3, 1)` · Delay: `0.8s` · Iteration: `1` · Fill: `both`

Used by: `.header[_ngcontent-ng-c255798220] .hero-content[_ngcontent-ng-c255798220] .logo[`

```css
@keyframes _ngcontent-ng-c255798220_cinematicReveal {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c255798220_slideUp`

Duration: `1s` · Easing: `cubic-bezier(0.16, 1, 0.3, 1)` · Delay: `1.2s` · Iteration: `1` · Fill: `both`

Used by: `.header[_ngcontent-ng-c255798220] .hero-content[_ngcontent-ng-c255798220] .hero-`

```css
@keyframes _ngcontent-ng-c255798220_slideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c1274894921_contentFade`

Duration: `0.5s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.stats-split-section[_ngcontent-ng-c1274894921] .right-half-content[_ngcontent-n`

```css
@keyframes _ngcontent-ng-c1274894921_contentFade {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c3300627814_scroll-up`

Duration: `35s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.track-up[_ngcontent-ng-c3300627814]`

```css
@keyframes _ngcontent-ng-c3300627814_scroll-up {
  0% {
    transform: translateZ(0px);
  }
  100% {
    transform: translate3d(0px, -50%, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c3559033405_glowFloat`

Duration: `5s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.flare-glow[_ngcontent-ng-c3559033405]`

```css
@keyframes _ngcontent-ng-c3559033405_glowFloat {
  0% {
    transform: translate(-3%, 5px) scale(0.95);
  }
  50% {
    transform: translate(3%, -8px) scale(1.05);
  }
  100% {
    transform: translate(-2%, -2px) scale(1);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c3559033405_floatFlame1`

Duration: `7s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.flame-1[_ngcontent-ng-c3559033405]`

```css
@keyframes _ngcontent-ng-c3559033405_floatFlame1 {
  0% {
    transform: translate(0px) scale(0.9);
    opacity: 0;
  }
  20% {
    opacity: 0.9;
  }
  50% {
    transform: translate(20px, -5px) scale(1.1);
    opacity: 0.7;
  }
  80% {
    opacity: 0.3;
  }
  100% {
    transform: translate(35px, -10px) scale(0.9);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c3559033405_floatFlame2`

Duration: `9s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.flame-2[_ngcontent-ng-c3559033405]`

```css
@keyframes _ngcontent-ng-c3559033405_floatFlame2 {
  0% {
    transform: translate(0px) scale(0.85);
    opacity: 0;
  }
  30% {
    opacity: 0.8;
  }
  60% {
    transform: translate(-30px, -8px) scale(1.15);
    opacity: 0.6;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    transform: translate(-45px, -12px) scale(0.8);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes _ngcontent-ng-c3559033405_floatFlame3`

Duration: `5s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.flame-3[_ngcontent-ng-c3559033405]`

```css
@keyframes _ngcontent-ng-c3559033405_floatFlame3 {
  0% {
    transform: translate(0px) scale(0.8);
    opacity: 0;
  }
  25% {
    opacity: 0.95;
  }
  50% {
    transform: translate(-10px, -10px) scale(1.2);
    opacity: 0.8;
  }
  75% {
    opacity: 0.4;
  }
  100% {
    transform: translate(5px, -15px) scale(0.8);
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes spinner-border`

```css
@keyframes spinner-border {
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes spinner-grow`

```css
@keyframes spinner-grow {
  0% {
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: none;
  }
}
```

> Fade + motion enter animation

### `@keyframes p-icon-spin`

```css
@keyframes p-icon-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes p-icon-spin`

```css
@keyframes p-icon-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes p-icon-spin`

```css
@keyframes p-icon-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
```

> Transform/motion animation

### `@keyframes ripple`

```css
@keyframes ripple {
  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}
```

> Fade + motion enter animation

### `@keyframes mdc-linear-progress-buffering`

```css
@keyframes mdc-linear-progress-buffering {
}
```

### `@keyframes _ngcontent-ng-c1601828135_parallaxMove`

```css
@keyframes _ngcontent-ng-c1601828135_parallaxMove {
  0%, 100% {
    transform: scale(1) translateY(0px);
  }
  50% {
    transform: scale(1.05) translateY(-10px);
  }
}
```

> Transform/motion animation

### `@keyframes _ngcontent-ng-c1601828135_shimmer`

```css
@keyframes _ngcontent-ng-c1601828135_shimmer {
  0% {
    opacity: 0.85;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes _ngcontent-ng-c2631132637_border-anim-short`

```css
@keyframes _ngcontent-ng-c2631132637_border-anim-short {
  0% {
    --bg-rot-angle: 0deg;
  }
  10% {
    --bg-rot-angle: 30deg;
  }
  40% {
    --bg-rot-angle: 150deg;
  }
  60% {
    --bg-rot-angle: 210deg;
  }
  90% {
    --bg-rot-angle: 330deg;
  }
  100% {
    --bg-rot-angle: 360deg;
  }
}
```

### `@keyframes charDropIn`

```css
@keyframes charDropIn {
  0% {
    opacity: 0;
    transform: translateY(35px);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes rzp-rot`

```css
@keyframes rzp-rot {
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes rzp-rot`

```css
@keyframes rzp-rot {
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

## Motion Tokens (CSS Variables)

### Animation Tokens

```css
--swal2-show-animation: swal2-show 0.3s;
--swal2-hide-animation: swal2-hide 0.15s forwards;
--swal2-toast-show-animation: swal2-toast-show 0.5s;
--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;
```

### Other Tokens

```css
--swal2-backdrop-transition: background-color 0.15s;
--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;
--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;
--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;
```

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
transition: background-position 0.15s ease-in-out;
transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
transition: opacity 0.15s linear;
transition: height 0.35s;
transition: width 0.35s;
transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
transition: var(--bs-navbar-toggler-transition);
transition: var(--bs-accordion-transition);
transition: var(--bs-accordion-btn-icon-transition);
```

## How to Recreate This Motion Design

### Step 1 — Install Dependencies

```bash
```

### Step 2 — Scroll-Reveal Pattern

Elements that animate into view follow this pattern:

```css
/* Initial hidden state */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **WebGL/3D layer detected** — product visualizations use Three.js or custom WebGL. Use `<canvas>` with Three.js for 3D product renders
- **Canvas elements (4)** — animated via requestAnimationFrame loop. Use canvas for particle effects, gradient animations, and WebGL scenes
- **Duration scale:** `0.15s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`0px`) → `screens/scroll/scroll-017.png`
- **33%** (`0px`) → `screens/scroll/scroll-033.png`
- **50%** (`0px`) → `screens/scroll/scroll-050.png`
- **67%** (`0px`) → `screens/scroll/scroll-067.png`
- **83%** (`0px`) → `screens/scroll/scroll-083.png`
- **100%** (`0px`) → `screens/scroll/scroll-100.png`

