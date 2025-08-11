import { useMemo } from "react"
import type { ProjectData, TaskData, TaskStats } from "../types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";

export default function Project({
    project,
    handleModalOpen,
    handleDeleteProject
}: {
    project: ProjectData,
    handleModalOpen: Function,
    handleDeleteProject: Function
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project?.id });
    const divStyles = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    const calculateTaskStatus = (tasks: TaskData[]): TaskStats => {
        let totalTask = 0, pendingTask = 0, completedTask = 0, inProgressTask = 0
        if (project.task) {
            for (let task of tasks) {
                if (task) {
                    totalTask++
                    if (task?.status && task?.status === "Completed") {
                        completedTask++
                    }
                    if (task?.status && task?.status === "Pending") {
                        pendingTask++
                    }
                    if (task?.status && task?.status === "In-Progress") {
                        inProgressTask++
                    }
                    if (task?.subTask && task?.subTask?.length) {
                        let subTaskStats = calculateTaskStatus(task?.subTask);
                        totalTask += subTaskStats.totalTask;
                        pendingTask += subTaskStats.pendingTask;
                        inProgressTask += subTaskStats.inProgressTask;
                        completedTask += subTaskStats.completedTask;
                    }
                }
            }
        }
        return { totalTask, pendingTask, completedTask, inProgressTask }
    }

    const calculatedProjectProgress: TaskStats | null = useMemo(() => {
        if (project.task?.length) {
            return calculateTaskStatus(project?.task)
        }
        return null
    }, [project])

    const calculateWidth = (value: number, total: number) => {
        return Math.floor((value / total) * 100)
    }

    return (
        <div className="flex flex-col justify-between project rounded-lg bg-[#8ac4ed] p-5" ref={setNodeRef} {...attributes} {...listeners} style={divStyles}>
            <div className="flex justify-between w-[100%]">
                <div className="project-title text-left text-2xl w-[70%]">
                    <b>{project.project}</b>
                </div>
                <div className="project-actions flex justify-between gap-5">
                    <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleModalOpen(project)} title="Open Project">⛶</button>
                    <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDeleteProject(project)} title="Delete Project">🗑</button>
                </div>
            </div>
            <div className="project-actions flex-cols justify-between gap-5 w-[100%] mt-5">
                <p className="text-left text-xl w-[70%]">Project Progress:</p>
                <div className="flex h-[50px] w-[100%] mt-5 overflow-hidden border border-gray-200" title={`Total Task:${calculatedProjectProgress?.totalTask || 0}`}>
                    <div className="flex justify-center items-center rounded complete bg-blue-500 h-[50px]" style={{ width: `${calculatedProjectProgress?.totalTask ? calculateWidth(calculatedProjectProgress?.completedTask, calculatedProjectProgress?.totalTask): 0}%` }} title={`Complete Task: ${calculatedProjectProgress?.completedTask}`}>
                        <span className="relative left-4">{calculatedProjectProgress?.totalTask ? calculateWidth(calculatedProjectProgress?.completedTask, calculatedProjectProgress?.totalTask): 0}%</span>
                    </div>
                </div>
                <div className="flex justify-between pt-5 flex-wrap">
                    <div>Total Task: {calculatedProjectProgress?.totalTask || 0}</div>
                    <div>Completed Task: {calculatedProjectProgress?.completedTask || 0}</div>
                    <div>In-Progress Task: {calculatedProjectProgress?.inProgressTask || 0}</div>
                    <div>Pending Task: {calculatedProjectProgress?.pendingTask || 0}</div>
                </div>
            </div>
        </div>
    )
}