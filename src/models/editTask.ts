import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelEditTask, TaskShow, GoalShow } from '../utils/interface';

export default {
  namespace: 'editTask',
  state: {
    timeId: 0,
    txt: '',
    tags: [],
    interval:{type: 1, num: 0},
    data: null,
    goaldata: [],
  },
  reducers: {
    changeState(state: ModelEditTask, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *save({ payload }: any, { put, call, select }: any) {
      /* 
      put: 触发action yield put({ type: 'todos/add', payload: 'Learn Dva'});
      call: 调用异步逻辑, 支持Promise const result = yield call(fetch, '/todos');
      select: 从state中获取数据,属性名是命名空间的名字 const todos = yield select(state => state.todos);
      */
      const state: ModelEditTask = yield select((state: any) => state.editTask);
      let dbName = 'Tasks';
      let success: boolean = false;
      if (state.timeId) {
        console.log('进入编辑');
        // 编辑
        let data: TaskShow = {
          timeId: state.timeId,
          endTimeId: state.data.endTimeId,
          txt: state.txt,
          tags: state.tags,
          interval:state.interval,
        };
        success = yield indexedDB.put(dbName, data);
      } else {
        console.log('进入添加');
        // 添加
        let data: TaskShow = {
          timeId: new Date().getTime(),
          endTimeId: 0,
          txt: state.txt,
          tags: state.tags,
          interval:state.interval,
        };
        success = yield indexedDB.add(dbName, data);
      }
      if (success) {
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            txt: '',
            tags: [],
						data: null,
          }
        });
        payload.goBack();
        yield put({
          type: 'task/init',
        });
      } else {
        app.info('保存失败');
      }
    },
    *getData({ payload }: any, { put, call, select }: any) {
      const state: ModelEditTask = yield select((state: any) => state.editTask);
      let dbName = 'Tasks';
      const data: TaskShow = yield indexedDB.getData(dbName, 'timeId', Number(payload.timeId));
      yield put({
        type: 'changeState',
        payload: {
          timeId: payload.timeId,
          txt: data.txt,
          tags: data.tags,
          interval: data.interval,
          data,
        },
      })
    },
    *remove({ payload }: any, {put, call, select}: any) {
      /* 
      put: 触发action yield put({ type: 'todos/add', payload: 'Learn Dva'});
      call: 调用异步逻辑, 支持Promise const result = yield call(fetch, '/todos');
      select: 从state中获取数据,属性名是命名空间的名字 const todos = yield select(state => state.todos);
      */
      let state: ModelEditTask = yield select((state: any) => state.editTask);
      // 选择库名
      let dbName = 'Tasks';
      const success: boolean = yield indexedDB.remove(dbName, Number(state.timeId));
      if (success) {
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            txt: '',
            tags: [],
						data: null,
          }
        });
        payload.goBack();
        yield put({
          type: 'task/init',
        });
      } else {
        app.info('删除失败');
      }
    },
    *init({ payload }: any, {put, call, select}: any) {
      let dbName = 'Goals';
      let goaldata: Array<GoalShow> = yield indexedDB.getData(dbName, 'timeId');
      yield put({
        type: 'changeState',
        payload: {
          goaldata,
        }
      });
    },
  }
};