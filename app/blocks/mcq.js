export const mcqBlocks = {
  id: "mcq",
  name: "বহুনির্বাচনী (MCQ)",
  blocks: [
    {
      id: "mcq-4option",
      label: "৪-অপশন MCQ",
      description: "প্রশ্ন + ক/খ/গ/ঘ ৪টি অপশন",
      html: `<ol class="bn-digits-list"><li><p>এখানে প্রশ্ন লিখুন?</p><ol class="bn-letters-list"><li>অপশন ১</li><li>অপশন ২</li><li>অপশন ৩</li><li>অপশন ৪</li></ol></li></ol>`,
    },
    {
      id: "mcq-options-only",
      label: "শুধু ৪টি অপশন",
      description: "ক/খ/গ/ঘ নম্বরযুক্ত অপশন (প্রশ্ন ছাড়া)",
      html: `<ol class="bn-letters-list"><li>অপশন ১</li><li>অপশন ২</li><li>অপশন ৩</li><li>অপশন ৪</li></ol>`,
    },
    {
      id: "mcq-truefalse",
      label: "সত্য/মিথ্যা",
      description: "২-অপশন (সত্য / মিথ্যা)",
      html: `<ol class="bn-digits-list"><li><p>এখানে বিবৃতি লিখুন।</p><ol class="bn-letters-list"><li>সত্য</li><li>মিথ্যা</li></ol></li></ol>`,
    },
  ],
};
