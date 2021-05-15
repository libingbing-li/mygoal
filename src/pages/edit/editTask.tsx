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
import { ModelNote } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';
import styles from './styles/edit.less';
import app from '@/utils/app';


// // 详情-编辑-下拉菜单
// const menu = (
//   <Menu>
//     <Menu.Item key="0">
// 			<CheckOutlined onClick={this.saveNote} />
//     </Menu.Item>
//     <Menu.Item key="1">
// 			<DeleteOutlined/>
//     </Menu.Item>
//   </Menu>
// );

interface IState {
}


// 该页面用于编辑展示日记
class Edit extends React.Component<ModelNote & { dispatch: any }> {
	state: IState = {
	}

	componentDidMount() {
		const timeId = history.location.query?.timeId;
		if (!(timeId === 'null')) {
			// 详情查看
			// 在此处model数据更新
			this.props.dispatch({
				type: 'note/getData',
				payload: {
					timeId: history.location.query?.timeId,
				}
			});
		}
	}

	//在本处获取新的props并更新
	componentWillReceiveProps = (nextProps: any) => {
  };

	saveTask = () => {
		// 在编辑器获得焦点时按下ctrl+s会执行此方法
		// 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
		this.props.dispatch({
			type: 'note/save',
			payload: {
				goBack: history.goBack,
			},
		});
	}

	removeTask = () => {
		this.props.dispatch({
			type: 'note/remove',
			payload: {
				goBack: history.goBack,
			},
		});
	}

	handleEditorChange = (editorState: any) => {
		this.setState({ editorState })
	}

	changeModelState = (proName: string, data: any) => {
		this.props.dispatch({
			type: 'note/changeState',
			payload: {
				[proName]: data,
			},
		});
	}


	// 添加tag
	addTag = () => {
		
	}

	// 删除tag
	deleteTag = (index: number) => {
		let tags = this.props.tags;
		tags.splice(index, 1);
		this.changeModelState('tags', tags);
	}


	// 详情-编辑-下拉菜单
	menu = (
		<Menu>
			<Menu.Item key="0" style={{textAlign: 'center'}}>
				<CheckOutlined style={{margin: 0}} onClick={this.saveTask} />
			</Menu.Item>
			<Menu.Item key="1" style={{textAlign: 'center'}}>
				<DeleteOutlined style={{margin: 0}} onClick={this.removeTask}/>
			</Menu.Item>
		</Menu>
	);

	// 后退清空数据
	back = () => {
		this.props.dispatch({
			type: 'note/changeState',
          payload: {
            timeId: 0,
            tags: [],
            data: '',
            title: '请输入标题',
          }
		});
		history.goBack();
	}

	// 更改内容
	changeValue = (value: string) => {
		this.changeStateValue('data', value);
	}

	// 更改model的state
	changeStateValue = (name: string, value: any) => {
		this.props.dispatch({
			type: 'changeState',
			payload: {
				[name]: value,
			}
		});
	}



	render() {
		return (
			<div className={styles.edit_task}>
				<div className={styles.title}>
					<LeftOutlined onClick={this.back} />
					{history.location.query?.timeId === 'null' ?
						'新建任务' : '编辑任务'
					}
					{history.location.query?.timeId === 'null' ?
						<CheckOutlined onClick={this.saveTask} />
						: <Dropdown overlay={this.menu} trigger={['click']}>
						<EllipsisOutlined />
					</Dropdown>
					}
				</div>
				<div className={styles.body}>
					<textarea 
						rows={5}
						value={this.props.data}
						onChange={(e) => this.changeValue(e.target.value)}
					></textarea>
				</div>
				<div
					className={styles.tags}
				>
					{this.props.tags.length === 0 ? <span>暂无标签</span> :
						this.props.tags.map((tag: string, index: number) => {
							return <span key={index} onClick={() => this.deleteTag(index)}>{tag}</span>
						})
					}
				</div>
				<div className={styles.addTag}>
					<span>目标: </span>
					<input type="text" value={this.state.newtag} onChange={(e) => { this.setState({ newtag: e.target.value }) }} />
					<PlusOutlined onClick={this.addTag} />
				</div>
				
			</div>
		);
	}
}

export default connect((state: any) => ({
	...state.edit,
}))(Edit);