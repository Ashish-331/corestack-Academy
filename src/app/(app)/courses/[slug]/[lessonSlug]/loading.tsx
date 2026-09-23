export default function LessonLoading() {
  return (
    <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
      <div className="space-y-6">
        <div className="panel space-y-4 p-6">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-2/3" />
        </div>
        <div className="panel space-y-3 p-6">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="skeleton h-3 w-full" style={{ width: `${100 - (i % 3) * 8}%` }} />
          ))}
        </div>
      </div>
      <div className="panel h-40" />
    </div>
  );
}
