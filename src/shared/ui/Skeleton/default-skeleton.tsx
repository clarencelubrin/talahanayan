export function BasicSkeleton({className}: {className?: string}) {
    return (
        <div className={`bg-stone-100 animate-skeletonGradient rounded-lg ${className}`} />
    )
}