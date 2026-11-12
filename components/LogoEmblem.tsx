export default function LogoEmblem({ size = 44, className = '' }: { size?: number, className?: string }) {
  return (
    <img 
      src="/logo.jpg?v=5" 
      alt="Meridian Academy" 
      width={size} 
      height={size} 
      className={`object-contain ${className}`} 
      style={{ 
        mixBlendMode: 'screen',
        filter: 'contrast(1.3) brightness(1.2) saturate(1.1)'
      }}
    />
  )
}