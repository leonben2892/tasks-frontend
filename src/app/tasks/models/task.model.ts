export interface Task {
  _id: string;
  userId: string;
  subject: string;
  description: string;
  importance: number;
  startDate: Date;
  image: string;
  isCompleted: boolean;
}

export function compareTasks(t1: Task, t2: Task) {
  const compareImportanceResult = t1.importance - t2.importance;
  if (compareImportanceResult > 0) {
    return -1;
  } else if (compareImportanceResult < 0) {
    return 1;
  } else {
    const compareDatesResult = new Date(t1.startDate).getTime() - new Date(t2.startDate).getTime();
    if (compareDatesResult > 0) {
      return 1;
    } else {
      return -1;
    }
  }
}
