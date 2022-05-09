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
import { ModelEditGoal } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import Confirm from '@/common-components/Confirm';
import styles from './styles/edit.less';
import app from '@/utils/app';

interface IState {
  confirmShow: boolean;
  removeComfirmShow: boolean;
}

// 该页面用于编辑展示日记
class EditGoal extends React.Component<ModelEditGoal & { dispatch: any }> {
  state: IState = {
    confirmShow: false,
    removeComfirmShow: false,
  };

  componentDidMount() {
    const timeId = history.location.query?.timeId;
    if (!(timeId === 'null')) {
      // 详情查看
      // 在此处model数据更新
      this.props.dispatch({
        type: 'editGoal/getData',
        payload: {
          timeId: history.location.query?.timeId,
        },
      });
    }
  }

  //在本处获取新的props并更新
  getDerivedStateFromProps = (nextProps: any) => {};

  save = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    this.props.dispatch({
      type: 'editGoal/save',
      payload: {
        goBack: history.goBack,
      },
    });
  };

  remove = () => {
    this.props.dispatch({
      type: 'editGoal/remove',
      payload: {
        goBack: history.goBack,
      },
    });
  };

  changeModelState = (proName: string, data: any) => {
    this.props.dispatch({
      type: 'editGoal/changeState',
      payload: {
        [proName]: data,
      },
    });
  };

  // 后退清空数据
  back = () => {
    this.props.dispatch({
      type: 'editGoal/changeState',
      payload: {
        timeId: 0,
        endTimeId: 0,
        title: '',
        description: '',
        tasks: [],
      },
    });
    history.goBack();
  };

  confirmShow = () => {
    this.setState((preState: IState) => ({
      confirmShow: !preState.confirmShow,
    }));
  };
  removeComfirmShow = () => {
    this.setState((preState: IState) => ({
      confirmShow: false,
      removeComfirmShow: !preState.removeComfirmShow,
    }));
  };

  render() {
    return (
      <div className={styles.edit_task}>
        <Confirm
          id="editGoalMore"
          txt="请选择操作"
          confirm={this.save}
          confirmStr="保存"
          cancel={this.removeComfirmShow}
          cancelStr="删除"
          closeIcon={true}
          close={this.confirmShow}
          style={{
            display: this.state.confirmShow ? 'flex' : 'none',
          }}
        ></Confirm>
        <Confirm
          id="editGoalMore"
          txt="是否确认删除目标"
          confirm={this.remove}
          confirmStr="删除"
          cancel={this.removeComfirmShow}
          cancelStr="取消"
          closeIcon={true}
          close={this.confirmShow}
          style={{
            display: this.state.removeComfirmShow ? 'flex' : 'none',
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
        <div className={styles.body}>
          <input
            type="text"
            value={this.props.title}
            onChange={(e) => this.changeModelState('title', e.target.value)}
          />
          <textarea
            value={this.props.description}
            onChange={(e) =>
              this.changeModelState('description', e.target.value)
            }
            placeholder="请输入目标描述"
          ></textarea>
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.editGoal,
}))(EditGoal);
