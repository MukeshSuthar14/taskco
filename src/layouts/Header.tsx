
export default function Header() {

    return (
        <div className="mx-auto flex items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <img className="size-24 shrink-0" src="/logo.png" alt="TaskComplete Logo" />
            <div>
                <div className="text-xl font-medium text-black dark:text-white">TaskComplete</div>
                <p className="text-gray-500 dark:text-gray-400">Project & Task Managment System!</p>
            </div>
        </div>
    )
}