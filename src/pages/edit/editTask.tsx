import React from 'react';
import { history } from 'umi';
import { ControlType } from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css'
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
import styles from './styles/edit.less';
import app from '@/utils/app';



interface IState {
}


// 该页面用于编辑展示日记
class EditTask extends React.Component<ModelEditTask & { dispatch: any }> {
	state: IState = {
	}

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
				}
			});
		}
	}

	//在本处获取新的props并更新
	componentWillReceiveProps = (nextProps: any) => {
  };

	save = () => {
		// 在编辑器获得焦点时按下ctrl+s会执行此方法
		// 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
		this.props.dispatch({
			type: 'editTask/save',
			payload: {
				goBack: history.goBack,
			},
		});
	}

	remove = () => {
		this.props.dispatch({
			type: 'editGoal/remove',
			payload: {
				goBack: history.goBack,
			},
		});
	}

	addTag = (goal: GoalShow) => {
		let arr = this.props.tags;
		arr.push(goal)
		this.changeModelState('tags', arr);
	}
	removeTag = (index: number) => {
		let arr  = this.props.tags;
		arr.splice(index,1);
		this.changeModelState('tags', arr);
	}

	changeModelState = (proName: string, data: any) => {
		this.props.dispatch({
			type: 'editTask/changeState',
			payload: {
				[proName]: data,
			},
		});
	}



	// 详情-编辑-下拉菜单
	menu = (
		<Menu>
			<Menu.Item key="0" style={{textAlign: 'center'}}>
				<CheckOutlined style={{margin: 0}} onClick={this.save} />
			</Menu.Item>
			<Menu.Item key="1" style={{textAlign: 'center'}}>
				<DeleteOutlined style={{margin: 0}} onClick={this.remove}/>
			</Menu.Item>
		</Menu>
	);

	// 后退清空数据
	back = () => {
		this.props.dispatch({
			type: 'editTask/changeState',
          payload: {
            timeId: 0,
            txt: '',
            tags: [],
						data: null,
          }
		});
		history.goBack();
	}





	render() {
		return (
			<div className={styles.edit_task}>
				<div className={styles.title}>
					<LeftOutlined onClick={this.back} />
					{history.location.query?.timeId === 'null' ?
						'新建目标' : '编辑目标'
					}
					{history.location.query?.timeId === 'null' ?
						<CheckOutlined onClick={this.save} />
						: <Dropdown overlay={this.menu} trigger={['click']}>
						<EllipsisOutlined />
					</Dropdown>
					}
				</div>
				<div className={styles.taskbody}>
          <input 
					className={styles.txt}
          type="text" 
          value={this.props.txt}
          onChange={(e) => this.changeModelState('txt', e.target.value)}
          />
					<div className={styles.goal}>
						
						<div className={styles.tags}>
						<div>目标：</div>
						{this.props.tags.map((goal, index) => {
							return <span
							key={goal.timeId}
								 	onClick={() => this.removeTag(index)}
							>{goal.title}</span>
							})}
						</div>
						
						<div className={styles.tags}>
						<div>已存在目标：</div>
							{this.props.goaldata.map((goal) => {
								 return <span
								 key={goal.timeId}
								 	onClick={() => this.addTag(goal)}
								 >{goal.title}</span>
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
								onClick={() => {this.changeModelState('interval', {type: 1, num: 0})}}
							>无</span>
							<span 
								style={{
									color: this.props.interval.type === 2 ? '#fff' : '#000',
									background: this.props.interval.type === 2 ? '#000' : '#fff',
								}}
								onClick={() => {this.changeModelState('interval', {type: 2, num: 0})}}
							>周</span>
							<span 
							style={{
								color: this.props.interval.type === 3 ? '#fff' : '#000',
								background: this.props.interval.type === 3 ? '#000' : '#fff',
							}}
								onClick={() => {this.changeModelState('interval', {type: 3, num: 0})}}
							>间隔天数</span>
						</div>
						<div className={styles.num}>
							<div
								style={{
									display: this.props.interval.type === 2 ? 'block' : 'none',
								}}
							>
								<span
								style={{
									color: this.props.interval.num === 1 ? '#fff' : '#000',
									background: this.props.interval.num === 1 ? '#000' : '#fff',
								}}
								onClick={() => {this.changeModelState('interval', {type: 2, num: 1})}}
								>一</span>
								<span
								style={{
									color: this.props.interval.num === 2 ? '#fff' : '#000',
									background: this.props.interval.num === 2 ? '#000' : '#fff',
								}}
								onClick={() => {this.changeModelState('interval', {type: 2, num: 2})}}
								>二</span>
								<span
								style={{
									color: this.props.interval.num === 3 ? '#fff' : '#000',
									background: this.props.interval.num === 3 ? '#000' : '#fff',
								}}
								onClick={() => {this.changeModelState('interval', {type: 2, num: 3})}}
								>三</span>
								<span
								style={{
									color: this.props.interval.num === 4 ? '#fff' : '#000',
									background: this.props.interval.num === 4 ? '#000' : '#fff',
								}}
								onClick={() => {this.changeModelState('interval', {type: 2, num: 4})}}
								>四</span>
								<span
								style={{
									color: this.props.interval.num === 5 ? '#fff' : '#000',
									background: this.props.interval.num === 5 ? '#000' : '#fff',
								}}
								onClick={() => {this.changeModelState('interval', {type: 2, num: 5})}}
								>五</span>
								<span
								style={{
									color: this.props.interval.num === 6 ? '#fff' : '#000',
									background: this.props.interval.num === 6 ? '#000' : '#fff',
								}}
								onClick={() => {this.changeModelState('interval', {type: 2, num: 6})}}
								>六</span>
								<span
								style={{
									color: this.props.interval.num === 7 ? '#fff' : '#000',
									background: this.props.interval.num === 7 ? '#000' : '#fff',
								}}
								onClick={() => {this.changeModelState('interval', {type: 2, num: 7})}}
								>日</span>
							</div>
							<div
								style={{
									display: this.props.interval.type === 3 ? 'block' : 'none',
								}}
							>
								<input 
									type="number" 
									value={this.props.interval.num}
									onChange={(e) => {this.changeModelState('interval', {type: 3, num: e.target.value})}}
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