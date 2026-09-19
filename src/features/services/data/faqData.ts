// FAQ data for the services feature.
// Each entry is keyed by the SAME id used in servicesService.ts (Service.id),
// so a service page can look up its own FAQ list with FAQ_DATA[service.id].
// Content is written for a Kathmandu, Nepal based derma clinic audience,
// covering pricing context, session counts, downtime and climate specific
// notes (altitude sun, monsoon humidity, festival season) that are relevant
// to patients in Nepal specifically, not generic global copy.

export interface FaqItem {
  question: string;
  answer: string;
}

export type FaqDataMap = Record<string, FaqItem[]>;

export const FAQ_DATA: FaqDataMap = {
  hydrafacial: [
    {
      question: "What does a HydraFacial session actually involve",
      answer:
        "The treatment uses a vortex device to cleanse, gently exfoliate, extract debris from pores and infuse hydrating serums, all in one sitting. Most sessions take between 45 and 90 minutes and there is no downtime, so you can return to work or a family event right after.",
    },
    {
      question: "How much does a HydraFacial cost in Kathmandu",
      answer:
        "Sessions in Nepal typically start from around NPR 2500 and can go higher depending on the areas treated and any add on boosters. Your dermatologist will confirm the exact price after assessing your skin during consultation.",
    },
    {
      question:
        "How often should I get a HydraFacial given Kathmandu's climate",
      answer:
        "Given Kathmandu's dust, traffic pollution and seasonal humidity swings, most patients benefit from a session every four to six weeks for ongoing maintenance. If you are preparing for a wedding or festival such as Dashain or Tihar, book three to five days before the event for an instant glow.",
    },
    {
      question:
        "Is HydraFacial safe for oily and acne prone skin common in Nepal",
      answer:
        "Yes, the treatment suits all skin types, including the oilier, acne prone skin common in the Kathmandu valley, and the infused serums can be customized to calm congestion and breakouts rather than add extra oil.",
    },
  ],

  "laser-hair-removal": [
    {
      question:
        "How many sessions are needed for lasting results on Nepali skin",
      answer:
        "Most patients need six to eight sessions spaced four to six weeks apart to see a lasting reduction of around eighty to ninety percent, since the laser only works on hair that is actively growing at the time of treatment.",
    },
    {
      question: "Is laser hair removal safe for the skin tones common in Nepal",
      answer:
        "Yes, clinics in Kathmandu use combination diode and Nd:YAG systems suited to the medium to deeper skin tones common across Nepal and South Asia, which lowers the risk of burns or pigment changes.",
    },
    {
      question: "Does trekking or high altitude sun exposure affect treatment",
      answer:
        "If you have been trekking or spending long hours in Nepal's strong high altitude sun, your skin may be temporarily tanned, so your provider will reassess your skin tone at every visit to keep the laser settings safe.",
    },
    {
      question: "What does laser hair removal cost per area in Kathmandu",
      answer:
        "Prices vary by area, with smaller zones such as the upper lip starting from around NPR 3000 and larger areas such as full legs going up to around NPR 12000 per session, so package deals usually work out cheaper for a full course.",
    },
  ],

  botox: [
    {
      question: "How much does Botox cost in Nepal",
      answer:
        "Botox is usually priced per unit, commonly between NPR 500 and NPR 1500 per unit depending on the clinic and the area treated, while dermal fillers are priced per milliliter of product used.",
    },
    {
      question: "How long do Botox and filler results last",
      answer:
        "Botox results typically last three to four months before muscle activity gradually returns, while fillers can last anywhere from six months to over a year depending on the product used and the area treated.",
    },
    {
      question: "Is Botox safe and will my expression look frozen",
      answer:
        "When performed by a qualified dermatologist at the correct dose, Botox softens lines while preserving natural movement. An overly frozen look usually comes from overuse rather than the treatment itself.",
    },
    {
      question: "What should I avoid before and after treatment",
      answer:
        "Tell your provider if you take blood thinning medication such as aspirin, since this can increase bruising. After treatment, avoid lying down, massaging the treated area or intense exercise for the rest of the day.",
    },
  ],

  "acne-treatment": [
    {
      question: "What acne treatments are available for patients in Nepal",
      answer:
        "Clinics in Kathmandu combine prescription topicals, oral medication when needed, chemical peels, subcision for deep scars and fractional laser resurfacing, with the exact combination chosen after your dermatologist assesses your skin type and scar depth.",
    },
    {
      question: "Why does acne often flare up during Nepal's monsoon season",
      answer:
        "Rising humidity during the monsoon increases oil production and sweating, which can clog pores and trigger new breakouts, so your treatment plan may be adjusted seasonally to manage this.",
    },
    {
      question: "How long before I see improvement in active acne",
      answer:
        "Most patients notice fewer new breakouts within four to six weeks of starting treatment, while textural scarring takes longer, often three to six months of sessions such as laser or peels to see meaningful smoothing.",
    },
    {
      question: "Can acne scars be completely removed",
      answer:
        "Scarring can be significantly improved with treatments such as fractional CO2 laser, subcision and peels, though complete removal is not always possible. Your dermatologist will set realistic expectations based on your scar type.",
    },
  ],

  melasma: [
    {
      question: "Why is melasma so common among patients in Nepal",
      answer:
        "Nepal's strong ultraviolet exposure, especially at higher altitudes, combined with a genetic tendency toward more active pigment cells, makes melasma and other pigmentation concerns especially common among Nepali women and men.",
    },
    {
      question: "What treatments work best for melasma in Nepal",
      answer:
        "A combination of Q switched Nd:YAG or pico laser sessions with prescription depigmenting creams and strict daily sunscreen use tends to give the most consistent results, since melasma usually needs ongoing management rather than a single fix.",
    },
    {
      question: "How many sessions are typically needed",
      answer:
        "Most patients need a course of four to six laser sessions spaced several weeks apart, alongside daily use of prescribed creams at home, with maintenance visits afterward to keep pigmentation from returning.",
    },
    {
      question: "Can melasma come back after treatment",
      answer:
        "Yes, melasma tends to recur, especially with sun exposure during Nepal's long dry season and festival season travel, so daily sunscreen and periodic touch up sessions are important for holding on to results.",
    },
  ],

  "co2-laser": [
    {
      question: "What conditions does CO2 laser treat",
      answer:
        "Fractional CO2 laser resurfaces acne scars and post traumatic scars, and safely removes moles, warts and milia, revealing smoother skin underneath as the treated area heals.",
    },
    {
      question: "How much downtime should I expect",
      answer:
        "Expect redness and mild swelling for about five to seven days, with some peeling as new skin forms. Most patients in Kathmandu plan the procedure around a week when they can stay out of direct sun and dusty outdoor conditions.",
    },
    {
      question: "Is CO2 laser safe for Nepali skin tones",
      answer:
        "Yes, when performed by an experienced dermatologist at the correct settings, though deeper skin tones carry a slightly higher chance of temporary pigment change, which is why a patch test and careful aftercare are recommended.",
    },
    {
      question: "How many sessions are required for acne scars",
      answer:
        "Significant scarring often needs two to four sessions spaced six to eight weeks apart, since the skin needs time to rebuild collagen between treatments.",
    },
  ],

  "pico-laser": [
    {
      question: "What does pico laser treat",
      answer:
        "Pico laser uses ultra fast picosecond pulses to break down stubborn pigment, sun damage and early signs of aging without generating much heat in the surrounding skin.",
    },
    {
      question: "How is pico laser different from older pigment lasers",
      answer:
        "Because the pulses are so short, pico laser shatters pigment into finer particles with less surrounding heat, which typically means quicker recovery and fewer side effects compared to older Q switched lasers.",
    },
    {
      question: "How many sessions will I need for sun damage",
      answer:
        "Most patients see visible improvement after three to six sessions spaced three to four weeks apart, which suits Nepal's intense dry season sun exposure that often worsens pigmentation.",
    },
    {
      question: "Is there any downtime after pico laser",
      answer:
        "Downtime is minimal, with some redness for a few hours and possible light scabbing on treated pigment spots for about a week, so most patients resume normal activities the same day.",
    },
  ],

  microneedling: [
    {
      question: "What skin concerns does microneedling address",
      answer:
        "Microneedling uses fine needles to trigger the skin's own collagen production, which helps soften wrinkles, shrink enlarged pores, improve acne scars and fade age spots over a series of sessions.",
    },
    {
      question: "How many sessions are needed to see results",
      answer:
        "Most patients need four to six sessions spaced three to four weeks apart, with visible improvement in texture building gradually as new collagen forms over the following months.",
    },
    {
      question: "Can microneedling be combined with PRP",
      answer:
        "Yes, many clinics in Kathmandu combine microneedling with your own platelet rich plasma to boost healing and collagen production, which is especially popular for acne scarring and early signs of aging.",
    },
    {
      question: "What is the recovery like",
      answer:
        "Expect redness similar to a mild sunburn for one to two days, with light peeling in some cases. Sun protection is important afterward given Nepal's strong daytime ultraviolet levels.",
    },
  ],

  "chemical-peeling": [
    {
      question: "What skin issues can a chemical peel improve",
      answer:
        "Chemical peels exfoliate the outer layers of skin to improve fine lines, wrinkles, active acne, acne scars and uneven skin tone, revealing fresher skin underneath.",
    },
    {
      question: "How many peel sessions are recommended",
      answer:
        "A typical course is four to six sessions spaced two to three weeks apart for concerns such as acne and dullness, though your dermatologist may set a different schedule based on how your skin responds.",
    },
    {
      question: "Is peeling suitable during Nepal's dry winter months",
      answer:
        "Peels can be done throughout the year, but during winter's dry air your dermatologist may choose a gentler peel strength and pair it with extra moisturizing to prevent excess flaking.",
    },
    {
      question: "What aftercare is required following a peel",
      answer:
        "Strict sunscreen use is essential for at least two weeks after a peel, since freshly exfoliated skin is more sensitive to Nepal's intense daytime ultraviolet exposure, and harsh scrubs or active ingredients should be paused during this time.",
    },
  ],

  "skin-analysis": [
    {
      question: "What happens during a skin analysis session",
      answer:
        "A digital device examines your skin's hydration, oil levels, pore condition, pigmentation and sun damage beneath the surface, giving your dermatologist an objective picture beyond what is visible to the eye.",
    },
    {
      question: "How long does a skin analysis take",
      answer:
        "The assessment itself usually takes fifteen to thirty minutes, followed by a short consultation where your dermatologist explains the findings and recommends a suitable skincare or treatment plan.",
    },
    {
      question: "Do I need to prepare my skin before the analysis",
      answer:
        "It helps to arrive without makeup or heavy skincare products so the device can read your skin's true condition, and to avoid direct sun exposure for a day or two beforehand if possible.",
    },
    {
      question: "How often should I repeat a skin analysis",
      answer:
        "Many patients in Nepal repeat the analysis every three to six months, or whenever starting a new treatment, to track how their skin is responding and adjust the plan accordingly.",
    },
  ],

  "allergy-test": [
    {
      question: "What types of allergies can be tested",
      answer:
        "Patch and skin prick testing can identify sensitivities to common triggers such as pollens, molds, dust and certain skincare ingredients, helping explain persistent rashes or reactions.",
    },
    {
      question: "Why are allergy tests useful in Nepal's climate",
      answer:
        "Kathmandu's seasonal pollen count, dust levels and monsoon humidity can all trigger skin reactions, so identifying your specific triggers helps your dermatologist recommend practical avoidance steps and suitable products.",
    },
    {
      question: "How long does the test take and when do I get results",
      answer:
        "Skin prick testing shows visible reactions within fifteen to twenty minutes, while patch testing for delayed reactions is read after forty eight hours and again after seventy two hours, so it usually involves two short follow up visits.",
    },
    {
      question: "Is the allergy test uncomfortable",
      answer:
        "The test involves only mild scratches or small patches on the skin and is generally well tolerated, with any itching or redness at the test sites settling down within a day or two.",
    },
  ],

  "skin-hair-nail": [
    {
      question:
        "What causes the skin, hair and nail problems this treatment addresses",
      answer:
        "Dull skin, thinning hair and brittle nails are often linked to nutritional deficiencies, hormonal changes or an underlying medical condition, which is why treatment starts with identifying the root cause rather than only the surface symptoms.",
    },
    {
      question: "Are dietary deficiencies common among patients in Nepal",
      answer:
        "Yes, deficiencies in iron, vitamin D and biotin are frequently seen among patients in Nepal and can contribute to hair thinning, dull skin and weak nails, so blood tests are often part of the initial assessment.",
    },
    {
      question: "How long before I notice improvement",
      answer:
        "Hair and nails grow slowly, so most patients need eight to twelve weeks of consistent treatment before seeing a noticeable difference, while skin glow tends to improve somewhat sooner.",
    },
    {
      question: "Can this be combined with treatments like PRP or HydraFacial",
      answer:
        "Yes, many patients pair nutritional correction with treatments such as PRP for hair or HydraFacial for skin to speed up visible results while the underlying deficiency is being corrected.",
    },
  ],

  "doctor-consultation": [
    {
      question: "What should I bring to a consultation",
      answer:
        "Bring any previous test reports, prescriptions and a list of products or medications you currently use. The dermatologist will review your concerns, examine your skin or scalp and explain the likely causes before recommending tests or treatment.",
    },
    {
      question: "Do I need a consultation before a treatment",
      answer:
        "Yes, every procedure - from laser and peels to Botox and PRP - starts with a consultation so the dermatologist can confirm the right fit for your skin type and goals, and screen for any reason to avoid the treatment.",
    },
    {
      question: "How long is a typical consultation in Kathmandu",
      answer:
        "A standard consultation takes around fifteen to thirty minutes, and complex conditions such as melasma, vitiligo or hair loss may need a longer first visit so the doctor can examine everything thoroughly.",
    },
  ],

  "scar-revision": [
    {
      question: "Which scars can be treated with scar revision",
      answer:
        "Acne scars, surgical scars, burn scars and old injury scars all respond well. The choice of tool - laser, microneedling, subcision or injections - depends on whether the scar is shallow, deep, raised, or darkened.",
    },
    {
      question: "How many sessions does scar revision need",
      answer:
        "Most patients need three to six sessions spaced four to eight weeks apart. Results build gradually as collagen remodels, so patience and consistent follow-up are part of the plan.",
    },
    {
      question: "Can raised keloid scars be flattened",
      answer:
        "Yes, intralesional injections and fractional laser help flatten and soften raised or keloid scars over several sessions, with a treatment plan tailored to how long the scar has been present.",
    },
  ],

  "thread-lifting": [
    {
      question: "How long do thread lift results last",
      answer:
        "The immediate lift is visible right away and typically lasts twelve to eighteen months, while the collagen stimulated around the threads continues to firm the skin for several months longer.",
    },
    {
      question: "Is a thread lift painful or risky",
      answer:
        "Local anaesthetic keeps the procedure comfortable, and downtime is short with mild swelling or bruising for a few days. Choosing an experienced dermatologist minimises any risk of visible threads or dimpling.",
    },
    {
      question: "Who is a good candidate for a thread lift",
      answer:
        "Patients in their early thirties to fifties with mild to moderate sagging of the cheeks, jawline or brows see the most natural results. Advanced sagging may still be better served by surgical options discussed in consultation.",
    },
  ],

  "mesoinjections": [
    {
      question: "What is injected during mesotherapy",
      answer:
        "A cocktail of hyaluronic acid, vitamins, minerals and amino acids is micro-injected into the skin to hydrate and nourish it, and on the scalp it helps strengthen hair roots and reduce thinning.",
    },
    {
      question: "How many mesoinjection sessions are needed",
      answer:
        "A typical course is four to six sessions spaced two weeks apart with maintenance every few months, depending on your skin's hydration levels and the concern being treated.",
    },
    {
      question: "When will I notice results",
      answer:
        "Many patients notice extra glow and hydration after the first session, while texture and firmness improvements build over the full course of four to six treatments.",
    },
  ],

  "mole-skin-tag-wart-removal": [
    {
      question: "Is it safe to remove moles and skin tags",
      answer:
        "Yes, when each lesion is first examined by a dermatologist to confirm it is benign. Suspicious or changing lesions are checked carefully before any removal, and samples can be sent for testing if needed.",
    },
    {
      question: "Does removal leave a scar",
      answer:
        "Laser and radiofrequency removal of small lesions heals with minimal to no visible scarring. Surgical removal of larger moles may leave a small linear scar, which our dermatologist will explain beforehand.",
    },
    {
      question: "Do warts come back after treatment",
      answer:
        "Viral warts can recur because HPV may remain in nearby skin, so we often combine removal with a short topical course and check on the area at a follow-up visit to reduce the chance of regrowth.",
    },
  ],

  "vitiligo-treatment": [
    {
      question: "Can vitiligo really be repigmented",
      answer:
        "Yes, modern therapies can restore pigment in many cases, especially when started early. Phototherapy, excimer laser and topical protocols help melanocytes return colour to white patches over months of consistent treatment.",
    },
    {
      question: "How long does vitiligo treatment take",
      answer:
        "Repigmentation is gradual - most patients see the first specks of colour after two to three months, with meaningful coverage building over six to twelve months of regular sessions.",
    },
    {
      question: "Is phototherapy safe for skin in Nepal's climate",
      answer:
        "Yes, narrow-band UVB phototherapy is carefully dosed and the doctor will adjust exposure especially given Nepal's strong high-altitude sun, to maximise repigmentation while protecting surrounding skin.",
    },
  ],

  "tattoo-removal": [
    {
      question: "How many sessions does tattoo removal take",
      answer:
        "Most tattoos need six to twelve laser sessions spaced six to eight weeks apart. Professional multi-colour tattoos and very dense ink typically take longer than amateur or black-only work.",
    },
    {
      question: "Are tattoos fully removed or just faded",
      answer:
        "Most tattoos fade significantly and many can be removed almost completely, though a faint shadow can remain on some inks. A realistic plan and expected outcome is confirmed during your consultation.",
    },
    {
      question: "Is laser tattoo removal safe on darker skin",
      answer:
        "Using long-pulse Q-Switched and picosecond lasers with conservative settings makes the treatment safe for the medium-to-deep skin tones common in Nepal, minimising the risk of hypopigmentation.",
    },
  ],

  "intralesional-injections": [
    {
      question: "What conditions are treated with intralesional injections",
      answer:
        "Keloids, hypertrophic scars, cysts, persistent warts and localised inflammatory conditions are treated by injecting medication directly into the lesion, giving a concentrated effect right where it is needed.",
    },
    {
      question: "How many injection sessions are required",
      answer:
        "Raised scars and keloids usually need four to eight sessions spaced three to four weeks apart, while warts may clear in fewer visits depending on how thick and long standing they are.",
    },
    {
      question: "Are intralesional injections painful",
      answer:
        "A fine needle is used and most patients feel only brief stinging. Numbing cream can be applied beforehand if a sensitive area is being treated.",
    },
  ],

  "skin-anti-aging": [
    {
      question: "At what age should I start anti-aging skincare",
      answer:
        "Prevention can start in the mid-to-late twenties with sunscreen, moisturiser and gentle retinoids, while combined in-clinic programmes such as peels, microneedling and mesotherapy suit the thirties and beyond.",
    },
    {
      question: "Which anti-aging treatment is right for me",
      answer:
        "That depends on whether fine lines, sagging, dullness or pigmentation bother you most. During a consultation the dermatologist will combine the right clinic procedures with a home skincare plan for the best result.",
    },
    {
      question: "Will I look frozen or unnatural",
      answer:
        "No. Treatments like Botox and fillers are dosed conservatively to soften lines while preserving natural expressions, and the rest of the anti-aging programme restores a refreshed rather than artificial appearance.",
    },
  ],

  "sti-treatment": [
    {
      question: "Is STI consultation confidential",
      answer:
        "Completely. Your consultation, tests and records are kept private, and you can speak openly with our dermatologist who sees these conditions regularly and treats them without judgement.",
    },
    {
      question: "Which STI symptoms should I get checked for",
      answer:
        "Warts or bumps on the genitals, unusual discharge, sores, burning while urinating and itching all warrant a check-up. Early diagnosis makes treatment simpler and reduces risk to partners.",
    },
    {
      question: "Can STIs be cured completely",
      answer:
        "Many bacterial STIs are fully cured with a short course of medication, and viral STIs such as herpes and warts can be effectively controlled and kept from spreading with ongoing care.",
    },
  ],

  prp: [
    {
      question: "How does PRP help with hair loss",
      answer:
        "PRP concentrates growth factors from your own blood, which are then injected into the scalp to stimulate dormant follicles and slow further shedding, making it a natural option with minimal risk of allergic reaction.",
    },
    {
      question: "How many PRP sessions are recommended",
      answer:
        "Most patients undergo an initial course of four to six sessions spaced three to four weeks apart, followed by maintenance sessions every four to six months to sustain results.",
    },
    {
      question: "What is the difference between PRP and GFC",
      answer:
        "Both use growth factors drawn from your own blood, but GFC concentrates them more highly in a purer solution, so some clinics in Kathmandu recommend GFC for advanced hair thinning while PRP suits general regenerative care for the scalp and face.",
    },
    {
      question: "Is there any downtime after a PRP session",
      answer:
        "Downtime is minimal, with mild scalp tenderness or slight swelling for a day or two, so most patients return to work and their daily routine right after the appointment.",
    },
  ],
};

export function getFaqsForService(serviceId: string): FaqItem[] {
  return FAQ_DATA[serviceId] ?? [];
}
