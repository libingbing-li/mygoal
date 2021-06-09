import React from 'react';
import { history } from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import { LeftOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';
import DateSelect from '../../common-components/DateSelect';
import { ModelSetting } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/alldata.less';
import app from '@/utils/app';

interface IState {}
// 展示日记，可以点击进入详情
class AllData extends React.Component<ModelSetting & { dispatch: any }> {
  state: IState = {};

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
  };

  getTime = (year: number, month: number, date: number) => {
    // console.log(year, month, date);
    let yearMax = 0;
    let monthMax = 0;
    if (month + 1 === 13) {
      yearMax = year + 1;
      monthMax = 1;
    } else {
      yearMax = year;
      monthMax = month + 1;
    }
    this.props.dispatch({
      type: 'setting/changeState',
      payload: {
        minTime: new Date(`${year}-${month}-1`).getTime(),
        maxTime: new Date(`${yearMax}-${monthMax}-1`).getTime(),
      },
    });
  };

  render() {
    return (
      <div className={styles.alldata}>
        <div className={styles.title}>
          <LeftOutlined onClick={this.back} />
          <div>数据转移</div>
          <VerticalAlignMiddleOutlined />
        </div>
        <DateSelect
          id="goals"
          type={1}
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
          <div onClick={this.import}>导入</div>
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.setting,
}))(AllData);
