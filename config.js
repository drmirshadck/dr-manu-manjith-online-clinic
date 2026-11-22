/* =====================================================================
   CLINIC SETTINGS (DotCom Pro) — Dr Manu Manjith
   Design: custom page (index.html, Bridgement style). Booking comes from
   booking.js (built from the template with tools/make-booking-embed.py),
   which reads this file. PREVIEW values are marked  // PREVIEW
   ===================================================================== */
window.SITE = {

  doctor: {
    name: "Dr. Manu Manjith",
    shortName: "Dr. Manu",
    photo: "doctor.jpg",
    eyebrow: "Homoeopathic Psychiatry · Counselling",
    role: "BHMS, MD (Psychiatry) · Physician · Psychiatrist",
    lead: "Private counselling and homoeopathic care by video, with the doctor Malayalam cinema knows as the Doctor Lyricist."
  },

  brand: { title: "Dr Manu Manjith", subtitle: "Counselling & Homoeopathy" },

  theme: {
    brand: "#6b3fd6",       // violet (buttons inside booking)
    brandDeep: "#00006e",   // navy (Bridgement)
    accent: "#d20c54",      // pink call-to-action
    light: "#00c3f0"        // cyan highlight
  },

  clinic: {
    name: "Dr Manu Manjith Online Clinic",
    whatsapp: "919447755193",
    googleReviewUrl: "",            // PREVIEW: clinic's Google review link
    upiId: "preview@upi",           // PREVIEW: Dr Manu's UPI ID
    payeeName: "Dr Manu Manjith"
  },
  // the booking window reads these two (same values as clinic / doctors below)
  payment: { upiId: "preview@upi", payeeName: "Dr Manu Manjith" },  // PREVIEW

  doctors: [
    {
      id: "anu",                                   // PREVIEW: test helper id; becomes "manu" on the official helper
      name: "Dr. Manu Manjith",
      photo: "doctor.jpg",
      title: "BHMS, MD (Psychiatry) · Physician · Psychiatrist",
      bio: "Counselling-led homoeopathic care. Unhurried, private and judgement-free.",
      languages: "Malayalam, English",
      roomUrl: "",
      upiId: "", payeeName: "",
      consultations: [
        { calSlug: "online-video-consultation", kind: "new", name: "Counselling session", duration: "45 minutes", fee: 1000, featured: true,   // PREVIEW fee
          text: "A private, unhurried first session to talk things through, with homoeopathic support if you need it." },
        { calSlug: "review-consultation", kind: "review", name: "Follow-up session", duration: "30 minutes", fee: 700,                      // PREVIEW fee
          text: "For people already seeing Dr Manu. We review how you are doing and plan the next steps." }
      ]
    }
  ],
  consultations: {
    intro: "Choose your session, pay securely by UPI, then pick your time.",
    types: []   // filled below from doctors[0] (the booking window reads it)
  },

  helper: {
    url: "https://dotcom-by-arshees-calendar-test-pro.drmirshadck.workers.dev"   // PREVIEW: DotCom test helper; official site gets dr-manu-manjith-helper
  },

  contact: {
    phoneDisplay: "+91 94477 55193",
    whatsapp: "919447755193",
    hours: "WhatsApp or call to ask about sessions.",
    clinicName: "Dr Manu Manjith Online Clinic",
    address: ["Online consultations", "Kozhikode, Kerala"]
  },

  meta: {
    title: "Dr Manu Manjith | Online Counselling & Homoeopathy",
    description: "Book a private online counselling session with Dr Manu Manjith, homoeopathic physician (psychiatry & counselling).",
    year: "2026"
  }
};
window.SITE.consultations.types = window.SITE.doctors[0].consultations;
