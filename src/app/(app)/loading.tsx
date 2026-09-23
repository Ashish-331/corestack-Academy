export default function AppLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="space-y-3">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-8 w-72 max-w-full" />
        <div className="skeleton h-3 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="panel p-4">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton mt-3 h-7 w-16" />
            <div className="skeleton mt-2 h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="panel space-y-4 p-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-2 w-full" />
            </div>
          ))}
        </div>
        <div className="panel space-y-3 p-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
