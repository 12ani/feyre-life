/* ============================================================
   PACKING — every item on the list lives in this one file, and
   it's the only file you need to edit to change the list.
   No logic lives here, just the things to bring. Add a line,
   save, refresh the page.

   Each item needs a name. Everything else is optional:
     perDay   how many per day of the trip   (perDay: 1 → one a day)
     every    one per this many days         (every: 3 → 7 days = 3)
     extra    add this many on top           (extra: 1 → a spare)
     max      never more than this many
     minDays  only on trips at least this long
     when     only when that toggle is on    (when: "abroad")
     note     a short aside under the name
   An item without perDay / every / extra is a single thing,
   shown without a number.

   With "Laundry on the trip" switched on, clothes are counted
   for `laundryDays` at most — pack a week, wash, repeat.
   ============================================================ */

const PACKING = {
  defaultDays: 7,
  laundryDays: 7,

  /* the toggles at the top; an item's `when` names one of these ids */
  options: [
    { id: "abroad",  label: "Going abroad" },
    { id: "cold",    label: "Cold weather" },
    { id: "swim",    label: "Swimming" },
    { id: "dressy",  label: "Dressy dinner" },
    { id: "laundry", label: "Laundry on the trip" }
  ],

  groups: [
    {
      title: "Documents & money", emoji: "🛂",
      items: [
        { name: "Phone" },
        { name: "Wallet & cards" },
        { name: "ID / driver's licence" },
        { name: "House keys" },
        { name: "Bookings saved offline", note: "tickets, hotels, car hire" },
        { name: "Passport", when: "abroad", note: "valid 6+ months after you're back" },
        { name: "Visa, if needed", when: "abroad", note: "keep a printed copy" },
        { name: "Travel insurance details", when: "abroad" },
        { name: "Local cash", when: "abroad", note: "a little for taxis and small shops" },
        { name: "Card with no foreign fees", when: "abroad" }
      ]
    },
    {
      title: "Clothes", emoji: "👕",
      items: [
        { name: "Underwear", perDay: 1, extra: 1 },
        { name: "Pairs of socks", perDay: 1, extra: 1 },
        { name: "T-shirts", perDay: 1 },
        { name: "Shirts for going out", every: 3, max: 4 },
        { name: "Trousers or jeans", every: 3, max: 3, note: "wear the heaviest pair on travel day" },
        { name: "Shorts", every: 4, max: 3 },
        { name: "Pyjamas", every: 4, max: 2 },
        { name: "Light jacket or hoodie", note: "planes get cold" },
        { name: "Belt" },
        { name: "Walking shoes", note: "wear them on travel day" },
        { name: "Sandals or flip-flops" },
        { name: "Second pair of shoes", minDays: 5 },
        { name: "Warm coat", when: "cold" },
        { name: "Sweaters", every: 3, max: 3, when: "cold" },
        { name: "Thermal sets", every: 3, max: 3, when: "cold", note: "top and bottom" },
        { name: "Gloves", when: "cold" },
        { name: "Beanie & scarf", when: "cold" },
        { name: "Swim trunks", every: 4, max: 2, when: "swim" },
        { name: "Quick-dry towel", when: "swim" },
        { name: "Dress shirts", every: 5, max: 2, when: "dressy" },
        { name: "Smart trousers", when: "dressy" },
        { name: "Blazer", when: "dressy" },
        { name: "Dress shoes & dark socks", when: "dressy" }
      ]
    },
    {
      title: "Toiletries & health", emoji: "🪥",
      items: [
        { name: "Toothbrush & toothpaste" },
        { name: "Deodorant" },
        { name: "Razor & shaving cream", note: "travel size for carry-on" },
        { name: "Face wash" },
        { name: "Moisturiser" },
        { name: "Sunscreen" },
        { name: "Lip balm" },
        { name: "Comb or hair product" },
        { name: "Cologne", note: "travel size" },
        { name: "Nail clipper", minDays: 7, note: "checked bag, not carry-on" },
        { name: "Glasses or contacts", note: "if you wear them — plus solution" },
        { name: "Personal medicines", note: "enough for the whole trip, plus a few days" },
        { name: "Painkillers, antacids & plasters" }
      ]
    },
    {
      title: "Tech", emoji: "🔌",
      items: [
        { name: "Phone charger & cable" },
        { name: "Power bank", note: "carry-on only" },
        { name: "Earphones" },
        { name: "Watch charger", note: "if you wear a smartwatch" },
        { name: "Travel adapter", when: "abroad", note: "check the plug type where you're going" }
      ]
    },
    {
      title: "Travel day", emoji: "🎒",
      items: [
        { name: "Day bag or backpack" },
        { name: "Water bottle", note: "empty it before security" },
        { name: "Sunglasses" },
        { name: "Neck pillow", note: "for long flights" },
        { name: "Eye mask & earplugs" },
        { name: "Snacks for the journey" },
        { name: "Pen", when: "abroad", note: "for arrival forms" }
      ]
    },
    {
      title: "Laundry", emoji: "🧺",
      items: [
        { name: "Bag for dirty clothes", minDays: 3 },
        { name: "Detergent sheets", when: "laundry" }
      ]
    }
  ]
};
