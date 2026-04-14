export const mcqBlocks = {
  id: "mcq",
  name: "বহুনির্বাচনী (MCQ)",
  blocks: [
    {
      id: "mcq-4option",
      label: "৪-অপশন MCQ",
      description: "প্রশ্ন + ক/খ/গ/ঘ ৪টি অপশন",
      html: `<div data-block-wrapper="true"><ol class="bn-digits-list"><li><p>এখানে প্রশ্ন লিখুন?</p><ol class="bn-letters-list"><li>অপশন ১</li><li>অপশন ২</li><li>অপশন ৩</li><li>অপশন ৪</li></ol></li></ol></div>`,
    },
    {
      id: "mcq-options-only",
      label: "শুধু ৪টি অপশন (উল্লম্ব)",
      description: "ক/খ/গ/ঘ নিচে নিচে (প্রশ্ন ছাড়া)",
      html: `<div data-block-wrapper="true"><ol class="bn-letters-list"><li>অপশন ১</li><li>অপশন ২</li><li>অপশন ৩</li><li>অপশন ৪</li></ol></div>`,
    },
    {
      id: "mcq-options-2col",
      label: "৪টি অপশন — ২ কলাম (২×২)",
      description: "ক খ পাশাপাশি, নিচে গ ঘ পাশাপাশি",
      html: `<div data-block-wrapper="true"><ol class="bn-letters-list mcq-grid-2"><li>অপশন ১</li><li>অপশন ২</li><li>অপশন ৩</li><li>অপশন ৪</li></ol></div>`,
    },
    {
      id: "mcq-options-4col",
      label: "৪টি অপশন — ১ সারিতে",
      description: "ক খ গ ঘ চারটিই পাশাপাশি এক লাইনে",
      html: `<div data-block-wrapper="true"><ol class="bn-letters-list mcq-grid-4"><li>অপশন ১</li><li>অপশন ২</li><li>অপশন ৩</li><li>অপশন ৪</li></ol></div>`,
    },
    {
      id: "mcq-4option-2col",
      label: "MCQ + ২ কলাম অপশন",
      description: "প্রশ্ন + ক খ গ ঘ (২×২ গ্রিড)",
      html: `<div data-block-wrapper="true"><ol class="bn-digits-list"><li><p>এখানে প্রশ্ন লিখুন?</p><ol class="bn-letters-list mcq-grid-2"><li>অপশন ১</li><li>অপশন ২</li><li>অপশন ৩</li><li>অপশন ৪</li></ol></li></ol></div>`,
    },
    {
      id: "mcq-4option-4col",
      label: "MCQ + ১ সারিতে অপশন",
      description: "প্রশ্ন + ক খ গ ঘ (চারটিই পাশাপাশি)",
      html: `<div data-block-wrapper="true"><ol class="bn-digits-list"><li><p>এখানে প্রশ্ন লিখুন?</p><ol class="bn-letters-list mcq-grid-4"><li>অপশন ১</li><li>অপশন ২</li><li>অপশন ৩</li><li>অপশন ৪</li></ol></li></ol></div>`,
    },
    {
      id: "mcq-truefalse",
      label: "সত্য/মিথ্যা",
      description: "২-অপশন (সত্য / মিথ্যা)",
      html: `<div data-block-wrapper="true"><ol class="bn-digits-list"><li><p>এখানে বিবৃতি লিখুন।</p><ol class="bn-letters-list"><li>সত্য</li><li>মিথ্যা</li></ol></li></ol></div>`,
    },
  ],
};
