import type { OperationType, TaskData } from "../types"

export default function SingleTask({
    index,
    task,
    handleTaskModalOpen,
    type,
    handleEditTask,
    handleDeleleTask
}: {
    index: number
    task: TaskData
    handleTaskModalOpen: Function
    type: OperationType,
    handleEditTask: Function
    handleDeleleTask: Function
}) {
    return (
        <div className="task">
            <details className="py-1 bg-emerald-100 w-full">
                <summary className="py-1 pl-5 pr-5 rounded text-[1rem]">{index + 1}) Title: {task?.title}, Status: {task.status}</summary>
                <div className="py-1 pl-5 pr-5">
                    <p>Title: {task?.title}</p>
                    <p>Description: {task?.description}</p>
                    <p>Due Date: {task?.dueDate.toString()}</p>
                    <p>Status: {task?.status}</p>
                    <div className="flex justify-end gap-1">
                        {(type && type !== "task") && <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3" onClick={() => handleTaskModalOpen(task)}>Show Sub Tasks</button>}
                        <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-3" onClick={() => handleEditTask(task)} title="Edit Task">✎</button>
                        <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-3" onClick={() => handleDeleleTask(task)} title="Delete Task">🗑</button>
                    </div>
                </div>
            </details>
        </div>
    )
}