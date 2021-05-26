// 任务
export interface TaskShow {
  timeId: number;
  endTimeId: number;
  txt: string;
  tags: Array<GoalShow>;
  interval: {type: number; num: Array<number>;},
}
// 目标
export interface GoalShow {
  timeId: number;
  endTimeId: number;
  title: string;
  description: string;
  finishDescription: Array<{
    year: number,
    month: number,
    week: number,
    day: number,
  }>; //tasks数组最多记录的数据，一年前的tasks数组数据删除并将删除数据以文本形式记录到该字段 例：2020，【xx目标】已完成360天，48周，12月，最多连续30天，4周，2月。
  dayTasks: Array<number>; //记录完成任务的完成时间(零点时间，日，如果当天未完成记录为0，记录到最新一天，默认0，当有任务完成后更新为任务的完成时间，多个任务只记录第一个
  weekTasks: Array<number>; //记录完成任务的完成时间，周，根据所在周是否有记录，记录最早的完成时间，检索时以周最后一天倒序检索
  monthTasks: Array<number>; //记录完成任务的完成时间，月，同周，
}
// 历史记录
export interface HistoryShow {
  timeId: number;
  tasks: Array<string>;
  goals: Array<string>;
}


// model
export interface ModelIndex {
}
export interface ModelSatisfy {
  goaldata: Array<GoalShow>;
  minTime: number,
  maxTime: number,
  taskSatisfy: Array<boolean>;
}
export interface ModelEditGoal {
  timeId: number;
  title: string;
  description: string;
  data: GoalShow;
}
export interface ModelEditTask {
  timeId: number;
  txt: string;
  data: TaskShow;
  interval: {type: number; num: Array<number>;}; //num: [0,1,2,3,4,5,6,7] 表每天都选中，第一个0为占位，没有任何功能
  goaldata: Array<GoalShow>;
}



export interface ModelHistoryShow {
  historydata: Array<HistoryShow>;
}
export interface ModelTask {
  taskdata: Array<TaskShow>;
}
export interface ModelSetting {
  dataTxt: string;
}

// 全部数据格式
export interface AllData {
  
}


