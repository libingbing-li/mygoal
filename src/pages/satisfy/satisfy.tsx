import React from 'react';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import {
  UnorderedListOutlined,
  HighlightOutlined,
  HighlightFilled,
} from '@ant-design/icons';
import SlideBox from '@/common-components/SlideBox';
import GoalBox from '../modal/databox';
import { ModelSatisfy, GoalShow } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/satisfy.less';
import app from '@/utils/app';

const goaldata = {
  timeId: 0,
  endTimeId: 0,
  title: '',
  description: '',
  finishDescription: [],
  dayTasks: [],
  weekTasks: [],
  monthTasks: [],
};

interface IProps {
  onRef: (ref: any) => {};
}

interface IState {
  timeArray: Array<Array<number>>;
  timeIndex: number;
  timeStr: Array<string>;
  goalTimeShowWidth: number;
  goalTimeShowHeight: number;
  top: string;
  left: string;
  data: GoalShow | null; //当前选中的目标
  taskSatisfy: Array<number>;
  goaldata: Array<GoalShow>;
}

// 用于展示tag数和时间的分布
class Satisfy extends React.Component<
  ModelSatisfy & IProps & { dispatch: any }
> {
  state: IState = {
    timeArray: [[], [], []],
    timeIndex: 0,
    timeStr: [' · 日', ' · 周', ' · 月'],
    goalTimeShowWidth: 0,
    goalTimeShowHeight: 0,
    top: '0px',
    left: '0px',
    data: goaldata,
    taskSatisfy: [],
    goaldata: [],
  };

  componentDidMount = () => {
    this.props.onRef(this);
    this.props.dispatch({
      type: 'satisfy/init',
    });
    const scrollBox = document.querySelector('#satisfy');
    scrollBox?.addEventListener('scroll', (e: any) => {
      this.props.dispatch({
        type: 'satisfy/changeState',
        payload: {
          scrollTop: scrollBox.scrollTop,
        },
      });
    });
    if (scrollBox) {
      scrollBox.scrollTop = this.props.scrollTop;
    }
  };

  addTouch = (w: number, h: number) => {
    // 获取时间轴，目标轴，显示表
    const timeInterval: any = document.querySelector(`#timeInterval`);
    const tBox: any = timeInterval?.parentElement;
    const goalBox: any = document.querySelector(`#goalBox`);
    const gBox: any = goalBox?.parentElement;
    const goalTimeShowBox: any = document.querySelector(`#goalTimeShowBox`);
    const gTBox: any = goalTimeShowBox?.parentElement;
    /*
    时间轴： 左右移动时间轴，可以更改时间轴的left，同时也将显示表的left更改
    */
    // 移动元素和包裹盒子的宽
    // const tw: any = timeInterval?.scrollWidth; //真实宽度 当一次性获取的数据超出可视页面后，有时候会得到正确数据，有时候会得到0
    const tw: any = w;
    const tBw: any = tBox?.clientWidth; //可见宽度
    // 获取手指第一次的坐标
    let tX = 0;
    timeInterval?.addEventListener('touchstart', (e: any) => {
      tX = e.changedTouches[0].clientX; //记录手指第一次触碰屏幕的坐标点
    });
    // 获取当前的left (如果为auto的话，就要从当前的right来计算left值了 *本处不做auto预防处理，是因为left通过state中数据计算)
    let tleft = Number(
      timeInterval.style.left.substring(0, timeInterval.style.left.length - 2),
    );
    timeInterval?.addEventListener('touchmove', (e: any) => {
      // console.log('timeInterval',tw, tBw)
      if (tw <= tBw) return; //如果内容盒子的宽度不如包裹盒子长，那么就不能移动
      // 记录移动的距离
      let x = e.changedTouches[0].clientX - tX;
      tX = e.changedTouches[0].clientX;
      tleft = tleft + x;
      if (tleft >= 0) {
        tleft = 0; //>=0的话，说明左边顶部距离盒子边框有距离
      } else if (tBw - tleft - tw > 0) {
        tleft = tBw - tw - 0; //tBw - tleft - tw > 0， 说明盒子减去内容盒子的宽度（此时默认内容盒子宽度比盒子要长，剩余的应该是left的最大负值，假设>0，那么说明右边会有空隙
      }
      this.setState({
        left: tleft + 'px',
      });
    });
    timeInterval?.addEventListener('touchend', (e: any) => {
      if (tw <= tBw) return;
      let x = e.changedTouches[0].clientX - tX;
      tleft = tleft + x;
      if (tleft >= 0) {
        tleft = 0;
      } else if (tBw - tleft - tw > 0) {
        tleft = tBw - tw - 0;
      }
      this.setState({
        left: tleft + 'px',
      });
    });
    /*
    目标轴： 上下移动时间轴，可以更改目标轴的top，同时也将显示表的top更改
    */
    // 移动元素和包裹盒子的宽
    // const gh: any = goalBox?.offsetHeight; //真实高度  理由同tw
    const gh: any = h;
    let gBh: any = gBox?.clientHeight; //可见高度
    // 获取手指第一次的坐标
    let gY = 0;
    goalBox?.addEventListener('touchstart', (e: any) => {
      gY = e.changedTouches[0].clientY; //记录手指第一次触碰屏幕的坐标点
    });
    // 获取当前的left (如果为auto的话，就要从当前的right来计算left值了 *本处不做auto预防处理，是因为left通过state中数据计算)
    let gtop = Number(
      goalBox.style.top.substring(0, goalBox.style.top.length - 2),
    );
    goalBox?.addEventListener('touchmove', (e: any) => {
      gBh = gBox?.clientHeight; //在弹窗出现后可以滚动
      // console.log(gBh)
      if (gh <= gBh) return;
      // 记录移动的距离
      let y = e.changedTouches[0].clientY - gY;
      gY = e.changedTouches[0].clientY;
      gtop = gtop + y;
      if (gtop >= 0) {
        gtop = 0;
      } else if (gBh - gtop - gh > 0) {
        gtop = gBh - gh - 0;
      }
      this.setState({
        top: gtop + 'px',
      });
    });
    goalBox?.addEventListener('touchend', (e: any) => {
      if (gh <= gBh) return;
      let y = e.changedTouches[0].clientY - gY;
      gtop = gtop + y;
      if (gtop >= 0) {
        gtop = 0;
      } else if (gBh - gtop - gh > 0) {
        gtop = gBh - gh - 0;
      }
      this.setState({
        top: gtop + 'px',
      });
    });
    /*
    展示表： 左右上下移动
    */
    // 移动元素和包裹盒子的宽
    // const gTw: any = goalTimeShowBox?.offsetWidth; //真实宽度
    // const gTh: any = goalTimeShowBox?.offsetHeight;
    const gTw: any = w;
    const gTh: any = h;
    const gTBw: any = gTBox?.clientWidth; //可见宽度
    const gTBh: any = gTBox?.clientHeight;
    // 获取手指第一次的坐标
    let gTX = 0;
    let gTY = 0;
    goalTimeShowBox?.addEventListener('touchstart', (e: any) => {
      gTX = e.changedTouches[0].clientX; //记录手指第一次触碰屏幕的坐标点
      gTY = e.changedTouches[0].clientY;
    });
    // 获取当前的left 如果为auto的话，就要从当前的right来计算left值了
    let gTleft = Number(
      goalTimeShowBox.style.left.substring(
        0,
        goalTimeShowBox.style.left.length - 2,
      ),
    );
    let gTtop = Number(
      goalTimeShowBox.style.top.substring(
        0,
        goalTimeShowBox.style.top.length - 2,
      ),
    );
    goalTimeShowBox?.addEventListener('touchmove', (e: any) => {
      if (gTw > gTBw) {
        let x = e.changedTouches[0].clientX - gTX;
        gTX = e.changedTouches[0].clientX;
        gTleft = gTleft + x;
        if (gTleft >= 0) {
          gTleft = 0;
        } else if (gTBw - gTleft - gTw > 0) {
          gTleft = gTBw - gTw - 0;
        }
        this.setState({
          left: gTleft + 'px',
        });
      }
      if (gTh > gTBh) {
        // 记录移动的距离
        let y = e.changedTouches[0].clientY - gTY;
        gTY = e.changedTouches[0].clientY;
        gTtop = gTtop + y;

        if (gTtop >= 0) {
          gTtop = 0;
        } else if (gTBh - gTtop - gTh > 0) {
          gTtop = gTBh - gTh - 0;
        }
        this.setState({
          top: gTtop + 'px',
        });
      }
    });
    goalTimeShowBox?.addEventListener('touchend', (e: any) => {
      if (gTw > gTBw) {
        let x = e.changedTouches[0].clientX - gTX;
        gTleft = gTleft + x;
        if (gTleft >= 0) {
          gTleft = 0;
        } else if (gTBw - gTleft - gTw > 0) {
          gTleft = gTBw - gTw - 0;
        }
        this.setState({
          left: gTleft + 'px',
        });
      }
      if (gTh > gTBh) {
        // 记录移动的距离

        let y = e.changedTouches[0].clientY - gTY;
        gTY = e.changedTouches[0].clientY;
        gTtop = gTtop + y;

        if (gTtop >= 0) {
          gTtop = 0;
        } else if (gTBh - gTtop - gTh > 0) {
          gTtop = gTBh - gTh - 0;
        }
        this.setState({
          top: gTtop + 'px',
        });
      }
    });
  };

  componentWillReceiveProps = (nextProps: ModelSatisfy) => {
    this.setState({
      timeArray: nextProps.timeArray,
      goaldata: nextProps.goaldata,
    });
    // 初始化横向时间表
    this.setTimeType('init');
    this.goalTimeShow(
      0,
      nextProps.timeArray[this.state.timeIndex],
      nextProps.goaldata,
    );
  };

  setTimeType = (type: string) => {
    let index = this.state.timeIndex;
    if (type === 'init') {
      index = 0;
    }
    if (type === 'cut') {
      index++;
    }
    if (index === 3) {
      index = 0;
    }
    let width = 0;
    let height = 40 * this.props.goaldata.length;
    switch (index) {
      case 0:
        width = 50 * 30;
        break;
      case 1:
        width = 50 * 24;
        break;
      case 2:
        width = 50 * 12;
        break;
    }
    if (type !== 'init') {
      this.goalTimeShow(index, this.state.timeArray[index]);
    }

    this.setState({
      timeIndex: index,
      goalTimeShowWidth: width,
      goalTimeShowHeight: height,
      left: '0px',
    });
    this.addTouch(width, height);
  };

  goalTimeShow = (
    index: number,
    timeInterval: Array<number>,
    goaldata?: Array<GoalShow>,
  ) => {
    let taskSatisfy: Array<number> = [];
    goaldata = goaldata === undefined ? this.state.goaldata : goaldata;
    goaldata.forEach((goal: GoalShow) => {
      let arr: Array<number> = [];
      switch (index) {
        case 0:
          arr = goal.dayTasks;
          break;
        case 1:
          arr = goal.weekTasks;
          break;
        case 2:
          arr = goal.monthTasks;
          break;
      }
      if (arr.length === 0) {
        for (let i = 0; i < timeInterval.length; i++) {
          taskSatisfy.push(0);
        }
      } else {
        let arrIndex = arr.length - 1;
        for (let i = 0; i < timeInterval.length; i++) {
          if (arr[arrIndex] === timeInterval[i]) {
            taskSatisfy.push(arr[arrIndex]);
            arrIndex--;
          } else {
            taskSatisfy.push(0);
          }
        }
      }
    });
    this.setState({
      taskSatisfy,
    });
    // console.log(taskSatisfy)
  };

  setData = (goal: GoalShow, index: number) => {
    console.log('setData', index);
    this.setState({
      data: goal,
    });
    const dataBox: any = document.querySelector('#dataBox');
    dataBox.style.bottom = '60px';

    // 对主页面做调整
    const gBox: any = document.querySelector(`#goalBox`)?.parentElement;
    gBox.style.height = 'calc(50vh - 140px)';
    if (40 * (index + 1) > gBox?.clientHeight) {
      this.setState({
        top: gBox?.clientHeight - 40 * (index + 1),
      });
    }
  };

  dataBoxClose = () => {
    const dataBox: any = document.querySelector('#dataBox');
    dataBox.style.bottom = '-50vh';

    // 对主页面做调整
    const gBox: any = document.querySelector(`#goalBox`)?.parentElement;
    gBox.style.height = 'auto';
    this.setState({
      top: 0,
    });
  };

  showTimeInterval = (time: number, index: number) => {
    switch (this.state.timeIndex) {
      case 0:
        return moment(time).format('MM.DD');
      case 1:
        if (index === 0) {
          return '本周';
        }
        return '前' + index + '周';
      case 2:
        return moment(time).format('YYYY.MM');
    }
  };

  check = () => {
    this.props.dispatch({
      type: 'satisfy/checkGoal',
      payload: {
        goal: this.state.data,
        close: this.dataBoxClose,
      },
    });
  };

  render() {
    return (
      <div className={styles.satisfy} id="satisfy">
        <div className={styles.dateBar}>
          <div
            className={styles.year}
            onClick={() => {
              this.setTimeType('cut');
            }}
          >
            {new Date().getFullYear() +
              this.state.timeStr[this.state.timeIndex]}
          </div>
          <div className={styles.timeIntervalBox}>
            <div
              className={styles.timeInterval}
              id="timeInterval"
              style={{
                left: this.state.left,
              }}
            >
              {this.state.timeArray[this.state.timeIndex].map(
                (time: number, index: number) => {
                  return (
                    <div key={index}>{this.showTimeInterval(time, index)}</div>
                  );
                },
              )}
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.goalBox}>
            <div
              style={{
                top: this.state.top,
              }}
              className={styles.goals}
              id="goalBox"
            >
              {this.state.goaldata.map((goal: GoalShow, index: number) => {
                return (
                  <div
                    key={goal.timeId}
                    className={styles.goal}
                    onClick={() => this.setData(goal, index)}
                    style={{
                      color: goal.endTimeId === 0 ? '#000' : '#ddd',
                    }}
                  >
                    {goal.title}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.goalTimeShowBox}>
            <div
              id="goalTimeShowBox"
              className={styles.goalTimeShow}
              style={{
                left: this.state.left,
                top: this.state.top,
                width: this.state.goalTimeShowWidth + 'px',
              }}
            >
              {this.state.taskSatisfy.map((done: number, index: number) => {
                return (
                  <div key={index} className={styles.goalTimeShow_box}>
                    <div
                      style={{
                        display: done === 0 ? 'none' : 'block',
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <GoalBox
          data={this.state.data}
          close={this.dataBoxClose}
          check={this.check}
        ></GoalBox>
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.satisfy,
}))(Satisfy);
