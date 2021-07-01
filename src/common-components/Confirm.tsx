/*
组件功能：
确认操作的弹出框
*/

import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from './styles/Confirm.less';
import { months } from 'moment';

const defaultProps = {
  confirm: () => {
    console.log('confirm');
  },
  cancel: () => {
    console.log('cancel');
  },
  confirmStr: '确认',
  cancelStr: '取消',
  txt: '是否进行操作',
};
type IProps = {
  id: string;
  style?: any;
} & Partial<typeof defaultProps>; //等同于上述注释的部分

interface IState {}

class Confirm extends React.Component<IProps & typeof defaultProps> {
  static defaultProps = defaultProps;
  state: IState = {};
  componentDidMount = () => {};

  render() {
    return (
      <div
        className={style.confirm}
        id={`confirm-${this.props.id}`}
        style={{ ...this.props.style }}
      >
        <div className={style.body}>{this.props.txt}</div>
        <div className={style.btns}>
          <div
            style={{
              borderRight: '3px #000 solid',
            }}
            onClick={this.props.cancel}
          >
            {this.props.cancelStr}
          </div>
          <div onClick={this.props.confirm}>{this.props.confirmStr}</div>
        </div>
      </div>
    );
  }
}

export default Confirm;
