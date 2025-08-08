import type { ProjectData } from "../types"

export default function Project({
    project,
    handleModalOpen,
    handleDeleteProject
}: {
    project: ProjectData,
    handleModalOpen: Function,
    handleDeleteProject: Function
}) {
    return (
        <div className="flex justify-between project rounded-lg bg-[#8ac4ed] p-5">
            <div className="project-title text-left text-2xl w-[70%]">
                <b>{project.project}</b>
            </div>
            <div className="project-actions flex justify-between gap-5">
                <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleModalOpen(project)} title="Open Project">⛶</button>
                <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDeleteProject(project)} title="Delete Project">🗑</button>
            </div>
        </div>
    )
}