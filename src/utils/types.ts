export interface ProjectFormData {
    project: string
}

export interface TaskData {
    id: number
    name: string
    subTask?: TaskData[]
}

export interface ProjectData {
    id: number
    project: string
    task?: TaskData[]
}

export interface Message {
    message: string
}

export interface TaskFormData {
    projectId: string
    name: string
}