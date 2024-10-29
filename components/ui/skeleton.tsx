export const Skeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse bg-gray-800/50 rounded-md ${className}`}
    />
  )
} 