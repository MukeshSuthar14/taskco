import { useForm } from "react-hook-form";
import type { OperationType, ProjectData, TaskData, TaskFormData } from "../types";
import { insertTask } from "../helper";

export default function TaskForm({
    type,
    task,
    project,
    handleModalClose
}: {
    type: OperationType
    task?: TaskData | null
    project?: ProjectData | null
    handleModalClose: Function
}) {
    const taskFormDefaultValues: TaskFormData = {
        title: "",
        description: "",
        dueDate: new Date(),
        status: "Pending"
    }

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        defaultValues: taskFormDefaultValues
    })

    const handleTaskForm = (data: TaskFormData, currentProject: ProjectData | TaskData, type: OperationType) => {
        console.log("Inserting =>>", data, currentProject);
        insertTask(data, currentProject?.id, type);
        console.log("Inserted");
        handleModalClose()
        console.log("Reload");
        reset();
    }

    return (
        <div className="task-add border-black py-5 mb-5">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit((data: TaskFormData) => handleTaskForm(data, (type === "project" ? (project as ProjectData): (task as TaskData)), type))}>
                <input type="text" className="w-full px-4 py-2 mr-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter Task Title" autoComplete="off" {...register("title", { required: "Please Enter Task Title" })} />
                {(errors && errors.title) && (
                    <label className="text-red-500">{errors?.title?.message}</label>
                )}
                <input type="text" className="w-full px-4 py-2 mr-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter Task Description" autoComplete="off" {...register("description", { required: "Please Enter Task Description" })} />
                {(errors && errors.description) && (
                    <label className="text-red-500">{errors?.description?.message}</label>
                )}
                <input type="date" className="w-full px-4 py-2 mr-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Select Due Date" autoComplete="off" {...register("dueDate", { required: "Please Select Due Date" })} />
                {(errors && errors.dueDate) && (
                    <label className="text-red-500">{errors?.dueDate?.message}</label>
                )}
                <select className="w-full px-4 py-2 mr-2 rounded-lg focus:outline-none focus:border-blue-500" {...register("status", { required: "Please Select Task Status" })}>
                    <option value="">Select</option>
                    <option value="Pending">Pending</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                {(errors && errors.status) && (
                    <label className="text-red-500">{errors?.status?.message}</label>
                )}
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</button>
            </form>
        </div>
    )
}