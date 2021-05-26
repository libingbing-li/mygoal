import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelTask, TaskShow } from '../utils/interface';


export default {
  namespace: 'task',
  state: {
    taskdata: [],
  },
  reducers: {
    changeState(state: ModelTask, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *openDB({ payload }: any, { put, call, select }: any) {
      const success: boolean = yield indexedDB.openDataBase();
      if(success) {
        yield put({
          type: 'init'
        });
      }
    },
    *init({ payload }: any, { put, call, select }: any) {
      const state: ModelTask = yield select((state: any) => state.task);
      let dbName = 'Tasks';
      let taskdata: Array<TaskShow> = yield indexedDB.getData(dbName, 'timeId');
      yield put({
        type: 'changeState',
        payload: {
          taskdata: taskdata ? taskdata : [],
        }
      });
    },
    *checkTask({ payload }: any, { put, call, select }: any) {
      const state: ModelTask = yield select((state: any) => state.task);
      let task = payload.task;
      if(task.endTimeId === 0) {
        task.endTimeId = new Date().getTime();
      } else {
        task.endTimeId = 0;
      }
      let dbName = 'Tasks';
      let success: boolean = yield indexedDB.put(dbName, task);
      if(success) {
        yield put({
          type: 'init'
        })
      }
    },
  }
};