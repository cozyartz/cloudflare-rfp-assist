export default function Sidebar({ threads, activeThread, onSelectThread }: SidebarProps) {
  return (
    <aside className="w-64 p-4 border-r border-zinc-800 bg-zinc-900 text-white">
      <h2 className="text-lg font-bold mb-4">Chat History</h2>
      <ul className="space-y-2">
        {threads.map((thread, i) => (
          <li key={i}>
            <button
              className={`block w-full text-left px-3 py-2 rounded hover:bg-zinc-800 ${
                activeThread === thread ? 'bg-zinc-800 font-semibold' : ''
              }`}
              onClick={() => onSelectThread(thread)}
            >
              {thread}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
