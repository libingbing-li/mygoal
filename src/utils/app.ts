import {Toast} from 'antd-mobile';
import moment from 'moment';

class Application {
  // 提示
  info = (str: string) => {
    Toast.info(str);
  }

  // 转换时间格式
  msgTime = (time: any) => {
    moment.locale('zh-cn');
    return moment(time)
      .fromNow();
  };

  // 获取两位小数
  getTowPointNum = (value: number | string) => {
    value = Number(value);
    let str = value + '';
    const index = str.indexOf('.');
    if(index === -1) {
      str = str + '.00';
    } else if(str.length === index + 2) {
      str = str + '0';
    } else {
      str = str.substring(0,index + 3);
    }
    return str;
  }
  
}

const app = new Application();

export default app;