export default function SpaceBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      background: 'radial-gradient(circle at center, #0a0a1a 0%, #000000 100%)',
      pointerEvents: 'none'
    }} />
  )
}