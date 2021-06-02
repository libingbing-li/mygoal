import LZString from 'lz-string';
import app from '../utils/app';
import { GoalShow, ModelIndex, TaskShow, HistoryShow } from '../utils/interface';
import indexedDB from '../utils/indexedDB';


export default {
  namespace: 'index',
  state: {

  },
  reducers: {
    changeState(state: ModelIndex, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *openDB({ payload }: any, { put, call, select }: any) {
      const success: boolean = yield indexedDB.openDataBase();
      if (success) {
        yield put({
          type: 'init'
        });
      }
    },
    *init({ payload }: any, { put, call, select }: any) {
      // 获取当天的零点时间
      let nowTime = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`).getTime();
      // 测试用，修改到第二天的零点，以便刷新测试
      // nowTime = nowTime + 24 * 60 * 60 * 1000;
      /*
      对已完成的任务进行归纳
      */
      console.log('index/init')
      //  获取完成任务列表
      let tasksFinish: Array<TaskShow> = yield indexedDB.getData('Tasks', 'endTimeId', undefined, 1, nowTime);
      if (tasksFinish === null) {
        tasksFinish = [];
      }
      for (let i = 0; i < tasksFinish.length; i++) {
        // 完成的任务列表
        // 完成任务的零点时间
        let dayTime = new Date(`${new Date(tasksFinish[i].endTimeId).getFullYear()}-${new Date(tasksFinish[i].endTimeId).getMonth() + 1}-${new Date(tasksFinish[i].endTimeId).getDate()}`).getTime();
        let week = new Date(tasksFinish[i].endTimeId).getDay();// 0-6, 0表示周天
        if(week === 0) {week = 7;}
        let weekTime = dayTime - (week - 1) * 24 * 60 * 60 * 1000;
        let monthTime = new Date(`${new Date(tasksFinish[i].endTimeId).getFullYear()}-${new Date(tasksFinish[i].endTimeId).getMonth() + 1}-1`).getTime();
        let yearTime = new Date(`${new Date(tasksFinish[i].endTimeId).getFullYear()}-1-1`).getTime();

        /* 
        对当前任务的tag进行处理
        同时判断当前天是周一（处理weekTasks
        1号（处理monthTasks
        */ 

        for (let j = 0; j < tasksFinish[i].tags.length; j++) {
          // 该完成任务的目标列表
          let goalArr: Array<GoalShow> = yield indexedDB.getData('Goals', 'timeId', tasksFinish[i].tags[j].timeId);
          let goal = goalArr[0];
          // 对记录任务完成数组进行删除整理
          let yearIndex = 0;
          if (goal.dayTasks.length > 30 || goal.weekTasks.length > 24 || goal.monthTasks.length > 12) {
            if (goal.finishDescription.length === 0) {
              goal.finishDescription.push({
                year: yearTime,
                month: 0,
                week: 0,
                day: 0,
              });
            } else if (goal.finishDescription[goal.finishDescription.length - 1].year < dayTime) {
              yearIndex = goal.finishDescription.length;
              goal.finishDescription.push({
                year: yearTime,
                month: 0,
                week: 0,
                day: 0,
              });
            } else {
              // goal.finishDescription[goal.finishDescription.length - 1].year >= yearTime
              for (let k = goal.finishDescription.length - 1; k >= 0; k--) {
                if (goal.finishDescription[k].year === yearTime) {
                  yearIndex = k;
                  break;
                }
              }
            }
          }
          if (goal.monthTasks.length > 12) {
            goal.monthTasks.splice(0, goal.monthTasks.length - 12);
            goal.finishDescription[yearIndex].month = goal.finishDescription[yearIndex].month + (goal.monthTasks.length - 12);
          }
          if (goal.weekTasks.length > 24) {
            goal.weekTasks.splice(0, goal.weekTasks.length - 24);
            goal.finishDescription[yearIndex].week = goal.finishDescription[yearIndex].week + (goal.weekTasks.length - 24);
          }
          if (goal.dayTasks.length > 30) {
            goal.dayTasks.splice(0, goal.dayTasks.length - 30);
            goal.finishDescription[yearIndex].day = goal.finishDescription[yearIndex].day + (goal.dayTasks.length - 30);
          }

          // 判断周一和一号,如果是，查看上周/上月是否存在数据，不存在则添加0
          let weekOne = new Date(nowTime).getDay();
          let monthOne = new Date(nowTime).getDate();
          console.log(weekOne);
          console.log(monthOne);
          const lastDayTime = dayTime - 24 * 60 * 60 * 1000;
          const lastWeekTime = weekTime - 7 * 24 * 60 * 60 * 1000;
          const lastMonthTime = new Date(`${new Date(tasksFinish[i].endTimeId).getFullYear()}-${new Date(tasksFinish[i].endTimeId).getMonth()}-1`).getTime();

          if(weekOne === 1 && goal.weekTasks[goal.weekTasks.length - 1] < lastWeekTime) {
            goal.weekTasks.push(0);
          } 
          if(monthOne === 1 && goal.monthTasks[goal.monthTasks.length - 1] < lastMonthTime) {
            goal.monthTasks.push(0);
          } 
          if(goal.dayTasks[goal.dayTasks.length - 1] < lastDayTime) {
            goal.monthTasks.push(0);
          } 


          // 对记录任务完成数组进行添加
          if (goal.dayTasks.length === 0 || goal.dayTasks[goal.dayTasks.length - 1] < dayTime) {
            // 当该数组不存在零点时间，或最后一个零点时间（最大的那个 小于当前任务的零点时间，就添加进去
            goal.dayTasks.push(dayTime);
          }
          if (goal.weekTasks.length === 0 || goal.weekTasks[goal.weekTasks.length - 1] < weekTime) {
            // 当该数组不存在零点时间，或最后一个零点时间（最大的那个 小于当前任务的零点时间，就添加进去
            goal.weekTasks.push(weekTime);
          }
          if (goal.monthTasks.length === 0 || goal.monthTasks[goal.monthTasks.length - 1] < monthTime) {
            // 当该数组不存在零点时间，或最后一个零点时间（最大的那个 小于当前任务的零点时间，就添加进去
            goal.monthTasks.push(monthTime);
          }

          // 将新的goal替换原本indexedDB中的goal
          const successG: boolean = yield indexedDB.put('Goals', goal);
          console.log('index-init：刷新目标数据 - ' + successG);
        }

        // 将任务添加到history中
        let HistoriesArr: Array<HistoryShow> = yield indexedDB.getData('Histories', 'timeId', dayTime);
        if (HistoriesArr === null) {
          HistoriesArr = [];
        }

        let historyIndex: number | null = 0;
        if (HistoriesArr.length === 0) {
          let addH: boolean = yield indexedDB.add('Histories', {
            timeId: dayTime,
            tasks: [],
            goals: [],
          })
          if (!addH) {
            historyIndex = null;
          }
        } else if (HistoriesArr[HistoriesArr.length - 1].timeId < dayTime) {
          historyIndex = HistoriesArr.length;
          let addH: boolean = yield indexedDB.add('Histories', {
            timeId: dayTime,
            tasks: [],
            goals: [],
          })
          if (!addH) {
            historyIndex = null;
          }
        } else {
          // goal.finishDescription[goal.finishDescription.length - 1].year >= yearTime
          for (let k = HistoriesArr.length - 1; k >= 0; k--) {
            if (HistoriesArr[k].timeId === dayTime) {
              historyIndex = k;
              break;
            }
          }
        }

        if (historyIndex !== null) {
          let HistoriesArr: Array<HistoryShow> = yield indexedDB.getData('Histories', 'timeId', dayTime);
          HistoriesArr[historyIndex].tasks.push(tasksFinish[i].txt); //为历史记录添加任务

          let addHistoryGoal = true; //是否为历史记录添加目标 - 不重复则添加
          for (let j = 0; j < tasksFinish[i].tags.length; j++) {
            for (let k = 0; k < HistoriesArr[historyIndex].goals.length; k++) {
              if (HistoriesArr[historyIndex].goals[k] === tasksFinish[i].tags[j].title) {
                addHistoryGoal = false;
                break;
              }
            }
            if (addHistoryGoal) {
              HistoriesArr[historyIndex].goals.push(tasksFinish[i].tags[j].title);
            }
          }

          console.log(HistoriesArr[historyIndex]);
          // 将新的history替换原本indexedDB中的history
          const successH: boolean = yield indexedDB.put('Histories', HistoriesArr[historyIndex]);
          console.log('index-init：刷新历史数据 - ' + successH);
        }

        // 根据任务的循环设定新建下一个任务           
        let intervalNum = 0;
        switch (tasksFinish[i].interval.type) {
          case 1: break;
          case 2:
            // 周
            let weekNew = new Date(tasksFinish[i].timeId).getDay(); //0-6 0周天
            console.log(weekNew, 'weekNew');
            if(weekNew === 0) {weekNew = 7;}
            for (let j = 1; j <= 7; j++) {
              weekNew++;
              if(weekNew === 8) {
                weekNew = 1;
              }
              if (Number(tasksFinish[i].interval.num[weekNew]) !== 0) {
                intervalNum = j;
                break;
              }
            }
            break;
          case 3:
            // 间隔
            intervalNum = Number(tasksFinish[i].interval.num[0]) + 1;
            console.log(intervalNum)
            break;
        }
        console.log(intervalNum)
        if (intervalNum !== 0) {
          const removeTask: boolean = yield indexedDB.remove('Tasks', tasksFinish[i].timeId);
          if (removeTask) {
            let newTask = tasksFinish[i];
            newTask.timeId = tasksFinish[i].timeId + intervalNum * 24 * 60 * 60 * 1000;
            newTask.endTimeId = 0;
            const addTask: boolean = yield indexedDB.add('Tasks', newTask);
            if (addTask) {


              console.log('添加循环任务成功，删除已完成任务成功');
              yield put({
                type: 'task/init',
              })
              // yield put({
              //   type: 'history/init',
              // })
              yield put({
                type: 'satisfy/init',
              })

            }
          }
        } else {
          const removeTask: boolean = yield indexedDB.remove('Tasks', tasksFinish[i].timeId);
          if (removeTask) {
            console.log('删除已完成任务成功');
            yield put({
              type: 'task/init',
            })
            // yield put({
            //   type: 'history/init',
            // })
            yield put({
              type: 'satisfy/init',
            })
          }
        }
      }
    },
  }
};