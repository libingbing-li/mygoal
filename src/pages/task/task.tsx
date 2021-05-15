import React from 'react';
import {history} from 'umi';
import moment from 'moment';
import { connect, EffectsCommandMap, Model } from 'dva';
import { DatePicker } from 'antd';
import {
	CheckOutlined,
} from '@ant-design/icons';
import { ModelTask, TaskShow } from '../../utils/interface';
import indexedDB from '../../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/task.less';
import app from '@/utils/app';
import './styles/antd.css';



interface IState {
}
// 展示日记，可以点击进入详情
class Task extends React.Component<ModelTask & {dispatch: any}> {
	state: IState = {
	}

	componentDidMount = () => {
		this.props.dispatch({
			type: 'task/openDB'
		});
	}


	showTask = (item: TaskShow) => {
		return (
			<div className={styles.taskShow} key={item.timeId} onClick={() => history.push(`/note?timeId=${item.timeId}`)}>
				<div className={styles.taskShow_body}>
					<div className={styles.taskShow_check}>
					</div>
					<div className={styles.taskShow_txt}>
						{item.txt}
					</div>
				</div>
				<div className={styles.taskShow_tags}>
					{item.tags.map((tag: string, index: number) => {
						return <span key={index}>{tag}</span>
					})}
				</div>
			</div>
		);
	}

	
	render() {
		return (
      <div className={styles.task}>
				{this.props.taskdata.length === 0 ? 
					<div className={styles.nothing}>没有未完成任务~</div>
				: this.props.taskdata.map((item: TaskShow) => {
					return	this.showTask(item);
				})
				}
      </div>
		);
	}
}

export default connect((state: any) => ({
	...state.task,
}))(Task);