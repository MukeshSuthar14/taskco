import { useEffect, useState } from "react";
import type { FormActions, OperationType, ProjectData, TaskData } from "../types";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import SingleTask from "./SingleTask";
import { changeTaskSequence, deleteProjectOrTask, getProjects, taskSort } from "../helper";
import { useForm } from "react-hook-form";
import { closestCorners, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

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
    const {
        register: filterRegister,
        handleSubmit: filterSubmit
    } = useForm({
        defaultValues: {
            task: "",
            status: ""
        }
    })
    const [currentTasks, setCurrentTasks] = useState<TaskData[] | undefined>(taskSort(project?.task));
    const [currentSubTasks, setCurrentSubTasks] = useState<TaskData[] | undefined>(taskSort(task?.subTask));
    const [taskFormModal, setTaskFormModal] = useState<boolean>(false);
    const [subTaskFormModal, setSubTaskFormModal] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
    const [taskFormAction, setTaskFormAction] = useState<FormActions>("add");
    const [sorting, setSorting] = useState<boolean>(true);
    const handleModalClose = () => {
        if (type === "task") {
            const freshProjects = getProjects();
            if (freshProjects) {
                let projectIndex = freshProjects.findIndex((project: ProjectData) => project?.id === parentProject?.id);
                if (projectIndex !== -1 && freshProjects[projectIndex] && freshProjects[projectIndex]?.task?.length) {
                    let taskIndex = freshProjects[projectIndex]?.task.findIndex((task: TaskData) => task.id === project?.id);
                    if (taskIndex !== -1 && freshProjects[projectIndex].task[taskIndex]) {
                        setSelectedTask(freshProjects[projectIndex].task[taskIndex]);
                    }
                }
            }
        } else {
            setSelectedTask(null)
        }
        setRenderRequired(true)
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
        const permission = confirm("Are You Sure! You Want To Delete This Task")
        if (permission && project?.id) {
            if (type === "project") deleteProjectOrTask(project?.id, task?.id)
            else if (parentProject?.id) deleteProjectOrTask(parentProject?.id, project?.id, task?.id)
            setRenderRequired(true)
        }
    }
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id === over?.id) return;

        let updatedTasks = null;
        if (type === "project") {
            let activeElementIndex = currentTasks?.findIndex((currentTask: TaskData) => currentTask.id === active.id);
            let overElementIndex = currentTasks?.findIndex((currentTask: TaskData) => currentTask.id === over?.id);
            updatedTasks = arrayMove<TaskData>(currentTasks as TaskData[], activeElementIndex as number, overElementIndex as number);
        } else if (type === "task") {
            let activeElementIndex = currentSubTasks?.findIndex((currentTask: TaskData) => currentTask.id === active.id);
            let overElementIndex = currentSubTasks?.findIndex((currentTask: TaskData) => currentTask.id === over?.id);
            updatedTasks = arrayMove<TaskData>(currentSubTasks as TaskData[], activeElementIndex as number, overElementIndex as number);
        }

        if (updatedTasks) {
            if (parentProject?.id && project?.id) changeTaskSequence(type, updatedTasks, parentProject?.id, project?.id);
            setCurrentTasks(updatedTasks);
        }
    }

    const taskListing = (givenTask: any): React.ReactNode => {
        return (
            (givenTask && givenTask?.length > 0) ? (
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                    <div className="task-container border-b-2 border-black py-3 px-1 flex flex-col gap-2">
                        <SortableContext items={givenTask} strategy={verticalListSortingStrategy} disabled={sorting}>
                            {givenTask?.map((task: TaskData, taskKey: number) => (
                                <SingleTask type={type} task={task} index={taskKey} key={taskKey} handleTaskModalOpen={handleTaskModalOpen} handleEditTask={handleEditTask} handleDeleleTask={handleDeleleTask} />
                            ))}
                        </SortableContext>
                    </div>
                </DndContext >
            ) : (
                <div className="text-center block pt-2 pb-2 border-b-2 border-black">No Task Pending.</div>
            )
        )
    }

    const handleSearchProject = (data: { task: string, status: string }) => {
        const allTasks = type === "project" ? project?.task : task?.subTask;
        if (data.task.trim() || data.status) {
            const filterTasks = allTasks?.filter(({ title, description, status }: TaskData) => {
                let search = data.task.toLowerCase();
                let result = (title.toLowerCase().includes(search) || description.toLowerCase().includes(search));
                if (data.status) {
                    result &&= (status.toLowerCase() === data.status.toLowerCase())
                }
                return result
            });
            if (filterTasks) (type === "project" ? setCurrentTasks : setCurrentSubTasks)(filterTasks);
            else (type === "project" ? setCurrentTasks : setCurrentSubTasks)(undefined);
        } else {
            (type === "project" ? setCurrentTasks : setCurrentSubTasks)(allTasks)
        }
    }

    useEffect(() => {
        setCurrentTasks(taskSort(project?.task))
    }, [project?.task])

    useEffect(() => {
        setCurrentSubTasks(taskSort(task?.subTask))
    }, [task?.subTask])

    return (
        <div className="tasks border-cyan-2 py-5 mb-5">
            <div className="task-title text-center flex justify-between mb-2 gap-2">
                <p className="text-left w-[40%] text-3xl">{type === "task" ? "Sub-Tasks" : "Tasks"}</p>
                <button type="button" className="w-[30%] bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-[1rem]" onClick={() => handleModalOpen(type === "task" ? task : project)}>Add {type === "task" ? "Sub-Task" : "Task"}</button>
                <button type="button" className="w-[30%] bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded text-[1rem]" onClick={() => setSorting(!sorting)}>{sorting ? "Enable" : "Disable"}</button>
            </div>
            <form className="pb-3 border-b-2 border-black" onSubmit={filterSubmit(handleSearchProject)}>
                <div className="flex justify-between gap-1">
                    <input type="text" className="w-[400px] p-3 focus:outline-none rounded" placeholder="Search By Task Title, Task Description..." {...filterRegister("task", { required: false })} />
                    <select className="w-full px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" defaultValue={""} {...filterRegister("status", { required: false })}>
                        <option value="">Select</option>
                        <option value="Pending">Pending</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">Search</button>
                </div>
            </form>
            {type === "task" ? taskListing(currentSubTasks) : taskListing(currentTasks)}
            <Modal isOpen={subTaskFormModal} title={`Task: ${selectedTask?.title}${project && project.project ? " of " + project.project : ""}`} onClose={handleTaskModalClose}>
                {selectedTask && <Task type="task" task={selectedTask} parentProject={parentProject} project={project} setRenderRequired={setRenderRequired} />}
            </Modal>
            <Modal isOpen={taskFormModal} title={`${taskFormAction === "update" ? "Update" : "Add"} ${selectedTask && selectedTask.title ? "Sub-Task" : "Task"} For ${project?.project ? "Project " + project?.project : "Task " + selectedTask?.title}`} onClose={handleModalClose}>
                {(project || selectedTask) && <TaskForm type={type} task={selectedTask} project={project} parentProject={parentProject} handleModalClose={handleModalClose} formAction={taskFormAction} />}
            </Modal>
        </div>
    )
}