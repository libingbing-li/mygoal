import React from 'react';
import { history } from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import { LeftOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';
import DateSelect from '../../common-components/DateSelect';
import Confirm from '@/common-components/Confirm';
import { ModelSetting } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/alldata.less';
import app from '@/utils/app';

interface IState {
  importShow: boolean;
}
// 展示日记，可以点击进入详情
class AllData extends React.Component<ModelSetting & { dispatch: any }> {
  state: IState = {
    importShow: false,
  };

  componentDidMount = () => {
    //
  };

  // 后退清空数据
  back = () => {
    // this.props.dispatch({
    // 	type: 'note/changeState',
    //       payload: {
    //         timeId: 0,
    //         tags: [],
    //         data: '',
    //         title: '请输入标题',
    //       }
    // });
    history.goBack();
  };

  export = () => {
    this.props.dispatch({
      type: 'setting/exportJson',
    });
  };

  import = () => {
    this.props.dispatch({
      type: 'setting/importJson',
    });
    this.importShow();
  };

  importShow = () => {
    this.setState((preState: IState) => ({
      importShow: !preState.importShow,
    }));
  };

  getTime = (year: number, month: number, date: number) => {
    // 获取一个月的时间区间
    /* console.log(year, month, date);
    let yearMax = 0;
    let monthMax = 0;
    if (month + 1 === 13) {
      yearMax = year + 1;
      monthMax = 1;
    } else {
      yearMax = year;
      monthMax = month + 1;
    } */
    console.log({
      minTime: new Date(`${year}-1-1 00:00:00`),
      maxTime: new Date(`${year + 1}-1-1 00:00:00`),
    });
    this.props.dispatch({
      type: 'setting/changeState',
      payload: {
        minTime: new Date(`${year}-1-1 00:00:00`).getTime(),
        maxTime: new Date(`${year + 1}-1-1 00:00:00`).getTime(),
      },
    });
  };

  render() {
    return (
      <div className={styles.alldata}>
        <Confirm
          id="alldataImport"
          txt="导入操作将会删除当前选择时间段的所有内存数据，并将框内文本数据转码添加，该操作不可逆，请确认是否进行。"
          confirm={this.import}
          cancel={this.importShow}
          style={{
            display: this.state.importShow ? 'flex' : 'none',
          }}
        ></Confirm>
        <div className={styles.title}>
          <LeftOutlined onClick={this.back} />
          <div>数据转移</div>
          <VerticalAlignMiddleOutlined />
        </div>
        <DateSelect
          id="goals"
          type={3}
          style={{
            width: '80vw',
            margin: '10px 10vw',
          }}
          returnTime={(year: number, month: number, date: number) =>
            this.getTime(year, month, date)
          }
        ></DateSelect>
        <div className={styles.tip}>复制框内文本导出/粘贴文本到框内导入</div>
        <div className={styles.body}>
          <textarea
            // value={this.props.dataTxt}
            id="alldata"
          ></textarea>
        </div>
        <div className={styles.btns}>
          <div onClick={this.export}>导出</div>
          <div onClick={this.importShow}>导入</div>
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.setting,
}))(AllData);
