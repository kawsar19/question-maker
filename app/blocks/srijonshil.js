export const srijonshilBlocks = {
  id: "srijonshil",
  name: "সৃজনশীল",
  blocks: [
    {
      id: "srijonshil-full",
      label: "সৃজনশীল (উদ্দীপক + ক/খ/গ/ঘ)",
      description: "উদ্দীপক সহ সম্পূর্ণ সৃজনশীল প্রশ্ন",
      html: `<ol class="bn-digits-list"><li><p>নিচের উদ্দীপকটি পড়ে প্রশ্নগুলোর উত্তর দাও:</p><blockquote><p>এখানে উদ্দীপক লিখুন...</p></blockquote><ol class="bn-letters-list"><li>জ্ঞানমূলক প্রশ্ন <em>(১)</em></li><li>অনুধাবনমূলক প্রশ্ন <em>(২)</em></li><li>প্রয়োগ প্রশ্ন <em>(৩)</em></li><li>উচ্চতর দক্ষতার প্রশ্ন <em>(৪)</em></li></ol></li></ol>`,
    },
    {
      id: "srijonshil-parts",
      label: "শুধু ক/খ/গ/ঘ পার্ট",
      description: "উদ্দীপক ছাড়া ৪টি সাব-পার্ট",
      html: `<ol class="bn-letters-list"><li>জ্ঞানমূলক প্রশ্ন <em>(১)</em></li><li>অনুধাবনমূলক প্রশ্ন <em>(২)</em></li><li>প্রয়োগ প্রশ্ন <em>(৩)</em></li><li>উচ্চতর দক্ষতার প্রশ্ন <em>(৪)</em></li></ol>`,
    },
    {
      id: "uddipok-only",
      label: "শুধু উদ্দীপক",
      description: "একটি blockquote + label",
      html: `<p><strong>উদ্দীপক:</strong></p><blockquote><p>এখানে উদ্দীপক লিখুন...</p></blockquote>`,
    },
  ],
};
