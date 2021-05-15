import LZString from 'lz-string';
import app from '../utils/app';
import indexedDB from '../utils/indexedDB';
import { ModelShow, NoteShow } from '../utils/interface';

export default {
  namespace: 'setting',
  state: {
    dataTxt: '',
  },
  reducers: {
    changeState(state: ModelShow, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *exportJson({ payload }: any, {put, call, select}: any) {
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
      const jsonData: string = yield indexedDB.getAllData();
      const setInput: any = document.querySelector('#alldata');
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
        // if(success) {
        //   yield put({type: 'now/init'});
        //   yield put({type: 'info/init'});
        //   yield put({type: 'time/init'});
        // } else {
        //   app.info('导入失败');
        // }
      //   } else {
      //     app.info('该文件为空文件');
      //   }
      // }

      // 读取文本
      const setInput: any = document.querySelector('#alldata');
      const data = setInput?.value;
      // 解码
      const str = LZString.decompressFromBase64(data) || '';
      // const instanceofAllData = (data: any): data is AllData => {

      // }
      // if(instanceofAllData(JSON.parse(data))) {
        const success: boolean = yield indexedDB.setAllData(JSON.parse(str));
        if(success) {
         console.log('导入成功');
         app.info('导入成功');
        } else {
          app.info('导入失败');
        }
      // } else {
      //   app.info('请粘贴正确格式的文本');
      // }
    },
  }
};