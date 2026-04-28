export const SkeletonCard = () => (
  <div className="card p-6 space-y-4">
    <div className="h-4 bg-gray-400 rounded animate-pulse w-24"></div>
    <div className="h-8 bg-gray-400 rounded animate-pulse w-32"></div>
    <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
    <div className="h-3 bg-gray-300 rounded animate-pulse w-5/6"></div>
  </div>
);

export const SkeletonShipment = () => (
  <div className="card p-4 space-y-3">
    <div className="flex justify-between items-start">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-400 rounded animate-pulse w-32"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse w-48"></div>
      </div>
      <div className="h-6 bg-gray-400 rounded-full animate-pulse w-16"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-3 bg-gray-300 rounded animate-pulse w-12"></div>
      <div className="h-3 bg-gray-300 rounded animate-pulse w-12"></div>
      <div className="h-3 bg-gray-300 rounded animate-pulse w-12"></div>
    </div>
  </div>
);

export const SkeletonDisruption = () => (
  <div className="card p-4 space-y-3">
    <div className="flex items-start gap-3">
      <div className="h-8 bg-gray-400 rounded animate-pulse w-8 flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-400 rounded animate-pulse w-40"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
        <div className="h-3 bg-gray-300 rounded animate-pulse w-4/5"></div>
      </div>
    </div>
  </div>
);

export const SkeletonKPI = () => (
  <div className="card p-4 space-y-3">
    <div className="h-3 bg-gray-400 rounded animate-pulse w-24"></div>
    <div className="h-8 bg-gray-400 rounded animate-pulse w-16"></div>
    <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
  </div>
);

export const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="space-y-4 text-center">
      <div className="inline-block">
        <div className="w-12 h-12 border-4 border-base-300 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-base-content/60 font-serif">Loading...</p>
    </div>
  </div>
);
