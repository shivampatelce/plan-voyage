export interface AddTaskReq {
  taskTitle: string;
  tripId: string;
  createdBy: string;
}

export interface UpdateTaskReq {
  taskTitle: string;
  taskId: string;
  tripId: string;
  userId: string;
}

export interface ToDoList {
  taskId: string;
  taskTitle: string;
  createdBy: string;
  markedDoneBy?: string;
  bgColor?: string;
  textColor?: string;
}

export interface MarkAsDoneReq {
  userId: string | null;
  taskId: string;
  tripId: string;
}
