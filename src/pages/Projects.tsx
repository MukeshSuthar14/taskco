import { useForm } from "react-hook-form"
import type { Message, ProjectData, ProjectFormData } from "../utils/types";
import { useEffect, useState } from "react";
import { changeProjectSequence, deleteProjectOrTask, getProjects, insertProject } from "../utils/helper";
import Task from "../utils/components/Task";
import NotifyMessage from "../utils/components/NotifyMessage";
import Modal from "../utils/components/Modal";
import Project from "../utils/components/Project";
import { closestCorners, DndContext, type DragEndEvent } from '@dnd-kit/core';
// import Droppable from "../utils/components/dnd/Draggable";
// import Draggable from "../utils/components/dnd/Draggable";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function Projects() {

    const [projects, setProjects] = useState<ProjectData[] | null>(null);
    const [notifyMessage, setNotifyMessage] = useState<Message | null>(null);
    const [renderRequired, setRenderRequired] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
    const [parentProject, setParentProject] = useState<ProjectData | null>(null);
    const [sorting, setSorting] = useState<boolean>(true)
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

    const {
        register: filterRegister,
        handleSubmit: filterSubmit
    } = useForm({
        defaultValues: defaultValues
    })

    const handleModalClose = () => {
        setModalOpen(false)
        setSelectedProject(null)
        setParentProject(null)
    }

    const handleModalOpen = (currentProject: ProjectData) => {
        setSelectedProject(currentProject)
        setParentProject(currentProject)
        setModalOpen(true)
    }

    const handleProject = (data: ProjectFormData) => {
        const id = insertProject(data);
        if (id) {
            setNotifyMessage({ message: "Project Added Successfully!!" });
            reset();
            setRenderRequired(true)
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id === over?.id) return;

        const activeElementIndex = projects?.findIndex((project: ProjectData) => project.id === active.id);
        const overElementIndex = projects?.findIndex((project: ProjectData) => project.id === over?.id);

        const updatedProjects = arrayMove<ProjectData>(projects as ProjectData[], activeElementIndex as number, overElementIndex as number);

        changeProjectSequence(updatedProjects)
        setProjects(updatedProjects);
    }

    const handleDeleteProject = (project: ProjectData) => {
        const permission = confirm("Are You Sure! You Want To Delete This Project")
        if (permission) {
            deleteProjectOrTask(project?.id);
            setNotifyMessage({ message: "Project Deleted Successfully!!" });
            setRenderRequired(true)
        }
    }

    const handleSearchProject = (data: ProjectFormData) => {
        const allProjects = getProjects();
        if (data?.project.trim()) {
            const filterProject = allProjects?.filter(({ project }: ProjectData) => project.toLowerCase().includes(data?.project.toLowerCase()));
            if (filterProject) setProjects(filterProject);
            else setProjects(null);
        } else {
            setProjects(allProjects);
        }
    }

    useEffect(() => {
        if (renderRequired) {
            const projects = getProjects();
            setProjects(projects);
            if (projects && selectedProject) {
                let currentOpenProject = projects.find((project: ProjectData) => project?.id === selectedProject.id);
                if (currentOpenProject) setSelectedProject(currentOpenProject);
            }
        }
        setRenderRequired(false)
    }, [renderRequired]);

    return (
        <div className="project-add">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Attention!</strong>
                <span className="block sm:inline"> Your Data Is Secure & Only Accessible In This Browser.</span>
            </div>
            {(notifyMessage && notifyMessage?.message) && (
                <NotifyMessage notifyMessage={notifyMessage} />
            )}
            <div className="project-add">
                <div className="">
                    <div className="rounded-lg">
                        <form className="block m-auto" onSubmit={handleSubmit(handleProject)}>
                            <div className="flex justify-between gap-1">
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
            <div className="project-add flex flex-cols justify-between gap-5">
                <form onSubmit={filterSubmit(handleSearchProject)}>
                    <div className="flex justify-end gap-5">
                        <input type="text" className="w-[500px] p-3 focus:outline-none rounded" placeholder="Search By Project Name..." {...filterRegister("project", { required: false })} />
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
                    </div>
                </form>
                {(projects && projects?.length > 0) && (
                    <div className="flex justify-end gap-5">
                        <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setSorting(!sorting)}>{sorting ? "Enable": "Disable"} Drag & Drop</button>
                    </div>
                )}
            </div>
            {(projects && projects?.length > 0) ? (
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                    <div className="project-container grid mt-10 gap-5 grid-cols-3 border-sm">
                        <SortableContext items={projects} strategy={verticalListSortingStrategy} disabled={sorting}>
                            {projects?.map((project: ProjectData, key: number) => (
                                <Project project={project} key={key} handleModalOpen={handleModalOpen} handleDeleteProject={handleDeleteProject} />
                            ))}
                        </SortableContext>
                    </div>
                </DndContext>
            ) : (
                <div className="text-center block mt-10 text-lg rounded-lg bg-[#8ac4ed] p-5">No Project Found.</div>
            )}
            <Modal isOpen={modalOpen} title={`Project: ${selectedProject?.project}`} onClose={handleModalClose}>
                {(selectedProject && parentProject) && <Task type="project" parentProject={parentProject} project={selectedProject} setRenderRequired={setRenderRequired} />}
            </Modal>
        </div>
    )
}