import { useForm } from "react-hook-form";
import type { ProjectData, TaskData, TaskFormData } from "../types";
import { insertTask } from "../helper";

export default function Task({
    project
}: {
    project: ProjectData
}) {

    const taskFormDefaultValues: TaskFormData = {
        name: "",
        projectId: ""
    }

    const {
        register: registerTaskForm,
        formState: { errors: taskFormErrors },
        handleSubmit: handleTaskFormSubmit,
        reset: resetTaskForm
    } = useForm({
        defaultValues: taskFormDefaultValues
    })

    const handleTaskForm = (data: TaskFormData) => {
        insertTask(data, parseInt(data?.projectId));
        resetTaskForm();
    }
    
    return (
        <div className="tasks mt-5 p-3 border-2 border-cyan-2">
            <div className="task-title text-center text-2xl border-b-2 border-black pb-2">
                Tasks
            </div>
            {(project?.task && project?.task?.length > 0) ? (
                <div className="task-container">
                    {project?.task?.map((task: TaskData, taskKey: number) => (
                        <div className="task" key={`${taskKey}`}>
                            {task?.name}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center block mt-2">No Task Pending.</div>
            )}
            <div className="task-add border-t-2 border-black p-2 mt-5">
                <form className="flex justify-between" onSubmit={handleTaskFormSubmit(handleTaskForm)}>
                    <input type="text" className="w-full px-4 py-2 mr-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter Project Task" autoComplete="off" {...registerTaskForm("name", { required: "Please Enter Task" })} />
                    <input type="hidden" value={project?.id} {...registerTaskForm('projectId', { required: true })} />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</button>
                </form>
                {(taskFormErrors && taskFormErrors.name) && (
                    <label className="text-red-500">{taskFormErrors?.name?.message}</label>
                )}
            </div>
        </div>
    )
}