export default function LogoEmblem({ size = 44, className = '' }: { size?: number, className?: string }) {
  return (
    <img 
      src="/logo.jpg?v=7" 
      alt="Meridian Academy" 
      width={size} 
      height={size} 
      className={`object-contain ${className}`} 
      style={{ 
        mixBlendMode: 'screen'
      }}
    />
  )
}