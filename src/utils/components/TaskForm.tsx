import { useForm } from "react-hook-form";
import type { FormActions, OperationType, ProjectData, TaskData, TaskFormData } from "../types";
import { insertTask, updateTask } from "../helper";

export default function TaskForm({
    type,
    task,
    project,
    handleModalClose,
    formAction,
    parentProject
}: {
    type: OperationType
    task?: TaskData | null
    project?: ProjectData | null
    handleModalClose: Function
    formAction: FormActions
    parentProject: ProjectData
}) {
    const taskFormDefaultValues: TaskFormData = {
        title: (task && formAction === "update") ? task?.title: "",
        description: (task && formAction === "update") ? task?.description: "",
        dueDate: (task && formAction === "update") ? task?.dueDate: new Date(),
        status: (task && formAction === "update") ? task?.status: ""
    }

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        defaultValues: taskFormDefaultValues
    })

    const handleTaskForm = (data: TaskFormData, projectOrTask: ProjectData | TaskData) => {
        if (formAction === "add") {
            console.log("Inserting =>>", data, projectOrTask.id, type);
            insertTask(data, projectOrTask?.id, type);
        } else {
            console.log("Updating =>>", "data =>>", data, "type =>>", type, "parentProject.id =>>", parentProject?.id, "project.id =>>", project?.id, "task.id =>>", task?.id);
            if (project && task && parentProject) {
                updateTask(data, type, parentProject?.id, project?.id, task?.id);
            }
        }
        handleModalClose()
        reset();
    }

    return (
        <div className="task-add border-black py-5 mb-5">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit((data: TaskFormData) => handleTaskForm(data, (type === "project" ? (project as ProjectData) : (task as TaskData))))}>
                <div className="flex flex-col gap-1">
                    <input type="text" className="w-full px-4 py-2 mr-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter Task Title" autoComplete="off" {...register("title", { required: "Please Enter Task Title" })} />
                    {(errors && errors.title) && (
                        <label className="text-red-500">{errors?.title?.message}</label>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <input type="text" className="w-full px-4 py-2 mr-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter Task Description" autoComplete="off" {...register("description", { required: "Please Enter Task Description" })} />
                    {(errors && errors.description) && (
                        <label className="text-red-500">{errors?.description?.message}</label>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <input type="date" className="w-full px-4 py-2 mr-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Select Due Date" autoComplete="off" {...register("dueDate", { required: "Please Select Due Date" })} />
                    {(errors && errors.dueDate) && (
                        <label className="text-red-500">{errors?.dueDate?.message}</label>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <select className="w-full px-4 py-2 mr-2 rounded-lg focus:outline-none focus:border-blue-500" defaultValue={""} {...register("status", { required: "Please Select Task Status" })}>
                        <option value="">Select</option>
                        <option value="Pending">Pending</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    {(errors && errors.status) && (
                        <label className="text-red-500">{errors?.status?.message}</label>
                    )}
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" title={formAction === "update" ? "Update": "Add"}>{formAction === "update" ? "Update": "Add"}</button>
            </form>
        </div>
    )
}