import React from 'react';
import app from '@/utils/app';

interface IProps {
  id: string;
  slideLeft?: (e?: any, payload?:any) => void;
  slideRight?: (e?: any, payload?:any) => void;
  slideTop?: (e?: any, payload?:any) => void;
  slideBottom?: (e?: any, payload?:any) => void;
  payload?: any; //传递过来的需要在slide函数中使用的参数
  slideDistance: number;  //滑动事件判定距离
};
class SlideBox extends React.Component<IProps> {
  static defaultProps = {
    slideDistance: 50,
  }
  componentDidMount = () => {
    // 获取到需要
    const index: any = document.querySelector(`#slideBox-${this.props.id}`);
    let indexX = 0;
    let indexY = 0;
    index?.addEventListener('touchstart',(e: any) => {
      indexX = e.changedTouches[0].clientX; //记录手指第一次触碰屏幕的坐标点
      indexY = e.changedTouches[0].clientY;
    });
    index?.addEventListener('touchend', (e: any) => {
      if((e.changedTouches[0].clientX - indexX) > this.props.slideDistance && this.props.slideLeft) {
        // 向左滑 从左到右
        if(this.props.payload) {
          this.props.slideLeft(e, this.props.payload);
          return;
        }
        this.props.slideLeft(e);
      } else if((indexX - e.changedTouches[0].clientX) > this.props.slideDistance && this.props.slideRight) {
        // 向右滑 从右到左
        if(this.props.payload) {
          this.props.slideRight(e, this.props.payload);
          return;
        }
        this.props.slideRight(e);
      } else if((e.changedTouches[0].clientY - indexY) > this.props.slideDistance && this.props.slideBottom) {
        // 下拉
        if(this.props.payload) {
          this.props.slideBottom(e, this.props.payload);
          return;
        }
        this.props.slideBottom(e);
      } else if((indexY - e.changedTouches[0].clientY) > this.props.slideDistance && this.props.slideTop) {
        // 上拉
        if(this.props.payload) {
          this.props.slideTop(e, this.props.payload);
          return;
        }
        this.props.slideTop(e);
      }
    });
  }

  render() {
    return (
      <div id={`slideBox-${this.props.id}`} style={{width: '100%', height: '100%'}}>
        {this.props.children}
      </div>
    );
  }
}

export default SlideBox;


/* 
组件功能: 获取上下左右滑动事件并执行对应代码;
*/