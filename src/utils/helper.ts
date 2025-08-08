import type { OperationType, ProjectData, ProjectFormData, TaskData, TaskFormData } from "./types";

const projectKey = "projects" 

export function getProjects(projectId: number | null = null): ProjectData[] | null {
    const projects = JSON.parse(localStorage.getItem(projectKey) as string).filter(Boolean);
    if (projects) {
        if (projectId) {
            let project = projects.find((project: ProjectData) => project?.id === projectId);
            return project;
        }
        return projects.sort((first: ProjectData, secound: ProjectData) => first.sequence - secound.sequence);
    }
    return null;
}

export function insertProject(data: ProjectFormData): number {
    let projects = getProjects();
    let newId = 1;
    if (projects) {
        newId = projects.length;
    } else {
        projects = []
    }
    let nextSequence = (projects && projects.length > 0) ? Math.max(...projects.map(project => project.sequence)) + 1: 1;
    projects.push({ ...data, id: newId, sequence: nextSequence });
    setProjects(projects)
    return newId;
}

export function setProjects(project: ProjectData[]) {
    localStorage.setItem(projectKey, JSON.stringify(project));
}

export function insertTask(task: TaskFormData, projectId: number, type: OperationType = "project") {
    let projects = getProjects();
    if (type === "project" && projects) {
        let projectIndex = projects.findIndex((project: ProjectData) => project?.id === projectId);
        if (projectIndex !== -1) {
            let newTaskId = 1;
            if (!projects[projectIndex].task) {
                projects[projectIndex].task = [];
            } else {
                newTaskId = projects[projectIndex].task.length;
            }
            projects[projectIndex].task.push({ ...task, id: newTaskId })
            setProjects(projects)
            return newTaskId;
        }
        return null;
    } else if (type === "task" && projects) {
        for (let project of projects) {
            if (project?.task && project.task?.length) {
                let taskIndex = project?.task?.findIndex((task: TaskData) => task?.id === projectId);
                if (taskIndex !== -1) {
                    let newTaskId = 1;
                    if (!project?.task[taskIndex].subTask) {
                        project.task[taskIndex].subTask = [];
                    } else {
                        newTaskId = project?.task[taskIndex].subTask.length;
                    }
                    project?.task[taskIndex].subTask.push({ ...task, id: newTaskId })
                    setProjects(projects)
                    return newTaskId;
                }
            }
        }
    }
    return null;
}
