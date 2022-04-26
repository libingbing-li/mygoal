import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelHistoryShow, HistoryShow } from '../utils/interface';

export default {
  namespace: 'historyshow',
  state: {
    scrollTop: 0,
    minTime: 0,
    maxTime: 0,
    historydata: [],
  },
  reducers: {
    changeState(state: ModelHistoryShow, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *openDB({ payload }: any, { put, call, select }: any) {
      const success: boolean = yield indexedDB.openDataBase();
      if (success) {
        yield put({
          type: 'init',
          payload: payload,
        });
      }
    },
    *init({ payload }: any, { put, call, select }: any) {
      console.log('history-init');
      const state: ModelHistoryShow = yield select(
        (state: any) => state.historyshow,
      );
      let minTime = payload ? payload?.minTime : state.minTime;
      let maxTime = payload ? payload?.maxTime : state.maxTime;

      if (minTime === 0 && maxTime === 0) {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let yearMax = 0;
        let monthMax = 0;
        if (month + 1 === 13) {
          yearMax = year + 1;
          monthMax = 1;
        } else {
          yearMax = year;
          monthMax = month + 1;
        }
        minTime = new Date(`${year}-${month}-1 00:00:00`).getTime();
        maxTime = new Date(`${yearMax}-${monthMax}-1 00:00:00`).getTime() - 1;
      }

      let dbName = 'Histories';
      let historydata: Array<HistoryShow> = yield indexedDB.getData(
        dbName,
        'timeId',
        undefined,
        minTime,
        maxTime,
        payload.reverse,
      );
      yield put({
        type: 'changeState',
        payload: {
          historydata: historydata ? historydata : [],
          minTime: minTime,
          maxTime: maxTime,
        },
      });
    },
  },
};
