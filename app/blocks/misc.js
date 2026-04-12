const headerTemplate = (examName, year) => `
  <h3 style="text-align:center;margin-top:0;margin-bottom:0.15em;">[প্রতিষ্ঠানের নাম]</h3>
  <h2 style="text-align:center;margin-top:0.15em;margin-bottom:0.35em;">${examName} – ${year}</h2>
  <p style="text-align:center;margin:0.2em 0;"><strong>শ্রেণি:</strong> [শ্রেণি] &nbsp;|&nbsp; <strong>বিষয়:</strong> [বিষয়]</p>
  <p style="display:flex;justify-content:space-between;margin:0.4em 0 0.2em;">
    <span><strong>সময়:</strong> [সময়]</span>
    <span><strong>পূর্ণমান:</strong> [পূর্ণমান]</span>
  </p>
  <hr />
`;

export const miscBlocks = {
  id: "misc",
  name: "অন্যান্য",
  blocks: [
    {
      id: "header-monthly",
      label: "হেডার — মাসিক মূল্যায়ন পরীক্ষা",
      description: "প্রতিষ্ঠান, শ্রেণি, বিষয়, সময়, পূর্ণমান সহ",
      html: headerTemplate("মাসিক মূল্যায়ন পরীক্ষা", "২০২৬"),
    },
    {
      id: "header-half-yearly",
      label: "হেডার — অর্ধবার্ষিক পরীক্ষা",
      description: "অর্ধবার্ষিক question paper-এর হেডার",
      html: headerTemplate("অর্ধবার্ষিক পরীক্ষা", "২০২৬"),
    },
    {
      id: "header-yearly",
      label: "হেডার — বার্ষিক পরীক্ষা",
      description: "বার্ষিক question paper-এর হেডার",
      html: headerTemplate("বার্ষিক পরীক্ষা", "২০২৬"),
    },
    {
      id: "header-selection",
      label: "হেডার — নির্বাচনী পরীক্ষা",
      description: "SSC/HSC নির্বাচনী পরীক্ষার হেডার",
      html: headerTemplate("নির্বাচনী পরীক্ষা", "২০২৬"),
    },
    {
      id: "header-weekly",
      label: "হেডার — সাপ্তাহিক পরীক্ষা",
      description: "ছোট সাপ্তাহিক পরীক্ষার হেডার",
      html: headerTemplate("সাপ্তাহিক পরীক্ষা", "২০২৬"),
    },
    {
      id: "header-custom",
      label: "হেডার — কাস্টম (খালি)",
      description: "নিজে সব কিছু পূরণ করুন",
      html: headerTemplate("[পরীক্ষার নাম]", "[সাল]"),
    },
    {
      id: "section-divider",
      label: "সেকশন ডিভাইডার",
      description: "দুই বিভাগের মাঝে separator",
      html: `<hr /><p style="text-align:center;"><strong>— বিভাগ —</strong></p><hr />`,
    },
    {
      id: "instructions",
      label: "পরীক্ষার নির্দেশনা",
      description: "পরীক্ষার্থীদের জন্য নির্দেশনা",
      html: `<p><strong>নির্দেশনা:</strong></p><ul><li>সব প্রশ্নের উত্তর দিতে হবে।</li><li>ডান পাশে প্রশ্নের মান দেওয়া আছে।</li><li>উত্তর সংক্ষিপ্ত ও যথার্থ হতে হবে।</li></ul>`,
    },
    {
      id: "answer-note",
      label: "উত্তর নোট",
      description: "উত্তরের জন্য ছোট note",
      html: `<p><em>বিঃদ্রঃ প্রতিটি প্রশ্নের পূর্ণমান ডানপাশে উল্লিখিত।</em></p>`,
    },
  ],
};
