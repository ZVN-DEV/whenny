export default function Loading() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </main>
  )
}
