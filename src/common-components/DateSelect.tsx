/*
组件功能：


区间或单个
选择日期
选择月

目前在考虑单栏
以及功能
*/

import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from './styles/DateSelect.less';
import { months, weekdays } from 'moment';

const defaultProps = {
  type: 1, //type 1月 2日期  3年
  time: 0,
};

// interface IProps {
//   id: string;
//   fx?: number;
//   fy?: number; //父元素的像素值,默认是整个窗口的可见区域px
//   top?: string;
//   left?: string;
//   bottom?: string;
//   right?: string; //初始化的控制位置的值px, 默认auto
//   minTop?: number;
//   minLeft?: number;
//   minBottom?: number;
//   minRight?: number; // 贴边宽高
//   isTop?: boolean;
//   isBottom?: boolean;
//   isLeft?: boolean;
//   isRight?: boolean; //是否贴边
//   isLeftOrRight?: boolean; //是否先进行左右的判断
// };

type IProps = {
  id: string;
  style: any;
  returnTime: (year: number, month: number, date: number) => void;
} & typeof defaultProps; //等同于上述注释的部分

interface IState {
  showStr: string;
  selectStr: string;
  selectArray: Array<number>;
  year: number;
  month: number;
  date: number;
  selectBC: string;
  selectBR: string;
  day: number;
  week: Array<string>;
}

class DateSelect extends React.Component<IProps> {
  static defaultProps = defaultProps;
  state: IState = {
    showStr: '',
    selectStr: '',
    selectArray: [],
    year: 0,
    month: 0,
    date: 0,
    day: 0,
    selectBC: 'repeat(4, 1fr)',
    selectBR: 'repeat(3, 1fr)',
    week: ['日', '一', '二', '三', '四', '五', '六'],
  };
  componentDidMount = () => {
    console.log(this.props);
    if (this.props.time) {
      const nowDate = new Date(this.props.time);
      let year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1;
      let date = nowDate.getDate();

      this.getStr(year, month, date);
    } else {
      const nowDate = new Date();
      let year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1;
      let date = nowDate.getDate();

      this.getStr(year, month, date);
    }
  };

  getStr = (year: number, month: number, date: number) => {
    let str1 = '';
    let str2 = '';
    let arr: Array<number> = [];
    let selectBC = this.state.selectBC;
    let selectBR = this.state.selectBR;
    let day = 0;
    switch (this.props.type) {
      case 1:
        str1 = year + '.' + month;
        str2 = year + '';
        arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        day = month;
        break;
      case 2:
        str1 = month + '.' + date;
        str2 = year + '.' + month;
        const nextM = month + 1 === 13 ? 1 : month + 1;
        const nextMonth = new Date(`${year}-${nextM}-1 00:00:00`);
        const monthLength = new Date(nextMonth.getTime() - 1).getDate(); //获得month月的最大天数
        const Mday = new Date(`${year}-${month}-1`).getDay(); //获得month月1号是周几 0-6 日-六
        for (let i = 0; i < Mday; i++) {
          arr.push(0);
        }
        for (let i = 1; i <= monthLength; i++) {
          arr.push(i);
        }
        let arrRmainder = arr.length % 7;
        if (arrRmainder !== 0) {
          for (let i = 0; i < 7 - arrRmainder; i++) {
            arr.push(0);
          }
        }
        selectBC = 'repeat(7, 1fr)';
        selectBR = `repeat(${parseInt(String(arr.length / 7)) + 1}, 1fr)`;
        day = date;
        break;
      case 3:
        str1 = year + '';
        str2 = year + '';
        arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        day = month;
        break;
    }
    this.setState({
      showStr: str1,
      selectStr: str2,
      selectArray: arr,
      year,
      month,
      date,
      day,
      selectBC,
      selectBR,
    });
    this.props.returnTime(year, month, date);
  };

  last = () => {
    let year = this.state.year;
    let month = this.state.month;
    let date = this.state.date;
    switch (this.props.type) {
      case 1:
        // 上一月
        if (month === 1) {
          year = year - 1;
          month = 12;
        } else {
          month = month - 1;
        }
        break;
      case 2:
        // 上一天
        const nowMonth = new Date(`${year}-${month}-1 00:00:00`);
        const monthLength = new Date(nowMonth.getTime() - 1).getDate();
        if (date === 1) {
          date = monthLength;
          if (month === 1) {
            year = year - 1;
            month = 12;
          } else {
            month = month - 1;
          }
        } else {
          date = date - 1;
        }
        break;
      case 3:
        //上一年
        year--;
    }
    this.getStr(year, month, date);
  };
  next = () => {
    let year = this.state.year;
    let month = this.state.month;
    let date = this.state.date;
    switch (this.props.type) {
      case 1:
        // 下一月
        if (month === 12) {
          year = year + 1;
          month = 1;
        } else {
          month = month + 1;
        }
        break;
      case 2:
        // 下一天
        const nextM = month + 1 === 13 ? 1 : month + 1;
        const nowMonth = new Date(`${year}-${nextM}-1 00:00:00`);
        const monthLength = new Date(nowMonth.getTime() - 1).getDate();
        if (date === monthLength) {
          date = 1;
          if (month === 12) {
            year = year + 1;
            month = 1;
          } else {
            month = month + 1;
          }
        } else {
          date = date + 1;
        }
        break;
      case 3:
        // 下一年
        year++;
    }
    this.getStr(year, month, date);
  };

  lastSelect = () => {
    let year = this.state.year;
    let month = this.state.month;
    let date = this.state.date;
    switch (this.props.type) {
      case 1:
        // 上一年
        year = year - 1;
        break;
      case 2:
        // 上一月
        if (month === 1) {
          year = year - 1;
          month = 12;
        } else {
          month = month - 1;
        }
        const nowMonth = new Date(`${year}-${month}-1 00:00:00`);
        const monthLength = new Date(nowMonth.getTime() - 1).getDate();
        if (date > monthLength) {
          date = monthLength;
        }
        break;
    }
    this.getStr(year, month, date);
  };
  nextSelect = () => {
    let year = this.state.year;
    let month = this.state.month;
    let date = this.state.date;
    switch (this.props.type) {
      case 1:
        // 上一年
        year = year + 1;
        break;
      case 2:
        // 上一月
        if (month === 12) {
          year = year + 1;
          month = 1;
        } else {
          month = month + 1;
        }

        const nextM = month + 2 === 13 ? 1 : month + 2;
        const nowMonth = new Date(`${year}-${nextM}-1 00:00:00`);
        const monthLength = new Date(nowMonth.getTime() - 1).getDate();
        if (date > monthLength) {
          date = monthLength;
        }
        break;
    }
    this.getStr(year, month, date);
  };
  select = () => {
    if (this.props.type === 3) return;
    const box: any = document.querySelector(`#dateselect-${this.props.id}`);
    if (box) {
      if (box.style.height === '30px') {
        box.style.height = '295px';
      } else {
        box.style.height = '30px';
      }
    }
  };

  changeDay = async (day: number) => {
    let month = this.state.month;
    switch (this.props.type) {
      case 1:
        month = day;
        break;
      case 2:
        break;
    }
    this.getStr(this.state.year, month, day);
    this.select();
  };

  render() {
    return (
      <div
        className={style.dateselect}
        id={`dateselect-${this.props.id}`}
        style={{ ...this.props.style, height: '30px' }}
      >
        <div className={style.show}>
          <LeftOutlined onClick={this.last} />
          <span onClick={this.select}>{this.state.showStr}</span>
          <RightOutlined onClick={this.next} />
        </div>
        <div className={style.select}>
          <div className={style.selectTitle}>
            <LeftOutlined onClick={this.lastSelect} />
            {this.state.selectStr}
            <RightOutlined onClick={this.nextSelect} />
          </div>
          <div
            className={style.selectBody}
            style={{
              gridTemplateColumns: this.state.selectBC,
              gridTemplateRows: this.state.selectBR,
            }}
          >
            {this.props.type === 2
              ? this.state.week.map((week: string, index: number) => {
                  return (
                    <div
                      key={week}
                      style={{
                        background: '#eee',
                      }}
                    >
                      {week}
                    </div>
                  );
                })
              : null}
            {this.state.selectArray.map((day: number, index: number) => {
              return (
                <div
                  // key={day}
                  style={{
                    opacity: day === 0 ? 0 : 1,
                    background: this.state.day === day ? '#bbb' : '#eee',
                    height: this.props.type === 1 ? '40px' : '20px',
                    lineHeight: this.props.type === 1 ? '40px' : '20px',
                  }}
                  onClick={() => {
                    this.changeDay(day);
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default DateSelect;
