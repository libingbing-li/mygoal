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
import commonStyle from '@/common-styles/common.less';
import style from './styles/goals.less';
import app from '@/utils/app';

interface IState {
  data: Array<GoalShow>;
}
// 展示日记，可以点击进入详情
class Goals extends React.Component<ModelSetting & { dispatch: any }> {
  state: IState = {
    data: this.props.goalFinish,
  };

  componentDidMount = () => {
    this.props.dispatch({
      type: 'setting/getFinishGoals',
    });
  };

  getDerivedStateFromProps = (nextProps: ModelSetting) => {
    this.setState({
      data: nextProps.goalFinish,
    });
    console.log(nextProps);
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
      <div className={style.dataBox} key={data.timeId}>
        <div className={style.titleBox}>
          <div className={style.titleTxt}>{data.title}</div>
          <div className={style.time}>
            {moment(data.timeId).format('YYYY-MM-DD')}
            <br />
            {moment(data.endTimeId).format('YYYY-MM-DD')}
          </div>
        </div>
        <div className={style.description}>
          {data.description === '' ? '该目标无描述' : data.description}
        </div>
        <div className={style.finish}>{`一共坚持了${data.moreday}天！`}</div>
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
        <div className={style.body}>
          {this.state.data.length === 0
            ? '当前不存在已完成目标'
            : this.state.data.map((goal: GoalShow) => {
                return this.renderDataBox(goal);
              })}
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.setting,
}))(Goals);
