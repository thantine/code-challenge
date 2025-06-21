export default function Loading() {
  return (
    <div className="flex items-center justify-center space-x-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-auto">
      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-indigo-300 rounded-full animate-bounce [animation-delay:-.16s]"></div>
      <div className="w-3 h-3 bg-indigo-200 rounded-full animate-bounce [animation-delay:-.32s]"></div>
    </div>
  )
}