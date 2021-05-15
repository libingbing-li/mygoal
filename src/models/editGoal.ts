import dataBox from '@/pages/modal/dataBox';
import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelEditGoal, GoalShow } from '../utils/interface';

export default {
  namespace: 'editGoal',
  state: {
    timeId: 0,
    title: '',
    description: '',
    data: null,
  },
  reducers: {
    changeState(state: ModelEditGoal, { payload }: any) {
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
      const state: ModelEditGoal = yield select((state: any) => state.editGoal);
      let dbName = 'Goals';
      let success: boolean = false;
      if (state.timeId) {
        console.log('进入编辑');
        // 编辑
        let data: GoalShow = {
          timeId: state.timeId,
          endTimeId: state.data.endTimeId,
          title: state.title,
          description: state.description,
          finishDescription: state.data.finishDescription,
          dayTasks: state.data.dayTasks,
          weekTasks: state.data.weekTasks,
          monthTasks: state.data.monthTasks,
        };
        success = yield indexedDB.put(dbName, data);
      } else {
        console.log('进入添加');
        // 添加
        let data: GoalShow = {
          timeId: new Date().getTime(),
          endTimeId: 0,
          title: state.title,
          description: state.description,
          finishDescription: '',
          dayTasks: [],
          weekTasks: [],
          monthTasks: [],
        };
        success = yield indexedDB.add(dbName, data);
      }
      if (success) {
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            title: '',
            description: '',
            data: null,
          }
        });
        payload.goBack();
        yield put({
          type: 'satisfy/init',
        });
      } else {
        app.info('保存失败');
      }
    },
    *getData({ payload }: any, { put, call, select }: any) {
      const state: ModelEditGoal = yield select((state: any) => state.editGoal);
      let dbName = 'Goals';
      const data: GoalShow = yield indexedDB.getData(dbName, 'timeId', Number(payload.timeId));
      yield put({
        type: 'changeState',
        payload: {
          timeId: payload.timeId,
          title: data.title,
          description: data.description,
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
      let state: ModelEditGoal = yield select((state: any) => state.editGoal);
      // 选择库名
      let dbName = 'Goals';
      const success: boolean = yield indexedDB.remove(dbName, Number(state.timeId));
      if (success) {
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            title: '',
            description: '',
            data: null,
          }
        });
        payload.goBack();
        yield put({
          type: 'satisfy/init',
        });
      } else {
        app.info('删除失败');
      }
    },
  }
};