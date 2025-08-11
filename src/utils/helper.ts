import type { OperationType, ProjectData, ProjectFormData, TaskData, TaskFormData } from "./types";

const projectKey = "projects"

export function getProjects(projectId: number | null = null): ProjectData[] | null {
    let projects = JSON.parse(localStorage.getItem(projectKey) as string);
    if (projects) {
        if (projectId) {
            let project = projects.find((project: ProjectData) => project?.id === projectId);
            return project;
        }
        return projects.sort((first: ProjectData, secound: ProjectData) => first.sequence - secound.sequence);
    }
    return null;
}

export function taskSort(task: TaskData[] | undefined) {
    return task && task.sort((first: TaskData, secound: TaskData) => first.sequence - secound.sequence);
}

export function insertProject(data: ProjectFormData): number {
    let projects = getProjects();
    let newId = 1;
    if (projects) {
        newId = projects.length + 1;
    } else {
        projects = []
    }
    let nextSequence = (projects && projects.length > 0) ? Math.max(...projects.map(project => project.sequence)) + 1 : 1;
    projects.push({ ...data, id: newId, sequence: nextSequence });
    setProjects(projects)
    return newId;
}

export function setProjects(project: ProjectData[]) {
    localStorage.setItem(projectKey, JSON.stringify(project.filter(Boolean)));
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
                newTaskId = projects[projectIndex].task.length + 1;
            }
            let nextSequence = (projects[projectIndex] && projects[projectIndex].task.length > 0) ? Math.max(...projects[projectIndex].task.map(project => project.sequence)) + 1 : 1;
            projects[projectIndex].task.push({ ...task, id: newTaskId, sequence: nextSequence })
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
                        newTaskId = project?.task[taskIndex].subTask.length + 1;
                    }
                    let nextSequence = (project?.task[taskIndex] && project?.task[taskIndex].subTask.length > 0) ? Math.max(...project?.task[taskIndex].subTask.map(project => project.sequence)) + 1 : 1;
                    project?.task[taskIndex].subTask.push({ ...task, id: newTaskId, sequence: nextSequence })
                    setProjects(projects)
                    return newTaskId;
                }
            }
        }
    }
    return null;
}

export function deleteProjectOrTask(id: number, taskId?: number, subTaskId?: number) {
    let projects = getProjects();
    if (projects) {
        let projectIndex = projects.findIndex((project: ProjectData) => project?.id === id);
        if (taskId) {
            if (projects[projectIndex] && projects[projectIndex].task && projects[projectIndex].task?.length) {
                let taskIndex = projects[projectIndex]?.task.findIndex((task: TaskData) => task.id === taskId);
                if (subTaskId) {
                    if (taskIndex !== -1 && projects[projectIndex].task[taskIndex] && projects[projectIndex].task[taskIndex].subTask?.length) {
                        let subTaskIndex = projects[projectIndex]?.task[taskIndex].subTask.findIndex((task: TaskData) => task.id === subTaskId);
                        if (subTaskIndex !== -1 && projects[projectIndex]?.task[taskIndex].subTask[subTaskIndex]) {
                            delete projects[projectIndex].task[taskIndex].subTask[subTaskIndex];
                            projects[projectIndex].task[taskIndex].subTask = projects[projectIndex].task[taskIndex].subTask.filter(Boolean)
                            setProjects(projects)
                            return true
                        }
                    }
                } else {
                    if (taskIndex !== -1 && projects[projectIndex].task[taskIndex]) {
                        delete projects[projectIndex].task[taskIndex];
                        projects[projectIndex].task = projects[projectIndex].task.filter(Boolean)
                        setProjects(projects)
                        return true
                    }
                }
            }
        } else {
            if (projects[projectIndex]) {
                delete projects[projectIndex];
                setProjects(projects)
                return true;
            }
        }
    }
    return false
}

export function updateTask(task: TaskFormData, type: OperationType, projectId: number, taskId: number, subTaskId: number | null = null) {
    let projects = getProjects();
    if (type === "project" && projects) {
        let projectIndex = projects.findIndex((project: ProjectData) => project?.id === projectId);
        if (projectIndex !== -1 && projects[projectIndex] && projects[projectIndex]?.task?.length) {
            let taskIndex = projects[projectIndex]?.task.findIndex((task: TaskData) => task.id === taskId);
            if (taskIndex !== -1 && projects[projectIndex].task[taskIndex]) {
                projects[projectIndex].task[taskIndex] = { ...task, id: projects[projectIndex].task[taskIndex].id, sequence: projects[projectIndex].task[taskIndex].sequence }
                setProjects(projects)
                return true
            }
        }
    } else if (type === "task" && projects) {
        let projectIndex = projects.findIndex((project: ProjectData) => project?.id === projectId);
        if (projectIndex !== -1 && projects[projectIndex] && projects[projectIndex]?.task) {
            let taskIndex = projects[projectIndex]?.task.findIndex((task: TaskData) => task.id === taskId);
            if (taskIndex !== -1 && projects[projectIndex].task[taskIndex] && projects[projectIndex].task[taskIndex].subTask?.length) {
                let subTaskIndex = projects[projectIndex]?.task[taskIndex].subTask.findIndex((task: TaskData) => task.id === subTaskId);
                if (subTaskIndex !== -1 && projects[projectIndex]?.task[taskIndex].subTask[subTaskIndex]) {
                    projects[projectIndex].task[taskIndex].subTask[subTaskIndex] = { ...task, id: projects[projectIndex]?.task[taskIndex].subTask[subTaskIndex].id, sequence: projects[projectIndex]?.task[taskIndex].subTask[subTaskIndex].sequence }
                    setProjects(projects)
                    return true
                }
            }
        }
    }
    return false
}

export function changeProjectSequence(updatedProjects: ProjectData[]) {
    let sequence = 1;
    for (let project of updatedProjects) {
        if (project && project?.sequence) {
            project.sequence = sequence;
            sequence++
        }
    }
    setProjects(updatedProjects)
    return true
}

export function changeTaskSequence(type: OperationType, updatedTask: TaskData[], projectId: number, taskId: number) {
    let projects = getProjects();
    let sequence = 1;
    for (let task of updatedTask) {
        if (task && task?.sequence) {
            task.sequence = sequence;
            sequence++
        }
    }
    if (type === "task") {
        if (projects) {
            let projectIndex = projects.findIndex((project: ProjectData) => project?.id === projectId);
            if (projectIndex !== -1 && projects[projectIndex] && projects[projectIndex]?.task?.length) {
                let taskIndex = projects[projectIndex]?.task.findIndex((task: TaskData) => task.id === taskId);
                if (taskIndex !== -1 && projects[projectIndex].task[taskIndex] && projects[projectIndex].task[taskIndex].subTask?.length) {
                    projects[projectIndex].task[taskIndex].subTask = updatedTask;
                    setProjects(projects)
                }
            }
        }
    } else if (type === "project") {
        if (projects) {
            let projectIndex = projects.findIndex((project: ProjectData) => project?.id === projectId);
            if (projectIndex !== -1 && projects[projectIndex] && projects[projectIndex]?.task?.length) {
                projects[projectIndex].task = updatedTask;
                setProjects(projects)
                return true
            }
        }
    }
    return false
}