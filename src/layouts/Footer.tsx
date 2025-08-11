export default function Footer() {
    return (
        <div className="project-add mx-auto flex items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <div className="flex justify-between w-full">
                <div className="text-xl font-medium text-black dark:text-white">Copyright ©{new Date().getFullYear()} TaskComplete. All Rights Reserved.</div>
                <p className="text-gray-500 dark:text-gray-400">Developed By <a className="decoration-none" target="__blank" href="https://linkedin.com/in/mukeshsuthar90">Mukesh Suthar</a></p>
            </div>
        </div>
    )
}