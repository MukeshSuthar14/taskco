import { useForm } from "react-hook-form"
import type { Message, ProjectData, ProjectFormData, TaskData, TaskFormData } from "../utils/types";
import { useEffect, useState } from "react";
import { getProjects, insertProject } from "../utils/helper";
import Task from "../utils/components/Task";
import NotifyMessage from "../utils/components/NotifyMessage";

export default function Project() {

    const [projects, setProjects] = useState<ProjectData[] | null>(null);
    const [notifyMessage, setNotifyMessage] = useState<Message | null>(null);
    const [renderRequired, setRenderRequired] = useState<boolean>(true);
    const defaultValues: ProjectFormData = {
        project: ""
    }

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        defaultValues: defaultValues
    })

    

    const handleProject = (data: ProjectFormData) => {
        const id = insertProject(data);
        if (id) {
            setNotifyMessage({ message: "Project Added Successfully!!" });
            reset();
            setRenderRequired(true)
        }
    }

    useEffect(() => {
        if (renderRequired) setProjects(getProjects());
        setRenderRequired(false)
    }, [renderRequired]);

    return (
        <div className="project-add">
            {(notifyMessage && notifyMessage?.message) && (
                <NotifyMessage notifyMessage={notifyMessage} />
            )}
            <div className="project-add">
                <div className="">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <form className="block m-auto" onSubmit={handleSubmit(handleProject)}>
                            <div className="flex mb-4">
                                <input type="text" className="w-full px-4 py-2 mr-2 rounded-lg focus:outline-none focus:border-blue-500" autoComplete="off" placeholder="Enter Your Project Name" {...register("project", { required: "Please Enter Project Name" })} />
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Add
                                </button>
                            </div>
                            {(errors && errors.project) && (
                                <label className="text-red-500 pl-4">{errors?.project?.message}</label>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            {(projects && projects?.length > 0) && (
                <div className="project-add flex justify-end gap-5">
                    <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enable Drag & Drop</button>
                    <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Change Sequence</button>
                </div>
            )}
            {(projects && projects?.length > 0) ? (
                <div className="project-container grid mt-10 gap-5 grid-cols-3 border-sm">
                    {projects?.map((project: ProjectData, key: number) => (
                        <div className="project rounded-lg bg-[#8ac4ed] p-5" key={key}>
                            <div className="project-title text-center text-3xl">
                                <b>{project.project}</b>
                            </div>
                            <Task project={project} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center block mt-10 text-lg">No Project Found.</div>
            )}
        </div>
    )
}