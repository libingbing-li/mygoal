import React from 'react';
import { history } from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import {
  LeftOutlined,
  VerticalAlignMiddleOutlined,
  CarryOutOutlined,
} from '@ant-design/icons';
import { GoalShow, ModelSetting } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import DateSelect from '../../common-components/DateSelect';
import commonStyle from '@/common-styles/common.less';
import style from './styles/goals.less';
import app from '@/utils/app';

interface IState {}
// 展示日记，可以点击进入详情
class Goals extends React.Component<ModelSetting & { dispatch: any }> {
  state: IState = {};

  componentDidMount = () => {
    //
  };

  getTime = (year: number, month: number, date: number) => {
    console.log(year, month, date);
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

  renderDataBox = (data: GoalShow) => {
    return (
      <div className={style.dataBox}>
        <div className={style.titleBox}>
          <div className={style.title}>{data.title}</div>
          <div className={style.time}>
            {moment(data.timeId).format('YYYY-MM-DD')}
          </div>
        </div>
        <div className={style.description}>{data.description}</div>
        <div className={style.finish}>{data.finishDescription}111111111</div>
      </div>
    );
  };

  render() {
    return (
      <div className={style.goals}>
        <div className={style.title}>
          <LeftOutlined onClick={this.back} />
          <div>完成目标</div>
          <CarryOutOutlined />
        </div>
        <DateSelect
          id="goals"
          type={1}
          style={{
            margin: '10px 5vw',
          }}
          returnTime={(year: number, month: number, date: number) =>
            this.getTime(year, month, date)
          }
        ></DateSelect>
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.setting,
}))(Goals);
