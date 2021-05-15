import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelNote, NoteShow } from '../utils/interface';

export default {
  namespace: 'editTask',
  state: {
    timeId: 0,
    tags: [],
    data: '',
  },
  reducers: {
    changeState(state: ModelNote, { payload }: any) {
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
      const state: ModelNote = yield select((state: any) => state.note);
      let dbName = 'NoteShow';
      let success: boolean = false;
      if (state.timeId) {
        console.log('进入编辑');
        // 编辑
        let note: NoteShow = {
          timeId: state.timeId,
          title: state.title,
          tags: state.tags,
          data: payload.data,
        };
        success = yield indexedDB.put(dbName, note);
      } else {
        console.log('进入添加');
        // 添加
        let note: NoteShow = {
          timeId: new Date().getTime(),
          title: state.title === '请输入标题' ? '' : state.title,
          tags: state.tags,
          data: payload.data,
        };
        success = yield indexedDB.add(dbName, note);
      }
      if (success) {
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            tags: [],
            data: '',
            title: '请输入标题',
          }
        });
        payload.goBack();
        yield put({
          type: 'show/init',
        });
      } else {
        app.info('日记保存失败');
      }
    },
    *getData({ payload }: any, { put, call, select }: any) {
      const state: ModelNote = yield select((state: any) => state.note);
      let dbName = 'NoteShow';
      const notedata: Array<NoteShow> = yield indexedDB.getData(dbName, 'timeId', Number(payload.timeId));
      yield put({
        type: 'changeState',
        payload: notedata[0],
      })
    },
    *remove({ payload }: any, {put, call, select}: any) {
      /* 
      put: 触发action yield put({ type: 'todos/add', payload: 'Learn Dva'});
      call: 调用异步逻辑, 支持Promise const result = yield call(fetch, '/todos');
      select: 从state中获取数据,属性名是命名空间的名字 const todos = yield select(state => state.todos);
      */
      let state: ModelNote = yield select((state: any) => state.note);
      // 选择库名
      let dbName = 'NoteShow';
      console.log(state);
      const success: boolean = yield indexedDB.remove(dbName, Number(state.timeId));
      if (success) {
        yield put({
          type: 'changeState',
          payload: {
            timeId: 0,
            tags: [],
            data: '',
            title: '请输入标题',
          }
        });
        payload.goBack();
        yield put({
          type: 'show/init',
        });
      } else {
        app.info('日记删除失败');
      }
    },
  }
};