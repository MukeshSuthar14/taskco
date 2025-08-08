import { useState } from "react";
import type { FormActions, OperationType, ProjectData, TaskData } from "../types";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import SingleTask from "./SingleTask";

export default function Task({
    project,
    task,
    type,
    parentProject,
    setRenderRequired
}: {
    type: OperationType
    project?: ProjectData | null
    task?: TaskData | null
    parentProject?: ProjectData
    setRenderRequired: Function
}) {
    const [taskFormModal, setTaskFormModal] = useState<boolean>(false);
    const [subTaskFormModal, setSubTaskFormModal] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
    const [taskFormAction, setTaskFormAction] = useState<FormActions>("add");
    const handleModalClose = () => {
        setRenderRequired(true)
        setSelectedTask(null)
        setTaskFormModal(false)
    }
    const handleModalOpen = (data: any) => {
        setSelectedTask(data)
        setTaskFormModal(true)
        setTaskFormAction("add")
    }
    const handleTaskModalClose = () => {
        setSubTaskFormModal(false)
    }
    const handleTaskModalOpen = (task: TaskData) => {
        setSelectedTask(task)
        setSubTaskFormModal(true)
    }
    const handleEditTask = (task: TaskData) => {
        setSelectedTask(task)
        setTaskFormModal(true)
        setTaskFormAction("update")
    }
    const handleDeleleTask = (task: TaskData) => {

    }
    const taskListing = (givenTask: any): React.ReactNode => {
        return (
            (givenTask && givenTask?.length > 0) ? (
                <div className="task-container border-b-2 border-black py-3 px-1 flex flex-col gap-2">
                    {givenTask?.map((task: TaskData, taskKey: number) => (
                        <SingleTask type={type} task={task} index={taskKey} key={taskKey} handleTaskModalOpen={handleTaskModalOpen} handleEditTask={handleEditTask} handleDeleleTask={handleDeleleTask} />
                    ))}
                </div>
            ) : (
                <div className="text-center block pt-2 pb-2 border-b-2 border-black">No Task Pending.</div>
            )
        )
    }

    return (
        <div className="tasks border-cyan-2 py-5 mb-5">
            <div className="task-title text-center text-2xl border-b-2 border-black pb-2 flex justify-between">
                <p>{type === "task" ? "Sub-Tasks" : "Tasks"}</p>
                <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-[1rem]" onClick={() => handleModalOpen(type === "task" ? task : project)}>Add {type === "task" ? "Sub-Task" : "Task"}</button>
            </div>
            {type === "task" ? taskListing(task?.subTask) : taskListing(project?.task)}
            <Modal isOpen={subTaskFormModal} title={`Task: ${selectedTask?.title}${project && project.project ? " of " + project.project : ""}`} onClose={handleTaskModalClose}>
                {selectedTask && <Task type="task" task={selectedTask} parentProject={parentProject} project={project} setRenderRequired={setRenderRequired} />}
            </Modal>
            <Modal isOpen={taskFormModal} title={`${taskFormAction === "update" ? "Update": "Add"} ${selectedTask && selectedTask.title ? "Sub-Task" : "Task"} For ${project?.project ? "Project " + project?.project : "Task " + selectedTask?.title}`} onClose={handleModalClose}>
                {(project || selectedTask) && <TaskForm type={type} task={selectedTask} project={project} parentProject={parentProject} handleModalClose={handleModalClose} formAction={taskFormAction}/>}
            </Modal>
        </div>
    )
}