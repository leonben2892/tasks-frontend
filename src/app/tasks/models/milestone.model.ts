export interface Milestone {
  _id: string;
  date: Date;
  taskId: string;
  description: string;
}

export function compareMilestones(m1: Milestone, m2: Milestone) {
  const compareDatesResult = new Date(m1.date).getTime() - new Date(m2.date).getTime();
  if (compareDatesResult >= 0) {
    return 1;
  } else {
    return -1;
  }
}
