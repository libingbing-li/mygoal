import { weekdays } from 'moment';
import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import {
  ModelEditTask,
  TaskShow,
  GoalShow,
  PrefixShow,
} from '../utils/interface';

export default {
  namespace: 'editTask',
  state: {
    timeId: 0,
    txt: '',
    interval: { type: 1, num: 0 },
    intervalTimeType: true,
    data: null,
    goaldata: [],
    isPrefix: false,
    dataP: null,
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
      //任务空返回
      if (state.txt === '') {
        app.info('请输入任务内容');
        return;
      }

      //判断是否是前缀 是保存至localStorage
      if (state.isPrefix) {
        let prefixArr: Array<PrefixShow> = JSON.parse(
          localStorage.getItem('prefix') || '[]',
        );
        const dataP: PrefixShow = {
          timeId: new Date().getTime(),
          endTimeId: 0,
          prefix: state.txt,
          tags: payload.tags,
        };
        prefixArr.push(dataP);
        localStorage.setItem('prefix', JSON.stringify(prefixArr));
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            txt: '',
            interval: { type: 1, num: 0 },
            data: null,
            intervalTimeType: true,
            isPrefix: false,
          },
        });
        payload.goBack();
        yield put({
          type: 'task/init',
        });
        return;
      }

      //设定循环间隔周不设定日期，默认为不循环
      let interval = state.interval;
      if (interval.type === 2) {
        let change = true;
        for (let i = 0; i < interval.num.length; i++) {
          if (interval.num[i] !== 0) {
            change = false;
            break;
          }
        }
        if (change) {
          interval = { type: 1, num: [0] };
        }
      }

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
          interval: interval,
          intervalTimeType: state.intervalTimeType,
        };
        success = yield indexedDB.put(dbName, data);
      } else {
        console.log('进入添加');
        // 添加
        let timeId = new Date().getTime();
        if (interval.type === 2) {
          let week = new Date().getDay(); //0-6 0是周天
          if (week === 0) {
            week = 7;
          }
          if (interval.num[week] !== week) {
            // 不是当前天 eg： 在周一建立的任务，并没有设置周一循环，那么就更改timeId到对应周数
            for (let i = 1; i < 7; i++) {
              week++;
              if (week === 8) {
                week = 1;
              }
              if (state.interval.num[week] !== 0) {
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
          interval: interval,
          intervalTimeType: state.intervalTimeType,
        };
        success = yield indexedDB.add(dbName, data);
      }
      if (success) {
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            txt: '',
            interval: { type: 1, num: 0 },
            data: null,
            intervalTimeType: true,
            isPrefix: false,
          },
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
      const dataArr: Array<TaskShow> = yield indexedDB.getData(
        dbName,
        'timeId',
        Number(payload.timeId),
      );
      let data = dataArr[0];
      let goaldata: Array<GoalShow> = yield indexedDB.getData(
        'Goals',
        'endTimeId',
        0,
      );
      goaldata = goaldata || [];
      if (data) {
        data.tags.forEach((tag: GoalShow) => {
          for (let i = 0; i < goaldata.length; i++) {
            if (goaldata[i].timeId === tag.timeId) {
              goaldata.splice(i, 1);
              break;
            }
          }
        });
      }
      yield put({
        type: 'changeState',
        payload: {
          timeId: payload.timeId,
          txt: data.txt,
          interval: data.interval,
          data,
          goaldata,
          intervalTimeType: data.intervalTimeType,
        },
      });
    },
    *remove({ payload }: any, { put, call, select }: any) {
      /* 
      put: 触发action yield put({ type: 'todos/add', payload: 'Learn Dva'});
      call: 调用异步逻辑, 支持Promise const result = yield call(fetch, '/todos');
      select: 从state中获取数据,属性名是命名空间的名字 const todos = yield select(state => state.todos);
      */
      let state: ModelEditTask = yield select((state: any) => state.editTask);
      // 选择库名
      let dbName = 'Tasks';
      const success: boolean = yield indexedDB.remove(
        dbName,
        Number(state.timeId),
      );
      // console.log(success, state.timeId);
      if (success) {
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            txt: '',
            tags: [],
            interval: { type: 1, num: 0 },
            data: null,
          },
        });
        payload.goBack();
        yield put({
          type: 'task/init',
        });
      } else {
        app.info('删除失败');
      }
    },
    *init({ payload }: any, { put, call, select }: any) {
      let dbName = 'Goals';
      let goaldata: Array<GoalShow> = yield indexedDB.getData(
        dbName,
        'endTimeId',
        0,
      );
      yield put({
        type: 'changeState',
        payload: {
          goaldata,
        },
      });
    },
    // prefix
    *getPrefix({ payload }: any, { put, call, select }: any) {
      const state: ModelEditTask = yield select((state: any) => state.editTask);
      const prefixData = JSON.parse(localStorage.getItem('prefix') || '[]');
      const dataP = prefixData.find((prefix: PrefixShow) => {
        return prefix.timeId == payload.timeId;
      });
      let goaldata: Array<GoalShow> = yield indexedDB.getData(
        'Goals',
        'endTimeId',
        0,
      );
      goaldata = goaldata || [];
      if (dataP) {
        dataP.tags.forEach((tag: GoalShow) => {
          for (let i = 0; i < goaldata.length; i++) {
            if (goaldata[i].timeId === tag.timeId) {
              goaldata.splice(i, 1);
              break;
            }
          }
        });
      }
      if (dataP) {
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            txt: dataP.prefix,
            dataP,
            isPrefix: true,
            goaldata,
          },
        });
      }
    },
    *editPrefix({ payload }: any, { put, call, select }: any) {},
  },
};
