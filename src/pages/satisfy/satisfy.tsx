import React from 'react';
import { connect, EffectsCommandMap, Model } from 'dva';
import {
	UnorderedListOutlined,
	HighlightOutlined,
	HighlightFilled
} from '@ant-design/icons';
import SlideBox from '@/common-components/SlideBox';
import GoalBox from '../modal/databox';
import { ModelSatisfy, GoalShow } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/satisfy.less';
import app from '@/utils/app';

const data: any = [
	'第一周',
	'4月',
	'4.13',
	'4.14',
	'4.10',
	'4.11',
	'4.12',
	'4.13',
	'4.14',
	'4.10',
	'4.11',
	'4.12',
	'4.13',
	'4.14',
]


interface IState {
	timeArray: Array<string>;
	timeType: number;
	timeStr: string;
	goalTimeShowWidth: string;
	top: string;
	left: string;
	data: GoalShow | null; //当前选中的目标
}

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


// 用于展示tag数和时间的分布
class Satisfy extends React.Component< ModelSatisfy & { dispatch: any}> {
	state: IState = {
		timeArray: data,
		timeType: 1,
		timeStr: new Date().getFullYear() + ' · 日',
		goalTimeShowWidth: '360px',
		top: '0px',
		left: '0px',
		data: goaldata,
	}

	componentDidMount = () => {
		this.setTimeType(1);
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
    const tw: any = timeInterval?.offsetWidth; //真实宽度
		const tBw: any = tBox?.clientWidth; //可见宽度
		// 获取手指第一次的坐标
		let tX = 0;
		timeInterval?.addEventListener('touchstart',(e: any) => {
      tX = e.changedTouches[0].clientX; //记录手指第一次触碰屏幕的坐标点
    });
		// 获取当前的left (如果为auto的话，就要从当前的right来计算left值了 *本处不做auto预防处理，是因为left通过state中数据计算)
		let tleft = Number(timeInterval.style.left.substring(0,timeInterval.style.left.length - 2)); 
    timeInterval?.addEventListener('touchmove', (e: any) => {
			console.log(tw, tBw)
			if(tw <= tBw) return; //如果内容盒子的宽度不如包裹盒子长，那么就不能移动
      // 记录移动的距离
      let x = e.changedTouches[0].clientX - tX;
      tX = e.changedTouches[0].clientX;
      tleft = tleft + x;
      if(tleft >= 0){
        tleft = 0; //>=0的话，说明左边顶部距离盒子边框有距离
      } else if ((tBw - tleft - tw) > 0 ){
        tleft = tBw - tw - 0; //tBw - tleft - tw > 0， 说明盒子减去内容盒子的宽度（此时默认内容盒子宽度比盒子要长，剩余的应该是left的最大负值，假设>0，那么说明右边会有空隙
      }
			this.setState({
				left: tleft + 'px',
			})
    });
    timeInterval?.addEventListener('touchend', (e: any) => {
			if(tw <= tBw) return;
      let x = e.changedTouches[0].clientX - tX;
      tleft = tleft + x;
			if(tleft >= 0){
        tleft = 0;
      } else if ((tBw - tleft - tw) > 0 ){
        tleft = tBw - tw - 0;
      }
			this.setState({
				left: tleft + 'px',
			})
    });
		/*
		目标轴： 上下移动时间轴，可以更改目标轴的top，同时也将显示表的top更改
		*/
		// 移动元素和包裹盒子的宽
    const gh: any = goalBox?.offsetHeight; //真实高度
		const gBh: any = gBox?.clientHeight; //可见高度
		// 获取手指第一次的坐标
		let gY = 0;
		goalBox?.addEventListener('touchstart',(e: any) => {
      gY = e.changedTouches[0].clientY; //记录手指第一次触碰屏幕的坐标点
    });
		// 获取当前的left (如果为auto的话，就要从当前的right来计算left值了 *本处不做auto预防处理，是因为left通过state中数据计算)
		let gtop = Number(goalBox.style.top.substring(0,goalBox.style.top.length - 2)); 
    goalBox?.addEventListener('touchmove', (e: any) => {
			if(gh <= gBh) return;
      // 记录移动的距离
      let y = e.changedTouches[0].clientY - gY;
      gY = e.changedTouches[0].clientY;
      gtop = gtop + y;
      if(gtop >= 0){
        gtop = 0;
      } else if ((gBh - gtop - gh) > 0 ){
        gtop = gBh - gh - 0; 
      }
			this.setState({
				top: gtop + 'px',
			})
			console.log('goalbox'+gtop);
    });
    goalBox?.addEventListener('touchend', (e: any) => {
			if(gh <= gBh) return;
      let y = e.changedTouches[0].clientY - gY;
      gtop = gtop + y;
			console.log(gBh - gtop - gh, gBh, gh)
			if(gtop >= 0){
        gtop = 0;
      } else if ((gBh - gtop - gh) > 0 ){
        gtop = gBh - gh - 0;
      }
			this.setState({
				top: gtop + 'px',
			})
			console.log('goalbox'+gtop);
    });
		/*
		展示表： 左右上下移动
		*/
		// 移动元素和包裹盒子的宽
    const gTw: any = goalTimeShowBox?.offsetWidth; //真实宽度
		const gTh: any = goalTimeShowBox?.offsetHeight;
		const gTBw: any = gTBox?.clientWidth; //可见宽度
		const gTBh: any = gTBox?.clientHeight;
		// 获取手指第一次的坐标
		let gTX = 0;
		let gTY = 0;
		goalTimeShowBox?.addEventListener('touchstart',(e: any) => {
      gTX = e.changedTouches[0].clientX; //记录手指第一次触碰屏幕的坐标点
			gTY = e.changedTouches[0].clientY;
		});
		// 获取当前的left 如果为auto的话，就要从当前的right来计算left值了
		let gTleft = Number(goalTimeShowBox.style.left.substring(0,goalTimeShowBox.style.left.length - 2));
		let gTtop = Number(goalTimeShowBox.style.top.substring(0,goalTimeShowBox.style.top.length - 2));
    goalTimeShowBox?.addEventListener('touchmove', (e: any) => {
			if(gTw > gTBw) {
				let x = e.changedTouches[0].clientX - gTX;
      gTX = e.changedTouches[0].clientX;
      gTleft = gTleft + x;
			if(gTleft >= 0){
        gTleft = 0;
      } else if ((gTBw - gTleft - gTw) > 0 ){
        gTleft = gTBw - gTw - 0;
      }
			this.setState({
				left: gTleft + 'px',
			})
			}
			if(gTh > gTBh) {// 记录移动的距离
				let y = e.changedTouches[0].clientY - gTY;
				gTY = e.changedTouches[0].clientY;
				gTtop = gTtop + y;
				
				
				if(gTtop >= 0){
					gTtop = 0;
				} else if ((gTBh - gTtop - gTh) > 0 ){
					gTtop = gTBh - gTh - 0;
				}
				this.setState({
					top: gTtop + 'px',
				})
			}
    });
    goalTimeShowBox?.addEventListener('touchend', (e: any) => {
			if(gTw > gTBw) {
				
				let x = e.changedTouches[0].clientX - gTX;
      gTleft = gTleft + x;
			if(gTleft >= 0){
        gTleft = 0;
      } else if ((gTBw - gTleft - gTw) > 0 ){
        gTleft = gTBw - gTw - 0;
      }
			this.setState({
				left: gTleft + 'px',
			})
			}
			if(gTh > gTBh) {// 记录移动的距离
				
			let y = e.changedTouches[0].clientY - gTY;
				gTY = e.changedTouches[0].clientY;
				gTtop = gTtop + y;
				
				
				if(gTtop >= 0){
					gTtop = 0;
				} else if ((gTBh - gTtop - gTh) > 0 ){
					gTtop = gTBh - gTh - 0;
				}
				this.setState({
					top: gTtop + 'px',
				})
			}
    });
  }

	setTimeType = (type: number ) => {
		if(type === 0) {
			type = this.state.timeType;
			type++;
		}
		if(type === 4) {
			type = 1;
		}
		let str = '';
		switch(type) {
			case 1:
				str = new Date().getFullYear() + ' · 日';
				this.getTimeArray(1);
				this.goalTimeShow(1);
				break;
			case 2:
				str = new Date().getFullYear() + ' · 周';
				this.getTimeArray(2);
				this.goalTimeShow(2);
				break;
			case 3: 
			str = new Date().getFullYear() + ' · 月';
			this.getTimeArray(3);
				this.goalTimeShow(3);
			 break;
		}
		this.setState({
			timeType: type,
			timeStr: str,
		})
		let nowTime = new Date().getTime(); //获取到今天的时间，默认展示30天
	}

	getTimeArray = (type: number) => {
		// day: 30 week: 24 month: 30
	}

	goalTimeShow = (type: number) => {}

	setData = (goal: GoalShow) => {
		console.log('setData');
		this.setState({
			data: goal,
		})
		const dataBox: any = document.querySelector('#dataBox');
		dataBox.style.bottom = '0px';
	}

	dataBoxClose = () => {
		const dataBox: any = document.querySelector('#dataBox');
		dataBox.style.bottom = '-50vh';
	}



	render() {
		return (
      <div className={styles.satisfy}>
        <div className={styles.dateBar}>
					<div 
						className={styles.year}
						onClick={() => {this.setTimeType(0)}}
					>{this.state.timeStr}</div>
					<div className={styles.timeIntervalBox}>
					<div 
						className={styles.timeInterval} 
						id="timeInterval"
						style={{
							left: this.state.left,
						}}
					> 
					{this.state.timeArray.map((time: string) => {
						return <div>{time}</div>;
					})}
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
					{this.props.goaldata.map((goal: GoalShow) => {
						return <div 
							key={goal.timeId}
							className={styles.goal} 
							onClick={() =>　this.setData(goal)}
							>{goal.title}</div>;
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
						width: this.state.goalTimeShowWidth
					}}
				>
					{this.props.taskSatisfy.map((done: boolean) => {
						return (
							<div className={styles.goalTimeShow_box}>
								<div style={{
									display: done ? 'block' : 'none'
								}}></div>
							</div>
						);
					})}
				</div>
				</div>
				</div>
				<GoalBox 
					data={this.state.data}
					close={this.dataBoxClose}
				></GoalBox>
			</div>
		);
	}
}

export default connect((state: any) => ({
	...state.satisfy,
}))(Satisfy);