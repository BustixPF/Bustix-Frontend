interface AuthStat {
  value: string;
  label: string;
}

interface AuthSidePanelProps {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  description: string;
  stats: AuthStat[];
}

const AuthSidePanel = ({
  eyebrow,
  titleLine1,
  titleAccent,
  description,
  stats,
}: AuthSidePanelProps) => {
  return (
    <div className="bustix-dark relative hidden flex-col justify-center overflow-hidden bg-background px-12 py-16 lg:flex lg:w-[42%]">
      <p className="flex items-center gap-2 font-mono-label text-xs uppercase text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {eyebrow}
      </p>

      <h1 className="mt-4 font-display text-4xl leading-tight text-foreground">
        {titleLine1}
        <br />
        <span className="text-primary">{titleAccent}</span>
      </h1>

      <p className="mt-4 max-w-xs text-sm text-muted-foreground">{description}</p>

      <dl className="mt-16 grid max-w-sm grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className="font-display text-xl text-foreground">{stat.value}</dd>
            <dt className="mt-1 text-xs text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>

      {/* Silueta de triángulos irregulares del pie del panel, calcada
          proporcionalmente del path del SVG de referencia (bustix-login.svg). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 70"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-24 w-full"
      >
        <path
          d="M0,70 L0,28.8 28.6,18.5 50,30.9 78.6,8.2 107.1,26.8 135.7,0 164.3,23.7 192.9,10.3 221.4,37 250,13.4 285.7,28.8 314.3,6.2 342.9,26.8 371.4,10.3 400,23.7 400,70 Z"
          className="fill-black/25"
        />
      </svg>
    </div>
  );
};

export default AuthSidePanel;