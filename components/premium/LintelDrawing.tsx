// Schematische doorsnede van een opening in een dragende muur met stalen
// ligger: uitleg in beeld, in de stijl van een bouwtekening. Geen echte maten.
export default function LintelDrawing() {
  return (
    <figure className="rounded-card border border-[var(--pr-line)] bg-white p-6">
      <p className="pr-measure">schematische doorsnede, geen werktekening</p>
      <svg aria-labelledby="ligger-titel ligger-uitleg" className="mt-5 h-auto w-full" role="img" viewBox="0 0 480 300">
        <title id="ligger-titel">Opening in een dragende muur met stalen ligger</title>
        <desc id="ligger-uitleg">
          De muur boven de opening rust op een stalen ligger. De ligger ligt aan beide kanten op een oplegging in de bestaande muur. Het profiel volgt uit de constructieberekening.
        </desc>
        <defs>
          <pattern height="10" id="arcering" patternTransform="rotate(45)" patternUnits="userSpaceOnUse" width="10">
            <line stroke="#a39d90" strokeWidth="1" x1="0" x2="0" y1="0" y2="10" />
          </pattern>
        </defs>
        {/* muur */}
        <rect fill="url(#arcering)" height="210" stroke="#181613" strokeWidth="1.5" width="440" x="20" y="20" />
        {/* opening */}
        <rect fill="#f7f3ec" height="138" stroke="#181613" strokeWidth="1.5" width="280" x="100" y="92" />
        {/* opleggingen */}
        <rect fill="#5c574d" height="10" width="36" x="70" y="74" />
        <rect fill="#5c574d" height="10" width="36" x="374" y="74" />
        {/* stalen ligger (IPE-profiel) */}
        <rect fill="#181613" height="16" width="340" x="70" y="58" />
        <rect fill="#c4520f" height="3" width="340" x="70" y="56" />
        {/* maatlijn breedte opening */}
        <g stroke="#c4520f" strokeWidth="1">
          <line x1="100" x2="100" y1="244" y2="262" />
          <line x1="380" x2="380" y1="244" y2="262" />
          <line x1="100" x2="380" y1="254" y2="254" />
        </g>
        <text fill="#5c574d" fontFamily="var(--font-poppins), Arial" fontSize="13" textAnchor="middle" x="240" y="280">
          breedte opening
        </text>
        {/* labels */}
        <g fill="#181613" fontFamily="var(--font-poppins), Arial" fontSize="13">
          <text x="262" y="40">stalen ligger</text>
          <line stroke="#181613" strokeWidth="1" x1="258" x2="244" y1="36" y2="56" />
          <text x="24" y="110">oplegging</text>
          <line stroke="#181613" strokeWidth="1" x1="60" x2="80" y1="100" y2="84" />
        </g>
      </svg>
      <figcaption className="mt-4 text-[15px] pr-muted">
        De muur boven de opening rust na het werk op een stalen ligger. Welk profiel en welke opleggingen nodig zijn, bepaalt de constructeur.
      </figcaption>
    </figure>
  );
}
