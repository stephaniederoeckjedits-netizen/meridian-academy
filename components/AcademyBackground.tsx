type Props = { variant?: "dashboard" | "learning" | string };

export default function AcademyBackground({ variant }: Props) {
  const dim = variant === "learning" ? 0.85 : 1;
  return (
    <div className="m-bg-root" data-variant={variant ?? "default"} aria-hidden="true" style={{ opacity: dim }}>
      <div className="m-bg-base" />
      <div className="m-bg-grid" />
      <div className="m-bg-orb a" />
      <div className="m-bg-orb b" />
      <div className="m-bg-horizon" />
      <div className="m-bg-vignette" />
    </div>
  );
}