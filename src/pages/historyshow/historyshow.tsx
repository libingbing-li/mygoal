import React from 'react';
import { History, history } from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import { CheckOutlined } from '@ant-design/icons';
import { HistoryShow, ModelHistoryShow } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import DateSelect from '@/common-components/DateSelect';
import styles from './styles/historyshow.less';
import app from '@/utils/app';
import './styles/antd.css';

interface IState {
  historydata: Array<HistoryShow>;
  reverse: boolean;
}
// 展示日记，可以点击进入详情
class HistoryShowList extends React.Component<
  ModelHistoryShow & { dispatch: any }
> {
  state: IState = {
    historydata: this.props.historydata,
    reverse: true,
  };

  componentDidMount = () => {
    const scrollBox = document.querySelector('#historyshow');
    scrollBox?.addEventListener('scroll', (e: any) => {
      this.props.dispatch({
        type: 'historyshow/changeState',
        payload: {
          scrollTop: scrollBox.scrollTop,
        },
      });
    });
    if (scrollBox) {
      scrollBox.scrollTop = this.props.scrollTop;
    }
  };

  getDerivedStateFromProps = (nextProps: ModelHistoryShow) => {
    this.setState({
      historydata: nextProps.historydata,
    });
  };

  showHistory = (item: HistoryShow) => {
    return (
      <div className={styles.historyShowBox} key={item.timeId}>
        <div className={styles.historyShow_time}>
          <CheckOutlined />
          {moment(item.timeId).format('YYYY-MM-DD')}
        </div>
        <div className={styles.historyShow_data}>
          {item.tasks.map((task: string, index: number) => {
            return <div key={task}>{task}</div>;
          })}
        </div>
        <div className={styles.historyShow_tags}>
          {item.goals.map((tag: string, index: number) => {
            return <span key={tag}>{tag}</span>;
          })}
        </div>
      </div>
    );
  };

  // onChange = (date: any, dateString: string) => {
  //   let maxTime = new Date(
  //     `${moment(date).year()}-${moment(date).month() + 2} 00:00:00`,
  //   );
  //   if (moment(date).month() === 11) {
  //     maxTime = new Date(`${moment(date).year() + 1}-1 00:00:00`);
  //   }
  //   this.props.dispatch({
  //     type: 'historyshow/init',
  //     payload: {
  //       minTime: new Date(dateString).getTime(),
  //       maxTime: maxTime.getTime(),
  //     },
  //   });
  // };

  getTime = (year: number, month: number, date: number) => {
    let yearMax = 0;
    let monthMax = 0;
    if (month + 1 === 13) {
      yearMax = year + 1;
      monthMax = 1;
    } else {
      yearMax = year;
      monthMax = month + 1;
    }
    console.log('historyTime', {
      minTime: new Date(`${year}-${month}-1 00:00:00`).getTime(),
      maxTime: new Date(`${yearMax}-${monthMax}-1 00:00:00`).getTime() - 1,
    });
    this.props.dispatch({
      type: 'historyshow/openDB',
      payload: {
        minTime: new Date(`${year}-${month}-1 00:00:00`).getTime(),
        maxTime: new Date(`${yearMax}-${monthMax}-1 00:00:00`).getTime() - 1,
      },
    });
  };

  reverse = () => {
    this.props.dispatch({
      type: 'changeState',
      payload: {
        historydata: this.state.historydata.reverse(),
      },
    });
    this.setState((preState: IState) => {
      return {
        reverse: !preState.reverse,
      };
    });
  };

  render() {
    return (
      <div className={styles.historyshow} id="historyshow">
        <div className={styles.reverse} onClick={this.reverse}>
          {this.state.reverse ? '逆序' : '顺序'}
        </div>
        <DateSelect
          id="goals"
          type={1}
          time={this.props.minTime}
          style={{
            width: '80vw',
            margin: '10px 10vw',
            flex: '0 0 auto',
          }}
          returnTime={(year: number, month: number, date: number) =>
            this.getTime(year, month, date)
          }
        ></DateSelect>
        {this.state.historydata.length === 0 ? (
          <div className={styles.nothing}>
            当前还没有任务记录，去看看任务吧~
          </div>
        ) : (
          this.state.historydata.map((item: HistoryShow) => {
            return this.showHistory(item);
          })
        )}
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.historyshow,
}))(HistoryShowList);
