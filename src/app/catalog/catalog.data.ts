import { Category, OptionValue, Product, ProductOption } from '../core/models';

/**
 * DEMO CATALOG — names, prices, options and stock are placeholder content.
 * Replace with real product data (or a fetch from your commerce backend) before launch.
 */

export const CATEGORIES: Category[] = [
  { id: 'chains', name: 'Chains', tagline: 'Weight you can see.' },
  { id: 'rings', name: 'Rings', tagline: 'Architecture for the hand.' },
  { id: 'bracelets', name: 'Bracelets', tagline: 'Made to be noticed at the wrist.' },
  { id: 'pendants', name: 'Pendants', tagline: 'A single, deliberate mark.' },
];

const v = (values: string[], unavailable: string[] = []): OptionValue[] =>
  values.map((value) => ({ value, label: value, available: !unavailable.includes(value) }));

const chainLength = (unavailable: string[] = []): ProductOption => ({
  id: 'length',
  label: 'Length',
  values: v(['45 cm', '50 cm', '55 cm', '60 cm'], unavailable),
});

const ringSize = (unavailable: string[] = []): ProductOption => ({
  id: 'size',
  label: 'Ring size (US)',
  values: v(['6', '7', '8', '9', '10', '11'], unavailable),
});

const wristSize = (unavailable: string[] = []): ProductOption => ({
  id: 'size',
  label: 'Wrist size',
  values: v(['S', 'M', 'L'], unavailable),
});

export const PRODUCTS: Product[] = [
  {
    id: 'p01',
    slug: 'vertebra-link-chain',
    name: 'Vertebra Link Chain',
    category: 'chains',
    description:
      'Elongated oval links with a hand-finished, rippled surface. Heavy in the eye, fluid on the body — the piece the collection is built around.',
    details: ['Elongated oval links', 'Rippled, high-polish surface', 'Substantial silhouette'],
    price: 34000,
    currency: 'USD',
    images: [
      { src: 'products/link-chain-photo.webp', alt: 'Chunky silver oval-link chain suspended against a dark background' },
      { src: 'products/link-chain-detail.webp', alt: 'Close view of interlocking oval links catching the light' },
    ],
    options: [chainLength(['60 cm'])],
    availability: 'in-stock',
    featured: 1,
  },
  {
    id: 'p02',
    slug: 'cable-ballast-chain',
    name: 'Ballast Cable Chain',
    category: 'chains',
    description: 'Tight, alternating cable links with a clean, mirror finish. Quiet enough to layer, strong enough to wear alone.',
    details: ['Compact alternating links', 'Mirror finish', 'Layers with pendants'],
    price: 18500,
    currency: 'USD',
    images: [
      { src: 'products/cable-ballast-chain-photo.png', alt: 'Polished silver cable chain on charcoal' },
    ],
    options: [chainLength()],
    availability: 'in-stock',
    featured: null,
  },
  {
    id: 'p03',
    slug: 'serpent-rope-chain',
    name: 'Serpent Rope Chain',
    category: 'chains',
    description: 'Angled links twisted into a continuous rope that throws light along its length as it moves.',
    details: ['Twisted rope construction', 'Light-catching facets', 'Fluid drape'],
    price: 22000,
    currency: 'USD',
    images: [
      { src: 'products/serpent-rope-chain-photo.png', alt: 'Serpent rope chain in polished silver' },
    ],
    options: [chainLength(['45 cm'])],
    availability: 'low-stock',
    featured: null,
  },
  {
    id: 'p04',
    slug: 'monolith-signet',
    name: 'Monolith Signet',
    category: 'rings',
    description: 'A squared signet with a stepped, architectural face. Blunt geometry, softened only where it meets the skin.',
    details: ['Stepped rectangular face', 'Broad band', 'Heavy profile'],
    price: 21000,
    currency: 'USD',
    images: [
      { src: 'products/monolith-signet-photo.png', alt: 'Monolith silver signet ring with a rectangular face' },
    ],
    options: [ringSize(['11'])],
    availability: 'in-stock',
    featured: 2,
  },
  {
    id: 'p05',
    slug: 'fracture-band',
    name: 'Fracture Band',
    category: 'rings',
    description: 'A wide, rounded band interrupted by deliberate, angular fault lines — polish against rupture.',
    details: ['Wide domed band', 'Cut fault-line detailing', 'Contrasting textures'],
    price: 16500,
    currency: 'USD',
    images: [
      { src: 'products/fracture-band-photo.png', alt: 'Silver fracture band on charcoal stone' },
    ],
    options: [ringSize()],
    availability: 'sold-out',
    featured: null,
  },
  {
    id: 'p06',
    slug: 'orbit-ring',
    name: 'Orbit Ring',
    category: 'rings',
    description: 'Two bands locked at an angle, sliding against each other as the hand moves.',
    details: ['Two interlocked bands', 'Moves as you wear it', 'Sculptural form'],
    price: 14500,
    currency: 'USD',
    images: [
      { src: 'products/orbit-ring-photo.png', alt: 'Sculptural silver orbit ring' },
    ],
    options: [ringSize(['6'])],
    availability: 'in-stock',
    featured: null,
  },
  {
    id: 'p07',
    slug: 'shackle-cuff',
    name: 'Shackle Cuff',
    category: 'bracelets',
    description: 'An open, heavy-gauge cuff with a softly squared profile. Slides on, stays put, reads from across the room.',
    details: ['Open cuff', 'Heavy-gauge profile', 'Brushed inner edge'],
    price: 26000,
    currency: 'USD',
    images: [
      { src: 'products/shackle-cuff-photo.png', alt: 'Polished silver shackle cuff' },
    ],
    options: [wristSize()],
    availability: 'in-stock',
    featured: 3,
  },
  {
    id: 'p08',
    slug: 'vertebra-bracelet',
    name: 'Vertebra Bracelet',
    category: 'bracelets',
    description: 'The Vertebra link, scaled for the wrist. Alternating oval and flat links in a closed loop.',
    details: ['Alternating oval links', 'Substantial weight', 'Pairs with the Vertebra chain'],
    price: 19500,
    currency: 'USD',
    images: [
      { src: 'products/vertebra-bracelet-photo.png', alt: 'Silver vertebra bracelet on stone' },
    ],
    options: [wristSize(['S'])],
    availability: 'low-stock',
    featured: null,
  },
  {
    id: 'p09',
    slug: 'torque-bangle',
    name: 'Torque Bangle',
    category: 'bracelets',
    description: 'A closed bangle with a ribbed, twisted body and a single polished terminal. One size.',
    details: ['Ribbed twisted body', 'Polished terminal', 'One size'],
    price: 15500,
    currency: 'USD',
    images: [
      { src: 'products/torque-bangle-photo.png', alt: 'Fluted silver torque bangle on charcoal stone' },
    ],
    options: [],
    availability: 'in-stock',
    featured: null,
  },
  {
    id: 'p10',
    slug: 'sigil-pendant',
    name: 'Sigil Pendant',
    category: 'pendants',
    description: 'An open ring circling a four-point star — a personal mark worn close. Supplied on a fine cable chain.',
    details: ['Open circle with star', 'Fine cable chain included', 'Ready to wear'],
    price: 12500,
    currency: 'USD',
    images: [
      { src: 'products/sigil-pendant-photo.png', alt: 'Sculptural silver sigil pendant' },
    ],
    options: [],
    availability: 'in-stock',
    featured: 4,
  },
  {
    id: 'p11',
    slug: 'blade-pendant',
    name: 'Blade Pendant',
    category: 'pendants',
    description: 'A curved, double-edged silhouette with a cut-out core. Sharp in outline, smooth to the touch.',
    details: ['Curved blade silhouette', 'Cut-out centre', 'Fine cable chain included'],
    price: 13500,
    currency: 'USD',
    images: [
      { src: 'products/blade-pendant-photo.png', alt: 'Polished silver arrowhead pendant' },
    ],
    options: [],
    availability: 'sold-out',
    featured: null,
  },
  {
    id: 'p12',
    slug: 'crest-pendant',
    name: 'Crest Pendant',
    category: 'pendants',
    description: 'Swept wings converging to a single point. Symmetry with an edge.',
    details: ['Winged, symmetrical form', 'Cut-out diamond detail', 'Fine cable chain included'],
    price: 14000,
    currency: 'USD',
    images: [
      { src: 'products/crest-pendant-photo.png', alt: 'Silver crest pendant on charcoal stone' },
    ],
    options: [],
    availability: 'low-stock',
    featured: null,
  },
  {
    id: 'p13',
    slug: 'oval-link-collar',
    name: 'Oval Link Collar',
    category: 'chains',
    description:
      'Hollow-formed oval links joined by rounded connectors, finished to a deep mirror polish. Graduated toward the front so the weight sits where it shows.',
    details: ['Graduated oval links', 'Rounded connector links', 'Spring-ring clasp'],
    price: 29500,
    currency: 'USD',
    images: [
      { src: 'products/oval-link-collar-photo.webp', alt: 'Chunky polished silver oval-link necklace laid out on a dark surface' },
      { src: 'products/oval-link-collar-detail.webp', alt: 'Close view of the polished oval links and connectors' },
    ],
    options: [chainLength(['60 cm'])],
    availability: 'in-stock',
    featured: null,
  },
  {
    id: 'p14',
    slug: 'curb-bracelet',
    name: 'Ledger Curb Bracelet',
    category: 'bracelets',
    description:
      'Wide, flattened curb links that lie flush against the wrist, closed with a squared box clasp. Mirror polish on every face.',
    details: ['Heavy flattened curb links', 'Squared box clasp', 'High-polish finish'],
    price: 23500,
    currency: 'USD',
    images: [
      { src: 'products/curb-bracelet-photo.webp', alt: 'Polished silver curb-link bracelet with a box clasp on dark stone' },
      { src: 'products/curb-bracelet-detail.webp', alt: 'Close view of the box clasp and curb links' },
    ],
    options: [wristSize()],
    availability: 'in-stock',
    featured: null,
  },
  {
    id: 'p15',
    slug: 'relic-pendant',
    name: 'Relic Shard Pendant',
    category: 'pendants',
    description:
      'A faceted, crystal-like shard with polished edges framing an oxidised, eroded core. Supplied on a fine cable chain.',
    details: ['Faceted shard silhouette', 'Oxidised textured core', 'Fine cable chain included'],
    price: 15500,
    currency: 'USD',
    images: [
      { src: 'products/relic-pendant-photo.webp', alt: 'Faceted silver shard pendant with a dark textured core on a fine chain' },
      { src: 'products/relic-pendant-detail.webp', alt: 'Close view of the oxidised texture inside the polished shard' },
    ],
    options: [],
    availability: 'in-stock',
    featured: null,
  },
  {
    id: 'p16',
    slug: 'fault-signet',
    name: 'Fault Signet',
    category: 'rings',
    description:
      'A cushion-square signet split by a single swept ridge, with blackened, textured recesses either side. Polished shoulders, brushed band.',
    details: ['Cushion-square face', 'Blackened textured recesses', 'Brushed band'],
    price: 19500,
    currency: 'USD',
    images: [
      { src: 'products/fault-signet-photo.webp', alt: 'Silver signet ring with a blackened, divided face on charcoal' },
      { src: 'products/fault-signet-detail.webp', alt: 'Close view of the signet face and its swept central ridge' },
    ],
    options: [ringSize()],
    availability: 'in-stock',
    featured: null,
  },
];
