import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelEditTask, TaskShow, GoalShow } from '../utils/interface';

export default {
  namespace: 'editTask',
  state: {
    timeId: 0,
    txt: '',
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
          timeId: Number(state.timeId),
          endTimeId: state.data.endTimeId,
          txt: state.txt,
          tags: payload.tags,
          interval:state.interval,
        };
        success = yield indexedDB.put(dbName, data);
      } else {
        console.log('进入添加');
        // 添加
        let timeId = new Date().getTime();
        if(state.interval.type === 2) {
          let week = new Date().getDay(); //0-6 0是周天
          if(week === 0) {week = 7;}
          if(state.interval.num[week] !== week) {
            // 不是当前天 eg： 在周一建立的任务，并没有设置周一循环，那么就更改timeId到对应周数
            for(let i = 1; i < 7; i++) {
              week++;
              if(week === 8) {
                week = 1;
              }
              if(state.interval.num[week] !== 0) {
                timeId = timeId + i * 24 * 60 * 60 * 1000;
                break;
              }
            }
          }
        }
        let data: TaskShow = {
          timeId: timeId,
          endTimeId: 0,
          txt: state.txt,
          tags: payload.tags,
          interval: state.interval,
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
      const dataArr: Array<TaskShow> = yield indexedDB.getData(dbName, 'timeId', Number(payload.timeId));
      let data = dataArr[0];
      yield put({
        type: 'changeState',
        payload: {
          timeId: payload.timeId,
          txt: data.txt,
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
      console.log(success,state.timeId)
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