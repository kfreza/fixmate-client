// Crossed wrench and screwdriver over a blueprint circle
const Cs_ToolsIllustration = () => {
  return (
    <svg viewBox="0 0 240 240" fill="none" aria-hidden className="cs_tools_illustration">
      <circle cx="120" cy="120" r="104" className="fill-(--cs_soft_color)" />
      <circle cx="120" cy="120" r="104" strokeDasharray="4 8" strokeWidth="2" className="stroke-(--cs_primary_color)/40" />
      <path d="M40 120h160M120 40v160" strokeWidth="1.5" strokeDasharray="2 6" className="stroke-(--cs_primary_color)/25" />

      {/* Screwdriver */}
      <g transform="rotate(45 120 120)">
        <rect x="111" y="44" width="18" height="58" rx="7" className="fill-(--cs_accent_color)" />
        <rect x="111" y="60" width="18" height="5" className="fill-black/15" />
        <rect x="111" y="74" width="18" height="5" className="fill-black/15" />
        <rect x="116.5" y="102" width="7" height="72" rx="2" className="fill-slate-400" />
        <path d="M116.5 174h7l-2 14h-3z" className="fill-slate-500" />
      </g>

      {/* Wrench */}
      <g transform="rotate(-45 120 120)">
        <path
          d="M108 82h24v96a12 12 0 0 1-24 0z"
          className="fill-(--cs_primary_color)"
        />
        <path
          d="M98 58a26 26 0 0 0 10 34h24a26 26 0 0 0 10-34l-12 10h-20z"
          className="fill-(--cs_primary_color)"
        />
        <circle cx="120" cy="176" r="5" className="fill-(--cs_card_color)" />
      </g>

      {/* Spark */}
      <path
        d="M186 52l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"
        className="fill-(--cs_accent_color)"
      />
      <circle cx="52" cy="186" r="5" className="fill-(--cs_primary_color)/60" />
    </svg>
  );
};

export default Cs_ToolsIllustration;
