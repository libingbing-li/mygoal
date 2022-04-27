/*
组件功能：
确认操作的弹出框
*/

import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import style from './styles/Confirm.less';
import { months } from 'moment';

class defaultProps {
  confirm: () => void = () => {
    console.log('confirm');
  };
  cancel: () => void = () => {
    console.log('cancel');
  };
  confirmStr: string = '确认';
  cancelStr: string = '取消';
  txt: string = '是否进行操作';
  closeIcon: boolean = false;
  close: () => void = () => {};
}
type IProps = {
  id: string;
  style?: any;
} & defaultProps; //class defaultProps作为接口使用

interface IState {}

class Confirm extends React.Component<IProps> {
  static defaultProps = new defaultProps(); //设置defaultProps默认值
  state: IState = {};
  componentDidMount = () => {};

  render() {
    return (
      <div
        className={style.confirm}
        id={`confirm-${this.props.id}`}
        style={{ ...this.props.style }}
      >
        <CloseOutlined
          className={style.closeIcon}
          style={{ display: this.props.closeIcon ? 'block' : 'none' }}
          onClick={this.props.close}
        />
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
