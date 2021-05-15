import React from 'react';
import {History, history} from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import { DatePicker } from 'antd';
import {
  CheckOutlined
} from '@ant-design/icons';
import { HistoryShow, ModelHistoryShow } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/historyshow.less';
import app from '@/utils/app';
import './styles/antd.css';



interface IState {
}
// 展示日记，可以点击进入详情
class HistoryShowList extends React.Component<ModelHistoryShow & {dispatch: any}> {
	state: IState = {
	}

	componentDidMount = () => {
		// this.props.dispatch({
		// 	type: 'show/openDB'
		// });
	}

	showHistory = (item: HistoryShow) => {
		return (
			<div className={styles.historyShowBox} key={item.timeId}>
				<div className={styles.historyShow_time}>
				<CheckOutlined />
					{moment(item.timeId).fromNow()}
				</div>
				<div className={styles.historyShow_data}>
					{item.taskArray.map((task: string, index: number) => {
						return <div key={index}>{task}</div>
					})}
				</div>
				<div className={styles.historyShow_tags}>
					{item.tags.map((tag: string, index: number) => {
						return <span key={index}>{tag}</span>
					})}
				</div>
			</div>
		);
	}

	onChange = (date: any, dateString: string) => {
		let maxTime = new Date(`${moment(date).year()}-${moment(date).month() + 2}`);
		if(moment(date).month() === 11) {
			maxTime = new Date(`${moment(date).year() + 1}-1`)
		}
		this.props.dispatch({
			type: 'show/init',
			payload: {
				minTime: new Date(dateString).getTime(),
				maxTime: maxTime.getTime(),
			}
		});
	}

	render() {
		return (
      <div className={styles.historyshow}>
				{/* <DatePicker 
					onChange={this.onChange} 
					picker="month"  
					value={this.props.minTime === 0 ? moment() : moment(this.props.minTime)}
				/> */}
				{this.props.historydata.length === 0 ? 
					<div className={styles.nothing}>当前还没有任务记录，去看看任务吧~</div>
				: this.props.historydata.map((item: HistoryShow) => {
					return	this.showHistory(item);
				})
				}
      </div>
		);
	}
}

export default connect((state: any) => ({
	...state.historyshow,
}))(HistoryShowList);