import React from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import {} from '@ant-design/icons';
import { ModelIndex } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/sidebar.less';

interface IProps {
  str: string;
  close: () => void;
  style: any;
  isLocking: boolean;
  locking: () => void;
}
class Sidebar extends React.Component<
  IProps & ModelIndex & { infoNote: string; nowNote: string; dispatch: any }
> {
  // 转到数据导入导出界面
  goAllData = () => {
    history.push('/alldata');
  };
  goGoals = () => {
    history.push('/goals');
  };

  render() {
    return (
      <div style={this.props.style} id="sidebar" className={styles.sidebar}>
        <div className={styles.title}>MyGoal</div>
        <div className={styles.item} onClick={this.goAllData}>
          数据转移
        </div>
        <div className={styles.item} onClick={this.goGoals}>
          完成目标
        </div>
        <div className={styles.description}>
          My系列App目标计划
          <br />
          @libingbing-li开发
        </div>
      </div>
    );
  }
}
export default connect((state: any) => ({
  ...state.index,
}))(Sidebar);
