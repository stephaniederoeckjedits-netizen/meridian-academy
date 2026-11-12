export default function LogoEmblem({ size = 44, className = '' }: { size?: number, className?: string }) {
  return (
    <div className="bg-[#050810] inline-block" style={{ mixBlendMode: 'screen' }}>
      <img 
        src="/logo.jpg?v=6" 
        alt="Meridian Academy" 
        width={size} 
        height={size} 
        className={`object-contain ${className}`} 
        style={{ 
          filter: 'contrast(1.5) brightness(1.2) saturate(1.2)'
        }}
      />
    </div>
  )
}