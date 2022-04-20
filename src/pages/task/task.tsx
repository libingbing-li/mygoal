import React from 'react';
import { history } from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import { DatePicker } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { GoalShow, ModelTask, TaskShow } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/task.less';
import app from '@/utils/app';
import './styles/antd.css';

interface IState {
  showMore: boolean;
  showMoreStr: string;
}
// 展示日记，可以点击进入详情
class Task extends React.Component<ModelTask & { dispatch: any }> {
  state: IState = {
    showMore: false,
    showMoreStr: '更多',
  };

  componentDidMount = () => {
    this.props.dispatch({
      type: 'task/openDB',
    });
    const scrollBox = document.querySelector('#task');
    scrollBox?.addEventListener('scroll', (e: any) => {
      this.props.dispatch({
        type: 'task/changeState',
        payload: {
          scrollTop: scrollBox.scrollTop,
        },
      });
    });
    if (scrollBox) {
      scrollBox.scrollTop = this.props.scrollTop;
    }
  };

  showMore = () => {
    this.setState((preState: IState) => ({
      showMore: !preState.showMore,
      showMoreStr: !preState.showMore === true ? '收起' : '更多',
    }));
  };

  taskfinish = (task: TaskShow) => {
    this.props.dispatch({
      type: 'task/checkTask',
      payload: {
        task,
      },
    });
  };

  showTask = (item: TaskShow) => {
    const getIntervalStr = (
      interval: { type: number; num: Array<number> },
      intervalTimeType: boolean,
    ) => {
      // console.log(interval);
      let str = '';
      switch (interval.type) {
        case 1:
          return str;
        case 2:
          str = 'week-';
          interval.num.forEach((num: number) => {
            if (num != 0) {
              str = str + num;
            }
          });
          break;
        case 3:
          str = 'day-' + interval.num[0];
      }
      str += ` ${intervalTimeType ? '设定' : '完成'}`;
      return str;
    };
    return (
      <div
        className={
          item.endTimeId === 0
            ? styles.taskShow
            : `${styles.taskShow} ${styles.taskShowCheck}`
        }
        key={item.timeId}
        onClick={() => {
          if (item.endTimeId === 0) {
            history.push(`/editTask?timeId=${item.timeId}`);
          }
        }}
      >
        <div className={styles.taskShow_body}>
          <div
            className={styles.taskShow_check}
            onClick={(e) => {
              this.taskfinish(item);
              e.stopPropagation();
            }}
          ></div>
          <div className={styles.taskShow_time}>
            <span>{getIntervalStr(item.interval, item.intervalTimeType)}</span>
            {moment(item.timeId).format('YYYY-MM-DD')}
          </div>
          <div className={styles.taskShow_txt}>{item.txt}</div>
        </div>
        <div className={styles.taskShow_tags}>
          {item.tags.map((tag: GoalShow, index: number) => {
            return <span key={index}>{tag.title}</span>;
          })}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.task} id="task">
        {this.props.taskdata.length === 0 ? (
          <div className={styles.nothing}>任务已经全部完成啦!</div>
        ) : (
          this.props.taskdata.map((item: TaskShow) => {
            return this.showTask(item);
          })
        )}
        <div
          className={styles.nothing}
          style={{
            display: this.props.nextTaskData.length === 0 ? 'none' : 'block',
          }}
          onClick={this.showMore}
        >
          ——————{this.state.showMoreStr}——————
        </div>
        {this.state.showMore === false ? (
          <div></div>
        ) : (
          this.props.nextTaskData.map((item: TaskShow) => {
            return this.showTask(item);
          })
        )}
        <div className={styles.tips}>
          tip：在同一天内完成相同任务，历史记录只有一条
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.task,
}))(Task);
