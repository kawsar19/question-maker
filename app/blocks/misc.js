export const miscBlocks = {
  id: "misc",
  name: "অন্যান্য",
  blocks: [
    {
      id: "paper-header",
      label: "প্রশ্নপত্রের হেডার",
      description: "বিষয়, পরীক্ষার নাম, পূর্ণমান, সময়",
      html: `<h2 style="text-align:center;">বিষয়ের নাম</h2><h3 style="text-align:center;">পরীক্ষার ধরন</h3><p style="text-align:center;"><em>পূর্ণমান: ১০ | সময়: ৩০ মিনিট</em></p><hr />`,
    },
    {
      id: "section-divider",
      label: "সেকশন ডিভাইডার",
      description: "দুই বিভাগের মাঝে separator",
      html: `<hr /><p style="text-align:center;"><strong>— বিভাগ —</strong></p><hr />`,
    },
    {
      id: "instructions",
      label: "নির্দেশনা",
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
