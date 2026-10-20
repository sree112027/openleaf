//   OpenLeaf - website text
//   -----------------------
//   Change the words between the quotes, then press "Commit changes".
//   Keep the quotes, commas and brackets as they are.
//   The live site updates about a minute after you commit.
//
//   Pictures: each project and gallery item draws a sample screen.
//     screen: landing, booking, shop, dashboard, blog, menu or timetable
//     hue:    a colour from 0 to 360 (0 red, 30 orange, 150 green, 210 blue)
//     image:  to use a real photo instead, upload it to the images folder
//             and write its path here, for example "images/bakery.jpg"
window.SITE = {
  name: "OpenLeaf",

  hero: {
    title: "Websites and apps, made to grow.",
    text: "OpenLeaf is a small studio that designs and builds websites, booking systems and web apps for local businesses and growing teams.",
    primaryButton: "Start a project",
    secondaryButton: "See example work"
  },

  about: {
    title: "A small studio with an open door",
    paragraphs: [
      "You work directly with the people building your site. No layers, no jargon and no surprise invoices.",
      "Everything we make loads fast, works on any phone and is simple for you to update yourself."
    ],
    stepsTitle: "How a project runs",
    steps: [
      { title: "Talk it through", text: "We learn what you offer, who visits and what they need to do." },
      { title: "Design and build", text: "You see working previews early and shape them as we go." },
      { title: "Launch and look after", text: "We put it live, keep it updated and fix things fast." }
    ]
  },

  services: {
    title: "What we build",
    intro: "From a one-page site to a full booking system.",
    items: [
      { icon: "site", title: "Business websites", text: "Fast, mobile-friendly sites for shops, clinics, schools and local services." },
      { icon: "calendar", title: "Booking and ordering", text: "Let customers book appointments, classes or orders online, day or night." },
      { icon: "chart", title: "Web apps and dashboards", text: "Tools for your team: trackers, reports and simple admin screens." },
      { icon: "cart", title: "Online shops", text: "Product pages, secure payments and stock that stays in sync." },
      { icon: "refresh", title: "Redesigns", text: "A clean, modern refresh for an older site that keeps what already works." },
      { icon: "shield", title: "Hosting and care", text: "Domains, hosting, updates and fixes, handled for you." }
    ]
  },

  projects: {
    title: "Example projects",
    intro: "Sample builds that show the kind of work we do.",
    items: [
      { name: "Corner Bakery", text: "Daily menu, click-and-collect orders and opening times.", tags: ["Website", "Ordering"], screen: "shop", hue: 28, image: "", link: "" },
      { name: "FitClass", text: "Members book and cancel classes from their phones.", tags: ["Web app", "Bookings"], screen: "booking", hue: 205, image: "", link: "" },
      { name: "Northside Plumbing", text: "A clear local site that turns searches into phone calls.", tags: ["Website", "Local search"], screen: "landing", hue: 190, image: "", link: "" },
      { name: "StockTrack", text: "An inventory dashboard that flags low stock before it runs out.", tags: ["Dashboard"], screen: "dashboard", hue: 150, image: "", link: "" }
    ]
  },

  gallery: {
    title: "Gallery",
    intro: "Screens from the kinds of sites and apps we make.",
    items: [
      { caption: "Bakery menu on a phone", screen: "menu", hue: 28, image: "" },
      { caption: "Stock dashboard", screen: "dashboard", hue: 150, image: "" },
      { caption: "Gym class timetable", screen: "timetable", hue: 205, image: "" },
      { caption: "Blog article layout", screen: "blog", hue: 340, image: "" },
      { caption: "Appointment calendar", screen: "booking", hue: 265, image: "" },
      { caption: "Shop product grid", screen: "shop", hue: 45, image: "" }
    ]
  },

  blog: {
    title: "Community blog",
    intro: "Anyone can write here. Every writer gets their own blog page, and each post links back to the person who wrote it.",
    repo: "sree112027/openleaf",
    label: "blog",
    template: "blog-post.yml"
  },

  contact: {
    title: "Start a project",
    text: "Tell us what you have in mind and how to reach you. We read every message.",
    email: "hello@example.com",
    links: [
      { label: "GitHub", url: "https://github.com/sree112027" }
    ]
  }
};
