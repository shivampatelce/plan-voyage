export interface AddTaskReq {
  taskTitle: string;
  tripId: string;
  createdBy: string;
}

export interface ToDoList {
  taskId: string;
  taskTitle: string;
  createdBy: string;
  markedDoneBy?: string;
  bgColor?: string;
  textColor?: string;
}
