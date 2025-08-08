import type { ProjectData, ProjectFormData, TaskFormData } from "./types";

const projectKey = "projects" 

export function getProjects(): ProjectData[] | null {
    const projects = JSON.parse(localStorage.getItem(projectKey) as string);
    if (projects) {
        return projects.filter(Boolean);
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
    projects.push({ ...data, id: newId });
    setProjects(projects)
    return newId;
}

export function setProjects(project: ProjectData[]) {
    localStorage.setItem(projectKey, JSON.stringify(project));
}

export function insertTask(task: TaskFormData, projectId: number) {
    let projects = getProjects();
    if (projects) {
        let projectIndex = projects.findIndex((project: ProjectData) => project?.id === projectId);
        console.log(projects,projectId, projectIndex)
        if (projectIndex !== -1) {
            let newTaskId = 1;
            if (!projects[projectIndex].task) {
                projects[projectIndex].task = [];
            } else {
                newTaskId = projects[projectIndex].task.length;
            }
            projects[projectIndex].task.push({ ...task, id: newTaskId })
            console.log(projects)
            setProjects(projects)
            return newTaskId;
        }
        return null;
    }
    return null;
}
