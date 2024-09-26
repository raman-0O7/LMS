
export default function AuthLayout({
  children
} : {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 to-gray-400">
      {children}
    </div>
  )
}