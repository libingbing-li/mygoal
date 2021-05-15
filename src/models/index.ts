import LZString from 'lz-string';
import app from '../utils/app';
import { AllData } from '../utils/interface'; 
import indexedDB from '../utils/indexedDB';


interface IState {
  classId: number,
  data: any,
}
export default {
  namespace: 'index',
  state: {
    time: 0, //时间戳-id
    classId: 1, //分类: 1   //1食材 2菜谱 3调味 4方便食物
    classValue: '默认', //小分类
    name: '', //名称
    day: '', //保鲜天数
    num: '', //个数
    weight: '', //重量
    value: '', //价格
    note: '', //备注
    data: null, //编辑时的原数据
    isBasket: false, //basket-是否显示
    noteStr: 'info', //开启note弹窗时的str标识
  },
  reducers: {
    changeState(state: FoodIngredient & IState, { payload }: any) {
      return {...state, ...payload};
    },
  },
  effects: {
    *addItem({ payload }: any, {put, call, select}: any) {
      /* 
      put: 触发action yield put({ type: 'todos/add', payload: 'Learn Dva'});
      call: 调用异步逻辑, 支持Promise const result = yield call(fetch, '/todos');
      select: 从state中获取数据,属性名是命名空间的名字 const todos = yield select(state => state.todos);
      */
      const state = yield select((state: any) => state.index);
      if(state.name === '' ||
        state.day === '' ||
        state.num === '' ||
        state.weight === '' || 
        state.value === ''
        ) {
          app.info('请填写所有数据');
          return;
        }
        if(state.day <= 0 ||
        state.num <= 0 ||
        state.weight <= 0 || 
        state.value <= 0
        ) {
          app.info('请填写正确格式的数据');
          return;
        }
        // 选择库名
        let dbStr = '';
        switch(state.classId) {
          case 1: dbStr = 'foodIngredient'; break;
          case 2: dbStr = 'flavoring'; break;
          case 3: dbStr = 'convenientFood'; break;
        }
      if(state.time) {
        // 编辑
        if(state.classId !== state.data.classId) {
          // 改变了大类别 需要删除旧数据,添加新数据
          const newData = {
            classId: state.classId,
            time: state.time,
            classValue: state.classValue,
            name: state.name,
            day: Number(state.day),
            num: Number(state.num),
            weight: Number(state.weight),
            value: Number(state.value),
            note: state.note,
          }
          yield put({
            type: 'remove',
            payload: {
              close: payload,
              data: state.data,
            }
          });
          const success = yield indexedDB.add(dbStr, newData); 
          if(success) {
            payload();
            yield put({
              type: 'info/init',
            });
            yield put({
              type: 'time/init'
            });
          } else {
            app.info('数据添加失败');
          }
        } else {
          const success = yield indexedDB.put(dbStr, {
            classId: state.classId,
            time: state.time,
            classValue: state.classValue,
            name: state.name,
            day: Number(state.day),
            num: Number(state.num),
            weight: Number(state.weight),
            value: Number(state.value),
            note: state.note,
          }, state.data); 
          if(success){
            payload();
            yield put({
              type: 'info/init',
            });
            yield put({
              type: 'time/init'
            });
          } else {
            app.info('数据更新失败');
          }
        }
      } else {
        // 添加
      let now = new Date();
      const success = yield indexedDB.add(dbStr, {
        classId: state.classId,
        time: now.getTime(),
        classValue: state.classValue,
        name: state.name,
        day: Number(state.day),
        num: Number(state.num),
        weight: Number(state.weight),
        value: Number(state.value),
        note: state.note,
      }); 
      if(success) {
        payload();
        yield put({
          type: 'info/init',
        });
        yield put({
          type: 'time/init'
        });
      } else {
        app.info('数据添加失败');
      }
      }
    },
    *remove({ payload }: any, {put, call, select}: any) {
      /* 
      put: 触发action yield put({ type: 'todos/add', payload: 'Learn Dva'});
      call: 调用异步逻辑, 支持Promise const result = yield call(fetch, '/todos');
      select: 从state中获取数据,属性名是命名空间的名字 const todos = yield select(state => state.todos);
      */
      let state = yield select((state: any) => state.index);
      if(payload?.data) {
        state = payload.data;
      }
      // 选择库名
      let dbStr = '';
      switch(state.classId) {
        case 1: dbStr = 'foodIngredient'; break;
        case 2: dbStr = 'flavoring'; break;
        case 3: dbStr = 'convenientFood'; break;
      }
      const success = yield indexedDB.remove(dbStr, state.time, state.name, state.num);
      if(success) {
        if(payload) {
          if(payload.data) {
            payload.close();
          } else {
            payload();
          }
        }
        yield put({
          type: 'info/init',
        });
        yield put({
          type: 'time/init'
        });
      } else {
        app.info('数据删除失败');
      }
    },
    *getOtherInfoByName({ payload }: any, {put, call, select}: any) {
      const state = yield select((state: any) => state.index);
      if(state.time) {
        return;
      }
      let arr = ['foodIngredient', 'flavoring', 'convenientFood'];
      for(let dbStr of arr) {
        let data = yield indexedDB.getOtherInfo(dbStr, state.name);
        if(data) {
          data.value = app.getTowPointNum(data.value);
          data.weight = app.getTowPointNum(data.weight);
          yield put({
            type: 'changeState',
            payload: {...data, time: 0, note: ''},
          });
          break;
        } else {
          data = {
            time: 0, //时间戳-id
            classValue: '默认', //小分类
            day: '', //保鲜天数
            num: '', //个数
            weight: '', //重量
            value: '', //价格
            note: '', //备注
          };
          yield put({
            type: 'changeState',
            payload: {...data},
          });
        }
      }
    },
    *saveJson({ payload }: any, {put, call, select}: any) {
      // 文件保存
      //下载函数
      // const downloadFile = (filename: string, data: Blob) => {
      //   if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //     window.navigator.msSaveOrOpenBlob(data, filename)
      //   } else {
      //     const anchor = document.createElement('a')
      //     anchor.href = window.URL.createObjectURL(data)
      //     anchor.download = filename
      //     anchor.click()
      //     window.URL.revokeObjectURL(data)
      //   }
      // }
      //导出函数，name为导出的文件名，data为导出的json数据
      // const exportData = (name: string, data: string) => {
      //   const content = window.btoa(encodeURIComponent(JSON.stringify(data)))
      //   const blobData = new Blob([content], { type: 'application/octet-stream' })
      //   const filename = `${name}.json` //可以自定义后缀名
      //   downloadFile(filename, blobData)
      // }
      // const nameStr = 'MyFoodAllData' + new Date().toString();
      // const jsonData = yield indexedDB.getAllData();
      // exportData(nameStr, JSON.stringify(jsonData));

      // 文本保存
      const nameStr = 'MyFoodAllData' + new Date().toString();
      const jsonData = yield indexedDB.getAllData();
      const setInput: any = document.querySelector('#setInput');
      console.log('原文本长度',JSON.stringify(jsonData).length);
      const compressed = LZString.compressToBase64(JSON.stringify(jsonData));
      console.log('压缩后长度',compressed.length);
      setInput.value = compressed;
      setInput?.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        console.log('复制成功');
      }
    },
    *importJson({ payload }: any, {put, call, select}: any) {
      // 读取文件
      // 获取读取我文件的File对象
      // console.log(payload);
      // const name = payload.selectedFile.name; //读取选中文件的文件名
      // const size = payload.selectedFile.size; //读取选中文件的大小
      // console.log("文件名:" + name + "大小:" + size);
      // const reader = new FileReader(); //这是核心,读取操作就是由它完成.
      // reader.readAsText(payload.selectedFile); //读取文件的内容,也可以读取文件的URL
      // reader.onload = () => {
      //   const result = reader.result;
      //   //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
      //   if(result){
      //     const jsonData = JSON.parse(decodeURIComponent(window.atob(result)));
      //     console.log(jsonData);
      //     // const success = yield 
      //     indexedDB.setAllData(JSON.parse(jsonData));
      //   // if(success) {
      //   //   yield put({type: 'now/init'});
      //   //   yield put({type: 'info/init'});
      //   //   yield put({type: 'time/init'});
      //   // } else {
      //   //   app.info('导入失败');
      //   // }
      //   } else {
      //     app.info('该文件为空文件');
      //   }
      // }

      // 读取文本
      const setInput: any = document.querySelector('#setInput');
      const data = setInput?.value;
      // 解码
      const str = LZString.decompressFromBase64(data) || '';
      // const instanceofAllData = (data: any): data is AllData => {

      // }
      // if(instanceofAllData(JSON.parse(data))) {
        const success = yield indexedDB.setAllData(JSON.parse(str));
        if(success) {
          yield put({type: 'now/init'});
          yield put({type: 'info/init'});
          yield put({type: 'time/init'});
        } else {
          app.info('导入失败');
        }
      // } else {
      //   app.info('请粘贴正确格式的文本');
      // }
    },
  }
};