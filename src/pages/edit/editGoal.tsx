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
import styles from './styles/edit.less';
import app from '@/utils/app';

interface IState {}

// 该页面用于编辑展示日记
class EditGoal extends React.Component<ModelEditGoal & { dispatch: any }> {
  state: IState = {};

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
  componentWillReceiveProps = (nextProps: any) => {};

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

  // 详情-编辑-下拉菜单
  menu = (
    <Menu>
      <Menu.Item key="0" style={{ textAlign: 'center' }}>
        <CheckOutlined style={{ margin: 0 }} onClick={this.save} />
      </Menu.Item>
      <Menu.Item key="1" style={{ textAlign: 'center' }}>
        <DeleteOutlined style={{ margin: 0 }} onClick={this.remove} />
      </Menu.Item>
    </Menu>
  );

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

  render() {
    return (
      <div className={styles.edit_task}>
        <div className={styles.title}>
          <LeftOutlined onClick={this.back} />
          {history.location.query?.timeId === 'null' ? '新建目标' : '编辑目标'}
          {history.location.query?.timeId === 'null' ? (
            <CheckOutlined onClick={this.save} />
          ) : (
            <Dropdown overlay={this.menu} trigger={['click']}>
              <EllipsisOutlined />
            </Dropdown>
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
          <div
            className={styles.finish}
            style={{
              display:
                history.location.query?.timeId === 'null' ? 'none' : 'block',
            }}
          >
            {this.props.finishDescription.length === 0
              ? '该目标无记录'
              : this.props.data.finishDescription.map(
                  (data: {
                    year: number;
                    month: number;
                    week: number;
                    day: number;
                  }) => {
                    return (
                      <div key={data.year}>{`${new Date(
                        data.year,
                      ).getFullYear()}年：完成任务${data.day}天，${
                        data.week
                      }周，${data.month}月`}</div>
                    );
                  },
                )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state: any) => ({
  ...state.editGoal,
}))(EditGoal);
