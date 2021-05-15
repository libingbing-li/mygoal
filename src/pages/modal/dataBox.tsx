import React from 'react';
import { connect } from 'dva';
import {
  HomeOutlined,
  HomeFilled,
  CarryOutOutlined,
  CarryOutFilled,
  SnippetsOutlined,
  SnippetsFilled,
  PlusOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  StarFilled
} from '@ant-design/icons';
import { GoalShow } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import style from './styles/goalbox.less';


interface IProps {
  data: GoalShow;
}
class dataBox extends React.Component<IProps  & {infoNote: string; nowNote: string; dispatch: any}> {


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
      <div className={style.goalBox} id="dataBox" style={{bottom: '-50vh'}}>
        <div className={style.time}>{this.props.data.timeId}</div>
        <div className={style.title}>{this.props.data.title}</div>
        <div className={style.description}>{this.props.data.description}</div>
        <div className={style.finish}>{this.props.data.finishDescription}</div>
      </div>
    );
    return div;
  }
  render() {
    return this.renderBox();
  }
} 
export default connect((state: any) => ({
  // ...state.
}))(dataBox);

