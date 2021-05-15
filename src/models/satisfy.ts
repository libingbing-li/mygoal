import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelSatisfy, GoalShow } from '../utils/interface';

export default {
  namespace: 'satisfy',
  state: {
    goaldata: [],
    minTime: 0,
    maxTime: 0,
    taskSatisfy: [],
  },
  reducers: {
    changeState(state: ModelSatisfy, { payload }: any) {
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
      const state: ModelSatisfy = yield select((state: any) => state.satisfy);
      let dbName = 'Goals';
      let goaldata: Array<GoalShow> = [];
      let minTime = state.minTime;
      let maxTime = state.maxTime;
      let taskSatisfy: Array<boolean> = [];
      // 获取所有目标
      goaldata = yield indexedDB.getData(dbName, 'timeId', undefined, minTime, maxTime);
      if(goaldata === null) {
        goaldata = [];
      }
      /*
      直接进入：显示当月日记
      选择日期：根据payload时间区间显示
      从日记详情退回：之前是哪个月就是哪个月
      */
      if(payload === undefined) {
        if(minTime === 0 || maxTime === 0) {
          // 直接进入
          // else 从详情返回，可直接使用state的数据
          if(new Date().getMonth() === 11) {
            // 选中12月
            minTime = new Date(`${new Date().getFullYear()}-12`).getTime();
            maxTime = new Date(`${new Date().getFullYear() + 1}-1`).getTime();
          } else {
            minTime = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`).getTime();
            maxTime = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 2}`).getTime();
          }
        } 
      } else {
        //选中了日期
        minTime = payload.minTime;
        maxTime = payload.maxTime;
      }
      /*
      根据获得的goals获取taskSatisfy
      */
      // taskSatisfy
      console.log('获取目标数据：', goaldata, taskSatisfy)
      yield put({
        type: 'changeState',
        payload: {
          goaldata,
          minTime,
          maxTime,
          taskSatisfy,
        }
      });
    },
  }
};