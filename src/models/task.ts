import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelTask, TaskShow } from '../utils/interface';

export default {
  namespace: 'task',
  state: {
    scrollTop: 0,
    taskdata: [],
    nextTaskData: [],
  },
  reducers: {
    changeState(state: ModelTask, { payload }: any) {
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
      }
    },
    *init({ payload }: any, { put, call, select }: any) {
      const state: ModelTask = yield select((state: any) => state.task);
      let dbName = 'Tasks';
      // 获取前缀
      const prefixArr = JSON.parse(localStorage.getItem('prefix') || '[]');
      console.log(prefixArr);
      // 获取显示任务
      let nextTime =
        new Date(
          `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} 00:00:00`,
        ).getTime() +
        24 * 60 * 60 * 1000;
      let taskdata: Array<TaskShow> = yield indexedDB.getData(
        dbName,
        'timeId',
        undefined,
        1,
        nextTime,
      );
      let allTaskdata: Array<TaskShow> = yield indexedDB.getData(
        dbName,
        'timeId',
      );
      let nextTaskData: Array<TaskShow> = [];
      if (allTaskdata) {
        if (taskdata) {
          for (let i = taskdata.length; i < allTaskdata.length; i++) {
            nextTaskData.push(allTaskdata[i]);
          }
        } else {
          for (let i = 0; i < allTaskdata.length; i++) {
            nextTaskData.push(allTaskdata[i]);
          }
        }
      }
      yield put({
        type: 'changeState',
        payload: {
          taskdata: taskdata ? taskdata : [],
          nextTaskData,
        },
      });
    },
    *checkTask({ payload }: any, { put, call, select }: any) {
      const state: ModelTask = yield select((state: any) => state.task);
      let task = payload.task;
      if (task.endTimeId === 0) {
        task.endTimeId = new Date().getTime();
      } else {
        task.endTimeId = 0;
      }
      let dbName = 'Tasks';
      let success: boolean = yield indexedDB.put(dbName, task);
      if (success) {
        yield put({
          type: 'init',
        });
      }
    },
  },
};
