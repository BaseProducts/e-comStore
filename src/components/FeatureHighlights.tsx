const highlights = [
  { text: "Free shipping over $100" },
  { text: "Premium quality fabrics" },
  { text: "Secure checkout" },
  { text: "Easy returns" },
];

const FeatureHighlights = () => {
  return (
    <section className="py-5 md:py-6 px-6 border-b border-[#E8E5E0]">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:flex md:flex-row md:items-center justify-center place-items-center gap-y-4 gap-x-2 md:gap-12">
          {highlights.map((item) => (
            <span
              key={item.text}
              className="text-[11px] md:text-[12px] text-[#8A8A8A] tracking-wide text-center"
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
