type Props = { variant?: "dashboard" | "learning" | string };

export default function AcademyBackground({ variant }: Props) {
  const dim = variant === "learning" ? 0.85 : 1;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[#050810]" style={{ opacity: dim }} aria-hidden="true">
      {/* Deep Space Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1018] via-[#050810] to-[#020408]" />
      
      {/* Cyberpunk Horizon Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[#22d3ee]/20 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[20vh] bg-gradient-to-b from-[#8b5cf6]/10 to-transparent" />

      {/* Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#22d3ee]/10 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8b5cf6]/10 blur-[120px] rounded-full mix-blend-screen" />
      
      {/* Subtle Vignette to focus the center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#050810_100%)] opacity-80" />
    </div>
  );
}