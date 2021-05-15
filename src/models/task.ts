import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelTask, TaskShow } from '../utils/interface';

const data = [
  {
    timeId: 0,
    endTimeId: 0,
    txt: '测试',
    tags: ['tags1', 'tags2'],
    check: true,
  },
  {
    timeId: 0,
    endTimeId: 0,
    txt: '测试',
    tags: ['tags1', 'tags2'],
    check: false,
  },
];

export default {
  namespace: 'task',
  state: {
    taskdata: data,
  },
  reducers: {
    changeState(state: ModelTask, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *openDB({ payload }: any, { put, call, select }: any) {
      // const success: boolean = yield indexedDB.openDataBase();
      // if(success) {
      //   yield put({
      //     type: 'init'
      //   });
      // }
    },
    *init({ payload }: any, { put, call, select }: any) {
      const state: ModelTask = yield select((state: any) => state.show);
      let dbName = 'NoteShow';
      let notedata: Array<TaskShow> = [];
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
      // notedata = yield indexedDB.getData(dbName, 'timeId', undefined, minTime, maxTime);
      // if(notedata === null) {
      //   notedata = [];
      // }
      // yield put({
      //   type: 'changeState',
      //   payload: {
      //     notedata,
      //     minTime,
      //     maxTime
      //   }
      // });
    },
    // *saveNote({ payload }: any, { put, call, select }: any) {
    //   /* 
    //   put: 触发action yield put({ type: 'todos/add', payload: 'Learn Dva'});
    //   call: 调用异步逻辑, 支持Promise const result = yield call(fetch, '/todos');
    //   select: 从state中获取数据,属性名是命名空间的名字 const todos = yield select(state => state.todos);
    //   */
    //   const state: ModelNote = yield select((state: any) => state.note);
    //   let dbName = 'NoteShow';
    //   let success: boolean = false;
    //   if (state.timeId) {
    //     // 编辑
    //     let note: NoteShow = {
    //       timeId: state.timeId,
    //       title: state.title === '请输入标题' ? '' : state.title,
    //       tags: state.tags,
    //       data: payload.data,
    //     };
    //     success = yield indexedDB.put(dbName, note);
    //   } else {
    //     // 添加
    //     let note: NoteShow = {
    //       timeId: new Date().getTime(),
    //       title: state.title === '请输入标题' ? '' : state.title,
    //       tags: state.tags,
    //       data: payload.data,
    //     };
    //     success = yield indexedDB.add(dbName, note);
    //   }
    //   if (success) {
    //     payload();
    //     yield put({
    //       type: 'show/init',
    //     });
    //   } else {
    //     app.info('日记保存失败');
    //   }
    // },
  }
};