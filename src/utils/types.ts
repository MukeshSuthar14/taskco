export interface ProjectFormData {
    project: string
}

export interface TaskData extends TaskFormData {
    id: number
    subTask?: TaskData[]
}

export interface ProjectData {
    id: number
    project: string
    sequence: number
    task?: TaskData[]
}

export interface Message {
    message: string
}

export interface TaskFormData {
    title: string
    description: string
    dueDate: Date
    status: "Pending" | "In-Progress" | "Completed"
}

export type OperationType = "task" | "project"