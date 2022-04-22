import LZString from 'lz-string';
import app from '../utils/app';
import {
  GoalShow,
  ModelIndex,
  TaskShow,
  HistoryShow,
} from '../utils/interface';
import indexedDB from '../utils/indexedDB';

export default {
  namespace: 'index',
  state: {
    nowPage: 2,
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
          type: 'init',
        });
      } else {
        app.info('未成功打开数据库，请重新进入应用');
      }
    },
    *init({ payload }: any, { put, call, select }: any) {
      yield put({
        type: 'taskDeal',
      });
      yield put({
        type: 'goalDeal',
      });
      console.log('index/init');
    },
    *taskDeal({ payload }: any, { put, call, select }: any) {
      console.log('taskDeal', new Date());
      // 获取当天的零点时间, 以处理昨天的完成任务
      let nowTime = new Date(
        `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} 00:00:00`,
      ).getTime();
      // console.log('index init',new Date(nowTime),new Date(nowTime).getFullYear(), new Date(nowTime).getMonth(),new Date(nowTime).getDate(),)
      // 测试用，修改到第二天的零点，以便刷新测试
      // nowTime = nowTime + 24 * 60 * 60 * 1000;
      /*
      对已完成的任务进行归纳
      */
      //  获取完成任务列表
      let tasksFinish: Array<TaskShow> = yield indexedDB.getData(
        'Tasks',
        'endTimeId',
        undefined,
        1,
        nowTime,
      );
      if (tasksFinish === null) {
        tasksFinish = [];
      }
      for (let i = 0; i < tasksFinish.length; i++) {
        // 完成的任务列表
        // 完成任务的零点时间
        let dayTime = new Date(
          `${new Date(tasksFinish[i].endTimeId).getFullYear()}-${
            new Date(tasksFinish[i].endTimeId).getMonth() + 1
          }-${new Date(tasksFinish[i].endTimeId).getDate()} 00:00:00`,
        ).getTime();
        // let week = new Date(tasksFinish[i].endTimeId).getDay(); // 0-6, 0表示周天
        // if (week === 0) {
        //   week = 7;
        // }
        // let weekTime = dayTime - (week - 1) * 24 * 60 * 60 * 1000;
        // let monthTime = new Date(
        //   `${new Date(tasksFinish[i].endTimeId).getFullYear()}-${
        //     new Date(tasksFinish[i].endTimeId).getMonth() + 1
        //   }-1 00:00:00`,
        // ).getTime();
        // let yearTime = new Date(
        //   `${new Date(tasksFinish[i].endTimeId).getFullYear()}-1-1 00:00:00`,
        // ).getTime();

        /* 
        对当前任务的tag进行处理
        同时判断当前天是周一（处理weekTasks
        1号（处理monthTasks
        */

        for (let j = 0; j < tasksFinish[i].tags.length; j++) {
          // 该完成任务的目标列表
          let goalArr: Array<GoalShow> = yield indexedDB.getData(
            'Goals',
            'timeId',
            tasksFinish[i].tags[j].timeId,
          );
          let goal = goalArr[0];

          if (
            goal.dayTasks.length === 0 ||
            goal.dayTasks[goal.dayTasks.length - 1] < dayTime
          ) {
            // 当该数组不存在零点时间，或最后一个零点时间（最大的那个 小于当前任务的零点时间，就添加进去
            goal.dayTasks.push(dayTime);
          }
          /* if (
            goal.weekTasks.length === 0 ||
            goal.weekTasks[goal.weekTasks.length - 1] < weekTime
          ) {
            // 当该数组不存在零点时间，或最后一个零点时间（最大的那个 小于当前任务的零点时间，就添加进去
            goal.weekTasks.push(weekTime);
          }
          if (
            goal.monthTasks.length === 0 ||
            goal.monthTasks[goal.monthTasks.length - 1] < monthTime
          ) {
            // 当该数组不存在零点时间，或最后一个零点时间（最大的那个 小于当前任务的零点时间，就添加进去
            goal.monthTasks.push(monthTime);
          }
          */
          /*
          对记录任务完成数组进行删除整理
          方法1： 获取最早的时间，小于该时间的删除
          */
          // let yearIndex = 0;

          let minDateTime = nowTime - 30 * 24 * 60 * 60 * 1000;
          /* let weekNow = new Date(nowTime).getDay();
          if (weekNow === 0) {
            weekNow = 7;
          }
          let minWeekTime =
            nowTime -
            (weekNow - 1) * 24 * 60 * 60 * 1000 -
            24 * 7 * 24 * 60 * 60 * 1000;
          let minMonthTime = new Date(
            `${new Date().getFullYear() - 1}-${
              new Date().getMonth() + 1
            }-1 00:00:00`,
          ).getTime(); */

          //超过三十天
          /* if (
            goal.dayTasks[0] < minDateTime  ||
            goal.weekTasks[0] < minWeekTime ||
            goal.monthTasks[0] < minMonthTime 
          ) {
            if (goal.finishDescription.length === 0) {
              goal.finishDescription.push({
                year: yearTime,
                month: 0,
                week: 0,
                day: 0,
              });
            } else if (
              goal.finishDescription[goal.finishDescription.length - 1].year <
              yearTime
            ) {
              yearIndex = goal.finishDescription.length;
              goal.finishDescription.push({
                year: yearTime,
                month: 0,
                week: 0,
                day: 0,
              });
            } else {
              goal.finishDescription[goal.finishDescription.length - 1].year >= yearTime
              for (let k = goal.finishDescription.length - 1; k >= 0; k--) {
                if (goal.finishDescription[k].year === yearTime) {
                  yearIndex = k;
                  break;
                }
              }
            }
          } */
          /* while (goal.monthTasks[0] < minMonthTime) {
            goal.monthTasks.splice(0, 1);
            goal.finishDescription[yearIndex].month =
              goal.finishDescription[yearIndex].month + 1;
          }
          while (goal.weekTasks[0] < minWeekTime) {
            goal.weekTasks.splice(0, 1);
            goal.finishDescription[yearIndex].week =
              goal.finishDescription[yearIndex].week + 1;
          } */
          while (goal.dayTasks[0] < minDateTime) {
            goal.dayTasks.splice(0, 1);
            goal.moreday++;
          }

          // console.log(goal);

          const successG: boolean = yield indexedDB.put('Goals', goal);
        }

        // 将任务添加到history中
        let HistoriesArr: Array<HistoryShow> = yield indexedDB.getData(
          'Histories',
          'timeId',
          dayTime,
        );
        if (HistoriesArr === null) {
          HistoriesArr = [];
        }

        let historyIndex: number | null = 0;
        if (HistoriesArr.length === 0) {
          let addH: boolean = yield indexedDB.add('Histories', {
            timeId: dayTime,
            tasks: [],
            goals: [],
          });
          if (!addH) {
            historyIndex = null;
          }
        } else if (HistoriesArr[HistoriesArr.length - 1].timeId < dayTime) {
          historyIndex = HistoriesArr.length;
          let addH: boolean = yield indexedDB.add('Histories', {
            timeId: dayTime,
            tasks: [],
            goals: [],
          });
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
          let HistoriesArr: Array<HistoryShow> = yield indexedDB.getData(
            'Histories',
            'timeId',
            dayTime,
          );

          let addHistoryTask = true; //是否为历史记录添加任务 - 不重复则添加
          for (let j = 0; j < HistoriesArr[historyIndex].tasks.length; j++) {
            if (HistoriesArr[historyIndex].tasks[j] === tasksFinish[i].txt) {
              addHistoryTask = false;
              break;
            }
          }
          if (addHistoryTask) {
            HistoriesArr[historyIndex].tasks.push(tasksFinish[i].txt); //为历史记录添加任务
          }

          let addHistoryGoal = true; //是否为历史记录添加目标 - 不重复则添加
          for (let j = 0; j < tasksFinish[i].tags.length; j++) {
            for (let k = 0; k < HistoriesArr[historyIndex].goals.length; k++) {
              if (
                HistoriesArr[historyIndex].goals[k] ===
                tasksFinish[i].tags[j].title
              ) {
                addHistoryGoal = false;
                break;
              }
            }
            if (addHistoryGoal) {
              HistoriesArr[historyIndex].goals.push(
                tasksFinish[i].tags[j].title,
              );
            }
          }

          // console.log(HistoriesArr[historyIndex]);
          // 将新的history替换原本indexedDB中的history
          const successH: boolean = yield indexedDB.put(
            'Histories',
            HistoriesArr[historyIndex],
          );
        }

        // 根据任务的循环设定新建下一个任务
        let intervalNum = 0; //循环任务的间隔天数
        //判断按创建时间还是按完成时间循环
        const timeId = tasksFinish[i].intervalTimeType
          ? tasksFinish[i].timeId
          : tasksFinish[i].endTimeId;
        switch (tasksFinish[i].interval.type) {
          case 1:
            break;
          case 2:
            // 周
            let weekNew = new Date(timeId).getDay(); //0-6 0周天
            if (weekNew === 0) {
              weekNew = 7;
            }
            for (let j = 1; j <= 7; j++) {
              weekNew++;
              if (weekNew === 8) {
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
            break;
        }
        // console.log(intervalNum)
        if (intervalNum !== 0) {
          const removeTask: boolean = yield indexedDB.remove(
            'Tasks',
            tasksFinish[i].timeId,
          );
          if (removeTask) {
            let newTask: TaskShow = {
              timeId: timeId + intervalNum * 24 * 60 * 60 * 1000,
              endTimeId: 0,
              txt: tasksFinish[i].txt,
              tags: tasksFinish[i].tags,
              interval: tasksFinish[i].interval,
              intervalTimeType: tasksFinish[i].intervalTimeType,
            };

            const addTask: boolean = yield indexedDB.add('Tasks', newTask);
            if (addTask) {
              console.log('添加循环任务成功，删除已完成任务成功');
              yield put({
                type: 'task/init',
              });
              yield put({
                type: 'historyshow/init',
              });
              yield put({
                type: 'satisfy/init',
              });
            }
          } else {
            app.info('删除已完成任务失败，请刷新重试。');
          }
        } else {
          const removeTask: boolean = yield indexedDB.remove(
            'Tasks',
            tasksFinish[i].timeId,
          );
          if (removeTask) {
            console.log('删除已完成任务成功');
            yield put({
              type: 'task/init',
            });
            yield put({
              type: 'satisfy/init',
            });
          } else {
            app.info('删除已完成任务失败，请刷新重试。');
          }
        }
      }

      // 刷新
      yield put({
        type: 'historyshow/init',
      });
      yield put({
        type: 'task/init',
      });
      yield put({
        type: 'satisfy/init',
      });
    },
    *goalDeal({ payload }: any, { put, call, select }: any) {
      console.log('goalDeal', new Date());
      // 获取当天的零点时间, 以处理昨天的完成任务
      let nowTime = new Date(
        `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} 00:00:00`,
      ).getTime();
      // 对全体目标进行巡逻，将dayTask超出时限的部分删除加入moreday，获得完成目标
      let goalFinish: Array<GoalShow> = [];
      let minDateTime = nowTime - 30 * 24 * 60 * 60 * 1000;
      let goalarr: Array<GoalShow> = yield indexedDB.getData('Goals');
      if (goalarr === null) {
        return;
      }
      goalarr.forEach((goal: GoalShow) => {
        if (goal.dayTasks[0] < minDateTime) {
          while (goal.dayTasks[0] < minDateTime) {
            goal.dayTasks.splice(0, 1);
            goal.moreday++;
          }
          indexedDB.put('Goals', goal);
        }
        if (goal.endTimeId !== 0 && goal.endDone === false)
          goalFinish.push(goal);
      });

      /*
      对已完成的目标进行归纳
      */
      if (goalFinish.length === 0) return;
      let taskdata: Array<TaskShow> = yield indexedDB.getData(
        'Tasks',
        'endTimeId',
        0,
      );

      if (taskdata === null) {
        taskdata = [];
      }
      // 删除对应任务中的tag
      let newTasks: Array<TaskShow> = [];
      taskdata.forEach((task: TaskShow) => {
        for (let i = 0; i < task.tags.length; i++) {
          for (let j = 0; j < goalFinish.length; j++) {
            if (task.tags[i].timeId === Number(goalFinish[j].timeId)) {
              task.tags.splice(i, 1);
              break;
            }
          }
          newTasks.push(task);
        }
      });
      for (let i = 0; i < newTasks.length; i++) {
        let success: boolean = yield indexedDB.put('Tasks', newTasks[i]);
      }

      for (let i = 0; i < goalFinish.length; i++) {
        let dayTime = new Date(
          `${new Date(goalFinish[i].endTimeId).getFullYear()}-${
            new Date(goalFinish[i].endTimeId).getMonth() + 1
          }-${new Date(goalFinish[i].endTimeId).getDate()} 00:00:00`,
        ).getTime();

        /*
          对记录任务完成数组进行删除整理
          */
        /* goalFinish[i].dayTasks.forEach((day: number) => {
          let yearTime = new Date(
            `${new Date(day).getFullYear}-1-1 00:00:00`,
          ).getTime();
          if (goalFinish[i].finishDescription.length === 0) {
            goalFinish[i].finishDescription.push({
              year: yearTime,
              month: 0,
              week: 0,
              day: 0,
            });
          } else if (
            goalFinish[i].finishDescription[
              goalFinish[i].finishDescription.length - 1
            ].year < yearTime
          ) {
            yearIndex = goalFinish[i].finishDescription.length;
            goalFinish[i].finishDescription.push({
              year: yearTime,
              month: 0,
              week: 0,
              day: 0,
            });
          } else {
            // goal.finishDescription[goal.finishDescription.length - 1].year >= yearTime
            for (
              let k = goalFinish[i].finishDescription.length - 1;
              k >= 0;
              k--
            ) {
              if (goalFinish[i].finishDescription[k].year === yearTime) {
                yearIndex = k;
                break;
              }
            }
          }

          goalFinish[i].finishDescription[yearIndex].day =
            goalFinish[i].finishDescription[yearIndex].day + 1;
        }); */
        goalFinish[i].moreday =
          goalFinish[i].moreday + goalFinish[i].dayTasks.length;
        goalFinish[i].dayTasks = [];

        /*  goalFinish[i].weekTasks.forEach((week: number) => {
          let yearTime = new Date(
            `${new Date(week).getFullYear}-1-1 00:00:00`,
          ).getTime();
          let yearIndex = 0;
          if (goalFinish[i].finishDescription.length === 0) {
            goalFinish[i].finishDescription.push({
              year: yearTime,
              month: 0,
              week: 0,
              day: 0,
            });
          } else if (
            goalFinish[i].finishDescription[
              goalFinish[i].finishDescription.length - 1
            ].year < yearTime
          ) {
            yearIndex = goalFinish[i].finishDescription.length;
            goalFinish[i].finishDescription.push({
              year: yearTime,
              month: 0,
              week: 0,
              day: 0,
            });
          } else {
            // goal.finishDescription[goal.finishDescription.length - 1].year >= yearTime
            for (
              let k = goalFinish[i].finishDescription.length - 1;
              k >= 0;
              k--
            ) {
              if (goalFinish[i].finishDescription[k].year === yearTime) {
                yearIndex = k;
                break;
              }
            }
          }

          goalFinish[i].finishDescription[yearIndex].week =
            goalFinish[i].finishDescription[yearIndex].week + 1;
        });
        goalFinish[i].weekTasks = [];

        goalFinish[i].monthTasks.forEach((month: number) => {
          let yearTime = new Date(
            `${new Date(month).getFullYear}-1-1 00:00:00`,
          ).getTime();
          let yearIndex = 0;
          if (goalFinish[i].finishDescription.length === 0) {
            goalFinish[i].finishDescription.push({
              year: yearTime,
              month: 0,
              week: 0,
              day: 0,
            });
          } else if (
            goalFinish[i].finishDescription[
              goalFinish[i].finishDescription.length - 1
            ].year < yearTime
          ) {
            yearIndex = goalFinish[i].finishDescription.length;
            goalFinish[i].finishDescription.push({
              year: yearTime,
              month: 0,
              week: 0,
              day: 0,
            });
          } else {
            // goal.finishDescription[goal.finishDescription.length - 1].year >= yearTime
            for (
              let k = goalFinish[i].finishDescription.length - 1;
              k >= 0;
              k--
            ) {
              if (goalFinish[i].finishDescription[k].year === yearTime) {
                yearIndex = k;
                break;
              }
            }
          }

          goalFinish[i].finishDescription[yearIndex].month =
            goalFinish[i].finishDescription[yearIndex].month + 1;
        });
        goalFinish[i].monthTasks = [];
 */
        goalFinish[i].endDone = true;
        const successG: boolean = yield indexedDB.put('Goals', goalFinish[i]);

        // 将记录添加到history中
        let HistoriesArr: Array<HistoryShow> = yield indexedDB.getData(
          'Histories',
          'timeId',
          dayTime,
        );
        if (HistoriesArr === null) {
          HistoriesArr = [];
        }

        let historyIndex: number | null = 0;
        if (HistoriesArr.length === 0) {
          let addH: boolean = yield indexedDB.add('Histories', {
            timeId: dayTime,
            tasks: [],
            goals: [],
          });
          if (!addH) {
            historyIndex = null;
          }
        } else if (HistoriesArr[HistoriesArr.length - 1].timeId < dayTime) {
          historyIndex = HistoriesArr.length;
          let addH: boolean = yield indexedDB.add('Histories', {
            timeId: dayTime,
            tasks: [],
            goals: [],
          });
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
          let HistoriesArr: Array<HistoryShow> = yield indexedDB.getData(
            'Histories',
            'timeId',
            dayTime,
          );
          let addHistoryGoal = true; //是否为历史记录添加目标 - 不重复则添加
          for (let k = 0; k < HistoriesArr[historyIndex].goals.length; k++) {
            if (HistoriesArr[historyIndex].goals[k] === goalFinish[i].title) {
              addHistoryGoal = false;
              break;
            }
          }
          if (addHistoryGoal) {
            HistoriesArr[historyIndex].goals.push(goalFinish[i].title);
          }

          // console.log(HistoriesArr[historyIndex]);
          // 将新的history替换原本indexedDB中的history
          const successH: boolean = yield indexedDB.put(
            'Histories',
            HistoriesArr[historyIndex],
          );
        }
      }

      // 刷新
      yield put({
        type: 'historyshow/init',
      });
      yield put({
        type: 'task/init',
      });
      yield put({
        type: 'satisfy/init',
      });
    },
  },
};
