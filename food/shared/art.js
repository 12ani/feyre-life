/* ============================================================
   THE DRAWINGS — one little line drawing per recipe, matched by
   slug. They're drawn in currentColor, so each page colours them
   with its own theme. A recipe without one just shows no picture.

   Kept apart from card.js so the list of recipes can show them as
   thumbnails too: load this file before card.js on a recipe page,
   and on its own on the list.
   ============================================================ */

const FOCACCIA_ART = `
<svg viewBox="0 0 240 200" fill="none" stroke="currentColor"
     stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- the slab, drawn a little wobbly on purpose -->
  <path d="M24 46c30-8 162-8 192 0 10 3 14 10 14 20v68c0 12-6 19-18 21-46 7-138 7-184 0-12-2-18-9-18-21V66c0-10 4-17 14-20z"/>
  <!-- crust line -->
  <path d="M36 60c26-6 142-6 168 0 6 2 9 6 9 12v52c0 8-5 13-13 14-40 5-120 5-160 0-8-1-13-6-13-14V72c0-6 3-10 9-12z" stroke-width="1.8"/>
  <!-- dimples -->
  <g stroke-width="1.9">
    <ellipse cx="60" cy="80" rx="5.4" ry="4.2"/><ellipse cx="96" cy="72" rx="4.8" ry="3.8"/>
    <ellipse cx="132" cy="80" rx="5.4" ry="4.2"/><ellipse cx="168" cy="72" rx="4.8" ry="3.8"/>
    <ellipse cx="198" cy="84" rx="5" ry="4"/><ellipse cx="78" cy="106" rx="5" ry="4"/>
    <ellipse cx="114" cy="98" rx="4.6" ry="3.6"/><ellipse cx="190" cy="110" rx="5" ry="4"/>
  </g>
  <!-- a sprig of rosemary: both leaves sweep BACK from each node,
       otherwise the pairs read as a fishbone -->
  <g stroke-width="1.7">
    <path d="M54 129c22-6 45-10 69-12"/>
    <path d="M70 126l-7-3.5M70 126l-7 3.5M86 123l-7-3.5M86 123l-7 3.5M101 121l-7-3.5M101 121l-7 3.5M115 119l-7-3.5M115 119l-7 3.5"/>
  </g>
  <!-- olives -->
  <g stroke-width="1.8">
    <circle cx="150" cy="122" r="6"/><circle cx="150" cy="122" r="2"/>
    <circle cx="172" cy="114" r="5"/><circle cx="172" cy="114" r="1.7"/>
  </g>
</svg>`;

/* a tall castella block with a slice cut off, wobbling */
const CASTELLA_ART = `
<svg viewBox="0 0 240 200" fill="none" stroke="currentColor"
     stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- the block: top, front, side -->
  <path d="M40 78c10-7 20-14 32-20 36-1 72-1 108 0-10 7-20 14-31 20-36 1-73 1-109 0z"/>
  <path d="M40 78c-1 30-1 58 1 86 36 2 72 2 108 0 2-28 2-56 0-86"/>
  <path d="M149 78c11-6 21-13 31-20 1 28 1 56-1 84-10 8-20 15-30 22"/>
  <!-- the brown top crust -->
  <path d="M41 92c36 2 72 2 108 0M149 92c10-6 20-13 30-20" stroke-width="1.8"/>
  <!-- the slice, leaning off to the right -->
  <path d="M170 116c4-4 9-8 14-11 12-1 24-2 36-2-4 4-9 8-14 11-12 1-24 1-36 2z"/>
  <path d="M170 116c0 18 1 36 3 54 12 0 23-1 35-2-2-18-3-36-2-54"/>
  <path d="M206 114c5-3 9-7 14-11 1 18 2 36 3 54-5 4-10 7-15 11"/>
  <path d="M171 126c12-1 24-1 35-2" stroke-width="1.8"/>
  <!-- airy crumb -->
  <g stroke-width="1.6">
    <circle cx="62" cy="116" r="2.2"/><circle cx="90" cy="130" r="1.8"/><circle cx="118" cy="112" r="2"/>
    <circle cx="74" cy="148" r="1.8"/><circle cx="128" cy="146" r="2.2"/><circle cx="104" cy="156" r="1.6"/>
    <circle cx="184" cy="142" r="1.8"/><circle cx="196" cy="156" r="1.6"/>
  </g>
  <!-- the jiggle -->
  <g stroke-width="1.8">
    <path d="M26 100c-6 10-6 24 0 34M16 108c-4 7-4 15 0 20"/>
    <path d="M94 44c4-3 8-3 12 0s8 3 12 0"/>
  </g>
</svg>`;

/* a round ogura with a wedge set aside, and the banana it came from */
const BANANA_OGURA_ART = `
<svg viewBox="0 0 240 200" fill="none" stroke="currentColor"
     stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- the round tin's worth of cake -->
  <path d="M40 66c0-11 25-20 56-20s56 9 56 20-25 20-56 20-56-9-56-20z"/>
  <path d="M40 66v32c0 11 25 20 56 20s56-9 56-20V66"/>
  <!-- the browned top, just inside the rim -->
  <path d="M47 70c7 7 26 12 49 12s42-5 49-12" stroke-width="1.8"/>
  <!-- one wedge, cut and set aside -->
  <path d="M168 126l48-16c6 7 10 18 10 30l-58-14z"/>
  <path d="M168 126v18l58 14v-18"/>
  <path d="M168 133l58 14" stroke-width="1.8"/>
  <!-- airy crumb -->
  <g stroke-width="1.6">
    <circle cx="60" cy="98" r="2"/><circle cx="82" cy="108" r="1.7"/>
    <circle cx="98" cy="96" r="1.6"/><circle cx="118" cy="105" r="1.9"/>
    <circle cx="138" cy="98" r="1.5"/>
    <circle cx="188" cy="139" r="1.7"/><circle cx="207" cy="147" r="1.5"/>
  </g>
  <!-- the banana it came from: blunt at the stem, both ends turned up -->
  <path d="M40 146c10 40 70 46 94 6l-8-11c-14 25-64 19-86 5z"/>
  <path d="M130 146l8-9M40 146l-4-3"/>
  <path d="M54 156c24 16 52 12 68-6" stroke-width="1.7"/>
</svg>`;

/* a bowl of set ganache with the spatula still standing in it,
   and the chopped chocolate it was made from */
const GANACHE_ART = `
<svg viewBox="0 0 240 200" fill="none" stroke="currentColor"
     stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- the bowl -->
  <path d="M32 106c0-9 25-16 56-16s56 7 56 16-25 16-56 16-56-7-56-16z"/>
  <path d="M32 106c0 30 25 52 56 52s56-22 56-52"/>
  <!-- the ganache sitting in it, a little below the rim -->
  <path d="M45 110c0-6 19-10 43-10s43 4 43 10-19 10-43 10-43-4-43-10z" stroke-width="1.9"/>
  <!-- the swirl left by the last stir -->
  <path d="M70 108c6-5 20-6 28-1" stroke-width="1.6"/>
  <!-- the spatula, handle out, blade buried in the ganache -->
  <path d="M112 104l52-50c3-3 5-3 8 0s3 5 0 8l-52 50"/>
  <!-- the chocolate it was made from: a bar and the chopped corners -->
  <path d="M166 136l30-10 11 24-30 10z"/>
  <path d="M176 133l11 24M186 129l11 24" stroke-width="1.7"/>
  <path d="M206 160l13-5 5 11-13 5z" stroke-width="1.9"/>
  <path d="M158 166l12-4 4 10-12 4z" stroke-width="1.9"/>
</svg>`;

/* the cake turned out, caramelled slices up, with the fruit it took */
const ORANGE_CAKE_ART = `
<svg viewBox="0 0 240 200" fill="none" stroke="currentColor"
     stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- the cake, already turned out -->
  <path d="M32 70c0-13 29-24 64-24s64 11 64 24-29 24-64 24-64-11-64-24z"/>
  <path d="M32 70v24c0 13 29 24 64 24s64-11 64-24V70"/>
  <!-- the caramel that ran down the side -->
  <path d="M38 78c8 9 30 15 58 15s50-6 58-15" stroke-width="1.8"/>
  <!-- three slices on top, flattened to the same angle as the cake.
       They stay plain rings: at the size this is drawn, segment lines
       inside something this small just fill in. The cut round below
       says orange for all of them. -->
  <g stroke-width="1.9">
    <path d="M44 62c0-4 9-8 20-8s20 4 20 8-9 8-20 8-20-4-20-8z"/>
    <path d="M52 62c0-2 5-4 12-4s12 2 12 4-5 4-12 4-12-2-12-4z" stroke-width="1.5"/>
    <path d="M108 62c0-4 9-8 20-8s20 4 20 8-9 8-20 8-20-4-20-8z"/>
    <path d="M116 62c0-2 5-4 12-4s12 2 12 4-5 4-12 4-12-2-12-4z" stroke-width="1.5"/>
    <path d="M76 78c0-4 9-8 20-8s20 4 20 8-9 8-20 8-20-4-20-8z"/>
    <path d="M84 78c0-2 5-4 12-4s12 2 12 4-5 4-12 4-12-2-12-4z" stroke-width="1.5"/>
  </g>
  <!-- one cut round, segments and all -->
  <circle cx="198" cy="58" r="24"/>
  <circle cx="198" cy="58" r="18" stroke-width="1.6"/>
  <g stroke-width="1.5">
    <path d="M198 55v-14M201 56l12-7M201 60l12 7M198 61v14M195 60l-12 7M195 56l-12-7"/>
  </g>
  <!-- and a whole one waiting its turn -->
  <circle cx="52" cy="160" r="19"/>
  <path d="M56 143c6-10 16-16 22-14-2 8-10 14-22 14z" stroke-width="1.9"/>
</svg>`;

const ART = {
  "sourdough-focaccia": FOCACCIA_ART,
  "castella-cake": CASTELLA_ART,
  "banana-ogura-cake": BANANA_OGURA_ART,
  "chocolate-ganache": GANACHE_ART,
  "orange-upside-down-cake": ORANGE_CAKE_ART
};
