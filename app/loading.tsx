export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#050810]">
      {/* Background Image */}
      <img 
        src="/loading-bg.jpg?v=8" 
        alt="Loading Background" 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#050810_90%)] opacity-80" />
      
      <div className="relative z-10 flex flex-col items-center max-w-3xl text-center">
        <div className="text-2xl md:text-3xl leading-relaxed italic mb-8 text-[#e5e9f0] font-serif mt-16">
          "The training is nothing. The will is everything."
        </div>
        <div className="text-sm tracking-widest uppercase text-[#22d3ee] mb-12">
          - Bruce Wayne
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#8892a6] font-medium">
            LOADING...
          </div>
          <div className="h-px w-48 overflow-hidden bg-[#1e2633]">
            <div className="h-full bg-[#22d3ee]" style={{ width: '50%', animation: 'loading 2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
    </div>
  )
}