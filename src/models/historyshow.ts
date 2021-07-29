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
        });
      }
    },
    *init({ payload }: any, { put, call, select }: any) {
      const state: ModelHistoryShow = yield select(
        (state: any) => state.historyshow,
      );
      let dbName = 'Histories';
      let historydata: Array<HistoryShow> = yield indexedDB.getData(
        dbName,
        'timeId',
        undefined,
        payload.minTime,
        payload.maxTime,
      );
      console.log(payload, historydata);
      yield put({
        type: 'changeState',
        payload: {
          historydata: historydata ? historydata : [],
          minTime: payload.minTime,
          maxTime: payload.maxTime,
        },
      });
    },
  },
};
