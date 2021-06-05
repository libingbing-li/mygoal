import React from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import { CloseOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import { GoalShow } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import style from './styles/databox.less';
import moment from 'moment';

interface IProps {
  data: GoalShow;
  close: () => void;
  check: () => void;
}
class dataBox extends React.Component<
  IProps & { infoNote: string; nowNote: string; dispatch: any }
> {
  // 渲染
  renderBox = () => {
    let div = <div></div>;
    // if(this.props.data?.endTimeId === 0) {
    //   div = (
    //     <div className={style.goalBox} id="dataBox" style={{bottom: '-50vh'}}>
    //       <div className={style.time}>{this.props.data.timeId}</div>
    //       <div className={style.title}>{this.props.data.title}</div>
    //       <div className={style.description}>{this.props.data.description}</div>
    //       <div className={style.finish}>{this.props.data.finishDescription}</div>
    //     </div>
    //   );
    // } else {
    //   div = (
    //     <div></div>
    //   );
    // }
    div = (
      <div
        className={style.dataBox}
        id="dataBox"
        style={{
          bottom: '-50vh',
          color: this.props.data.endTimeId === 0 ? '#000' : '#ddd',
        }}
      >
        <div className={style.btns}>
          <CloseOutlined onClick={this.props.close} />
          <CheckOutlined onClick={this.props.check} />
          <EditOutlined
            onClick={() =>
              history.push(`./editGoal?timeId=${this.props.data.timeId}`)
            }
          />
        </div>
        <div className={style.titleBox}>
          <div className={style.title}>{this.props.data.title}</div>
          <div className={style.time}>
            {moment(this.props.data.timeId).format('YYYY-MM-DD')}
          </div>
        </div>
        <div className={style.description}>{this.props.data.description}</div>
        <div className={style.finish}>
          {this.props.data.finishDescription}111111111
        </div>
      </div>
    );
    return div;
  };
  render() {
    return this.renderBox();
  }
}
export default connect((state: any) => ({
  // ...state.
}))(dataBox);
