import React from 'react';
import { history } from 'umi';
import { ControlType } from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { connect, EffectsCommandMap, Model } from 'dva';
import { Menu, Dropdown } from 'antd';
import {
  LeftOutlined,
  CheckOutlined,
  HighlightOutlined,
  PlusOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { GoalShow, ModelEditTask } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import Confirm from '@/common-components/Confirm';
import styles from './styles/edit.less';
import app from '@/utils/app';

interface IState {
  tags: Array<GoalShow>;
  goaldata: Array<GoalShow>;
  confirmShow: boolean;
}

// 该页面用于编辑展示日记
class EditTask extends React.Component<ModelEditTask & { dispatch: any }> {
  state: IState = {
    tags: [],
    goaldata: [],
    confirmShow: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'editTask/init',
    });
    const timeId = history.location.query?.timeId;
    if (!(timeId === 'null')) {
      // 详情查看
      // 在此处model数据更新
      this.props.dispatch({
        type: 'editTask/getData',
        payload: {
          timeId: history.location.query?.timeId,
        },
      });
    }
  }

  //在本处获取新的props并更新
  componentWillReceiveProps = (nextProps: ModelEditTask) => {
    if (this.state.goaldata.length === 0 && this.state.tags.length === 0) {
      let goaldata = nextProps.goaldata || [];
      if (nextProps.data) {
        nextProps.data.tags.forEach((tag: GoalShow) => {
          for (let i = 0; i < goaldata.length; i++) {
            if (goaldata[i].timeId === tag.timeId) {
              goaldata.splice(i, 1);
              break;
            }
          }
        });
      }
      this.setState({
        tags: nextProps.data ? nextProps.data.tags : [],
        goaldata: goaldata,
      });
    }
  };

  save = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    this.props.dispatch({
      type: 'editTask/save',
      payload: {
        tags: this.state.tags,
        goBack: history.goBack,
      },
    });
  };

  remove = () => {
    this.props.dispatch({
      type: 'editTask/remove',
      payload: {
        goBack: history.goBack,
      },
    });
  };

  addTag = (goal: GoalShow, index: number) => {
    let arr = this.state.tags;
    arr.push(goal);
    let arrG = this.state.goaldata;
    arrG.splice(index, 1);
    this.setState({
      tags: arr,
      goaldata: arrG,
    });
  };
  removeTag = (goal: GoalShow, index: number) => {
    let arr = this.state.tags;
    let arrG = this.state.goaldata;
    arr.splice(index, 1);
    arrG.push(goal);
    this.setState({
      tags: arr,
      goaldata: arrG,
    });
  };

  selectWeek = (num: number) => {
    let numArr = this.props.interval.num;
    if (numArr[num] === 0) {
      numArr[num] = num;
    } else {
      numArr[num] = 0;
    }
    this.changeModelState('interval', {
      type: 2,
      num: numArr,
    });
  };

  changeModelState = (proName: string, data: any) => {
    this.props.dispatch({
      type: 'editTask/changeState',
      payload: {
        [proName]: data,
      },
    });
  };

  confirmShow = () => {
    this.setState((preState: IState) => ({
      confirmShow: !preState.confirmShow,
    }));
  };

  // 后退清空数据
  back = () => {
    this.props.dispatch({
      type: 'editTask/changeState',
      payload: {
        timeId: 0,
        txt: '',
        tags: [],
        data: null,
        interval: { type: 1, num: [0] },
      },
    });
    history.goBack();
  };

  render() {
    return (
      <div className={styles.edit_task}>
        <Confirm
          id="editGoalMore"
          txt="请选择操作"
          confirm={this.save}
          confirmStr="保存"
          cancel={this.remove}
          cancelStr="删除"
          closeIcon={true}
          close={this.confirmShow}
          style={{
            display: this.state.confirmShow ? 'flex' : 'none',
          }}
        ></Confirm>
        <div className={styles.title}>
          <LeftOutlined onClick={this.back} />
          {history.location.query?.timeId === 'null' ? '新建目标' : '编辑目标'}
          {history.location.query?.timeId === 'null' ? (
            <CheckOutlined onClick={this.save} />
          ) : (
            <EllipsisOutlined onClick={this.confirmShow} />
          )}
        </div>
        <div className={styles.taskbody}>
          <textarea
            className={styles.txt}
            value={this.props.txt}
            onChange={(e) => this.changeModelState('txt', e.target.value)}
          />
          <div className={styles.goal}>
            <div className={styles.tags}>
              <div>任务关联目标：</div>
              {this.state.tags.map((goal, index) => {
                return (
                  <span
                    key={goal.timeId}
                    onClick={() => this.removeTag(goal, index)}
                  >
                    {goal.title}
                  </span>
                );
              })}
            </div>
            <div className={styles.tags}>
              <div>已设定目标：</div>
              {this.state.goaldata.map((goal, index) => {
                return (
                  <span
                    key={goal.timeId}
                    onClick={() => this.addTag(goal, index)}
                  >
                    {goal.title}
                  </span>
                );
              })}
            </div>
          </div>
          <div className={styles.interval}>
            <div className={styles.type}>
              是否循环：
              <span
                style={{
                  color: this.props.interval.type === 1 ? '#fff' : '#000',
                  background: this.props.interval.type === 1 ? '#000' : '#fff',
                }}
                onClick={() => {
                  this.changeModelState('interval', { type: 1, num: [0] });
                }}
              >
                无
              </span>
              <span
                style={{
                  color: this.props.interval.type === 2 ? '#fff' : '#000',
                  background: this.props.interval.type === 2 ? '#000' : '#fff',
                }}
                onClick={() => {
                  this.changeModelState('interval', {
                    type: 2,
                    num: [0, 0, 0, 0, 0, 0, 0, 0],
                  });
                }}
              >
                周
              </span>
              <span
                style={{
                  color: this.props.interval.type === 3 ? '#fff' : '#000',
                  background: this.props.interval.type === 3 ? '#000' : '#fff',
                }}
                onClick={() => {
                  this.changeModelState('interval', { type: 3, num: [0] });
                }}
              >
                间隔天数
              </span>
            </div>
            <div className={styles.num}>
              <div
                style={{
                  display: this.props.interval.type === 2 ? 'block' : 'none',
                }}
              >
                <span
                  style={{
                    color: this.props.interval.num[1] === 1 ? '#fff' : '#000',
                    background:
                      this.props.interval.num[1] === 1 ? '#000' : '#fff',
                  }}
                  onClick={() => {
                    this.selectWeek(1);
                  }}
                >
                  一
                </span>
                <span
                  style={{
                    color: this.props.interval.num[2] === 2 ? '#fff' : '#000',
                    background:
                      this.props.interval.num[2] === 2 ? '#000' : '#fff',
                  }}
                  onClick={() => {
                    this.selectWeek(2);
                  }}
                >
                  二
                </span>
                <span
                  style={{
                    color: this.props.interval.num[3] === 3 ? '#fff' : '#000',
                    background:
                      this.props.interval.num[3] === 3 ? '#000' : '#fff',
                  }}
                  onClick={() => {
                    this.selectWeek(3);
                  }}
                >
                  三
                </span>
                <span
                  style={{
                    color: this.props.interval.num[4] === 4 ? '#fff' : '#000',
                    background:
                      this.props.interval.num[4] === 4 ? '#000' : '#fff',
                  }}
                  onClick={() => {
                    this.selectWeek(4);
                  }}
                >
                  四
                </span>
                <span
                  style={{
                    color: this.props.interval.num[5] === 5 ? '#fff' : '#000',
                    background:
                      this.props.interval.num[5] === 5 ? '#000' : '#fff',
                  }}
                  onClick={() => {
                    this.selectWeek(5);
                  }}
                >
                  五
                </span>
                <span
                  style={{
                    color: this.props.interval.num[6] === 6 ? '#fff' : '#000',
                    background:
                      this.props.interval.num[6] === 6 ? '#000' : '#fff',
                  }}
                  onClick={() => {
                    this.selectWeek(6);
                  }}
                >
                  六
                </span>
                <span
                  style={{
                    color: this.props.interval.num[7] === 7 ? '#fff' : '#000',
                    background:
                      this.props.interval.num[7] === 7 ? '#000' : '#fff',
                  }}
                  onClick={() => {
                    this.selectWeek(7);
                  }}
                >
                  日
                </span>
              </div>
              <div
                style={{
                  display: this.props.interval.type === 3 ? 'block' : 'none',
                }}
              >
                <input
                  type="number"
                  value={this.props.interval.num[0]}
                  onChange={(e) => {
                    this.changeModelState('interval', {
                      type: 3,
                      num: [e.target.value],
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.editTask,
}))(EditTask);
