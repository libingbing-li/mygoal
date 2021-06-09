import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelSatisfy, GoalShow } from '../utils/interface';

export default {
  namespace: 'satisfy',
  state: {
    goaldata: [],
    minTime: 0,
    maxTime: 0,
    timeArray: [[], [], []],
  },
  reducers: {
    changeState(state: ModelSatisfy, { payload }: any) {
      return { ...state, ...payload };
    },
    getTimeArray(state: ModelSatisfy, { payload }: any) {
      // day: 30 week: 24 month: 30 倒序展示
      // 当天零点时间
      let nowTime = new Date(
        `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
      ).getTime();

      // 天
      let dayTime = nowTime - 24 * 60 * 60 * 1000;
      let dayArr: Array<number> = [];
      for (let i = 1; i <= 30; i++) {
        dayArr.push(dayTime);
        dayTime = dayTime - 24 * 60 * 60 * 1000;
      }

      // 周
      let week = new Date().getDay(); // 0-6, 0表示周天
      if (week === 0) {
        week = 7;
      }
      let weekTime = nowTime - (week - 1) * 24 * 60 * 60 * 1000;
      let weekArr: Array<number> = [];
      for (let i = 24; i >= 1; i--) {
        weekArr.push(weekTime);
        weekTime = weekTime - 7 * 24 * 60 * 60 * 1000;
      }

      // 月
      let year = new Date(nowTime).getFullYear();
      let month = new Date(nowTime).getMonth() + 1;
      let monthArr: Array<number> = [];
      for (let i = 1; i <= 12; i++) {
        monthArr.push(new Date(`${year}-${month}-1`).getTime());
        month--;
        if (month === 0) {
          year = year - 1;
          month = 12;
        }
      }

      let arr = [dayArr, weekArr, monthArr];
      return { ...state, timeArray: arr };
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
      yield put({
        type: 'getTimeArray',
      });
      const state: ModelSatisfy = yield select((state: any) => state.satisfy);
      let dbName = 'Goals';
      let goaldata: Array<GoalShow> = [];
      let minTime = state.minTime;
      let maxTime = state.maxTime;
      let taskSatisfy: Array<boolean> = [];

      goaldata = yield indexedDB.getData(dbName, 'timeId');
      if (goaldata === null) {
        goaldata = [];
      }
      let arr: Array<GoalShow> = [];
      // 获取当天的零点时间, 以处理昨天的完成任务
      let nowTime = new Date(
        `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
      ).getTime();
      goaldata.forEach((goal: GoalShow) => {
        if (goal.endTimeId > nowTime || goal.endTimeId === 0) {
          arr.push(goal);
        }
      });
      goaldata = arr;
      // 获取所有目标
      // goaldata = yield indexedDB.getData(dbName, 'timeId', undefined, minTime, maxTime);
      // if(goaldata === null) {
      //   goaldata = [];
      // }
      /*
      直接进入：显示当月日记
      选择日期：根据payload时间区间显示
      从日记详情退回：之前是哪个月就是哪个月
      */
      // if(payload === undefined) {
      //   if(minTime === 0 || maxTime === 0) {
      //     // 直接进入
      //     // else 从详情返回，可直接使用state的数据
      //     if(new Date().getMonth() === 11) {
      //       // 选中12月
      //       minTime = new Date(`${new Date().getFullYear()}-12`).getTime();
      //       maxTime = new Date(`${new Date().getFullYear() + 1}-1`).getTime();
      //     } else {
      //       minTime = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`).getTime();
      //       maxTime = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 2}`).getTime();
      //     }
      //   }
      // } else {
      //   //选中了日期
      //   minTime = payload.minTime;
      //   maxTime = payload.maxTime;
      // }
      /*
      根据获得的goals获取taskSatisfy
      */
      // taskSatisfy
      yield put({
        type: 'changeState',
        payload: {
          goaldata,
          minTime,
          maxTime,
          taskSatisfy,
        },
      });
    },
    *checkGoal({ payload }: any, { put, call, select }: any) {
      const state: ModelSatisfy = yield select((state: any) => state.satisfy);
      let goal = payload.goal;
      if (goal.endTimeId === 0) {
        goal.endTimeId = new Date().getTime();
      } else {
        goal.endTimeId = 0;
      }
      let dbName = 'Goals';
      console.log(goal);
      let success: boolean = yield indexedDB.put(dbName, goal);
      if (success) {
        yield put({
          type: 'init',
        });
        payload.close();
      }
    },
  },
};
