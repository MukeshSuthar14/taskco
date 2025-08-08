import { useDrag } from "react-dnd";
import type { ProjectData } from "../types"

export default function Project({
    project,
    handleModalOpen
}: {
    project: ProjectData,
    handleModalOpen: Function
}) {
    const [{ opacity }, dragRef] = useDrag(
        () => ({
            type: "div",
            // item: { text },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1
        })
    }), []);

    return (
        <div className="flex justify-between project rounded-lg bg-[#8ac4ed] p-5">
            <div className="project-title text-center text-2xl">
                <b>{project.project}</b>
            </div>
            <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleModalOpen(project)}>Open Project</button>
        </div>
    )
}