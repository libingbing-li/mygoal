import React from 'react';
import moment from 'moment';
import { history } from 'umi';
import { connect, EffectsCommandMap, Model } from 'dva';
import KeepAlive, { AliveScope } from 'react-activation';
import {
  UnorderedListOutlined,
  HighlightOutlined,
  ClockCircleFilled,
  ClockCircleOutlined,
  CheckSquareFilled,
  CheckSquareOutlined,
  TrophyFilled,
  TrophyOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import SlideBox from '@/common-components/SlideBox';
import TopBox from './modal/topBox';
import Sidebar from './modal/sidebar';
import HistoryShow from './historyshow/historyshow';
import Task from './task/task';
import Satisfy from './satisfy/satisfy';
import { ModelIndex } from '../utils/interface';
import indexedDB from '../utils/indexedDB';
import commonStyle from '@/common-styles/common.less';
import styles from './index.less';
import app from '@/utils/app';

interface IState {
  pageNum: number; //该应用共有几个页面
  nowPage: number; //当前处于哪个页面
}

class Index extends React.Component<ModelIndex & { dispatch: any }> {
  state: IState = {
    pageNum: 3,
    nowPage: this.props.nowPage,
  };

  componentDidMount = async () => {
    moment.locale('zh-cn');
    console.log(this.props.nowPage);
    this.props.dispatch({
      type: 'index/openDB',
    });
  };

  // 下拉行为 - 刷新
  slideBottom = (e: any) => {
    // 刷新
    const refreshBox: any = document.querySelector(`#refreshBox`);
    const page: any = document.querySelector(
      `#index-page${this.state.nowPage}`,
    );
    const navbar: any = document.querySelector(`#navbar`);
    // let scrollTopNoZero = false;
    // switch(this.state.nowPage) {
    // 	case 1:
    // 	const t1: any = document.querySelector('#time-page1');
    // 	const t2: any = document.querySelector('#time-page2');
    // 	const t3: any = document.querySelector('#time-page3');
    // 	console.log(t3);
    // 	if(t1.scrollTop !== 0 ||
    // 		t2.scrollTop !== 0 ||
    // 		t3.scrollTop !== 0
    // 		) {
    // 			scrollTopNoZero = true;
    // 		}
    // 	break;
    // 	case 2:
    // 		if(page.lastElementChild.lastElementChild.scrollTop !== 0 ) {
    // 			scrollTopNoZero = true;
    // 		}
    // 		break;
    // 	case 3:
    // 	const i1: any = document.querySelector('#info-page1');
    // 		const i2: any = document.querySelector('#info-page2');
    // 		const i3: any = document.querySelector('#info-page3');
    // 		if(i1.scrollTop !== 0 ||
    // 			i2.scrollTop !== 0 ||
    // 			i3.scrollTop !== 0
    // 			) {
    // 				scrollTopNoZero = true;
    // 			}
    // 		break;
    // }
    // console.log(scrollTopNoZero);
    // if(scrollTopNoZero) {
    // 	return;
    // }
    refreshBox.style.top = '0vh';
    navbar.style.marginTop = '15vh';
    if (this.state.nowPage === 3) {
      this.props.dispatch({
        type: 'task/init',
      });
    } else if (this.state.nowPage === 1) {
      this.props.dispatch({
        type: 'satisfy/init',
      });
    } else {
      this.props.dispatch({
        type: 'historyshow/init',
      });
    }
    setTimeout(() => {
      refreshBox.style.top = '-15vh';
      navbar.style.marginTop = '0vh';
    }, 1000);
  };
  // 左滑行为
  slideLeft = () => {
    console.log('slideLeft');
    if (this.state.nowPage == 1) {
      return;
    }
    for (let i = 1; i <= this.state.pageNum; i++) {
      const page: any = document.querySelector(`#index-page${i}`);
      let left = Number(
        page.style.left.substring(0, page.style.left.length - 2),
      );
      page.style.left = left + 100 + 'vw';
    }
    this.setState((state: any) => {
      if (state.nowPage - 1 === 2) {
        this.props.dispatch({
          type: 'historyshow/init',
        });
      } else if (state.nowPage - 1 === 1) {
        this.props.dispatch({
          type: 'task/init',
        });
      } else {
        this.props.dispatch({
          type: 'satisfy/init',
        });
      }
      this.props.dispatch({
        type: 'index/changeState',
        payload: {
          nowPage: state.nowPage - 1,
        },
      });
      return {
        nowPage: state.nowPage - 1,
      };
    });
    this.sidebarClose();
  };
  // 右滑行为
  slideRight = () => {
    console.log('slideRight');
    if (this.state.nowPage == this.state.pageNum) {
      return;
    }
    for (let i = this.state.pageNum; i >= 1; i--) {
      const page: any = document.querySelector(`#index-page${i}`);
      let left = Number(
        page.style.left.substring(0, page.style.left.length - 2),
      );
      page.style.left = left - 100 + 'vw';
    }
    this.setState((state: any) => {
      if (state.nowPage + 1 === 2) {
        this.props.dispatch({
          type: 'historyshow/init',
        });
      } else if (state.nowPage + 1 === 1) {
        this.props.dispatch({
          type: 'task/init',
        });
      } else {
        this.props.dispatch({
          type: 'satisfy/init',
        });
      }
      this.props.dispatch({
        type: 'index/changeState',
        payload: {
          nowPage: state.nowPage + 1,
        },
      });
      return {
        nowPage: state.nowPage + 1,
      };
    });
    this.sidebarClose();
  };

  // 点击切换
  checkTab = (page: number) => {
    if (page > this.state.nowPage) {
      // 右滑
      for (let i = this.state.nowPage; i < page; i++) {
        this.slideRight();
      }
    } else {
      // 左滑
      for (let i = this.state.nowPage; i > page; i--) {
        this.slideLeft();
      }
    }
  };

  // 侧边栏
  sidebarShow = () => {
    console.log('sidebarShow');
    const sidebar: any = document.querySelector(`#sidebar`);
    const page: any = document.querySelector(
      `#index-page${this.state.nowPage}`,
    );
    const navbar: any = document.querySelector(`#navbar`);
    const tabBar: any = document.querySelector(`#tabBar`);
    if (sidebar.style.left === '-200px') {
      sidebar.style.left = '0';
      page.style.left = '200px';
      navbar.style.left = '200px';
      tabBar.style.left = '200px';
    } else {
      sidebar.style.left = '-200px';
      page.style.left = '0vh';
      navbar.style.left = '0vh';
      tabBar.style.left = '0vh';
    }
  };
  // 关闭侧边栏
  sidebarClose = () => {
    console.log('sidebarClose');
    const sidebar: any = document.querySelector(`#sidebar`);
    const page: any = document.querySelector(
      `#index-page${this.state.nowPage}`,
    );
    const navbar: any = document.querySelector(`#navbar`);
    const tabBar: any = document.querySelector(`#tabBar`);
    sidebar.style.left = '-200px';
    page.style.left = '0vh';
    navbar.style.left = '0vh';
    tabBar.style.left = '0vh';
  };

  // 点击页面
  pageClick = () => {
    console.log('pageClick');
    // 当侧边栏存在，点击关闭
    const sidebar: any = document.querySelector(`#sidebar`);
    if (sidebar.style.left !== '-200px') {
      this.sidebarClose();
    }
  };

  // 进入添加任务
  add = () => {
    if (this.state.nowPage === 3) {
      history.push('/editGoal?timeId=null');
    } else {
      history.push('/editTask?timeId=null');
    }
  };

  render() {
    return (
      <AliveScope>
        <div id={styles.index}>
          {/* 刷新层 */}
          <TopBox></TopBox>
          {/* 侧边栏 */}
          <Sidebar
            style={{
              left: '-200px',
            }}
          ></Sidebar>
          {/* 新建日记 */}
          {/* 顶栏 */}
          <div
            id="navbar"
            className={commonStyle.navbar}
            style={{
              left: '0px',
            }}
          >
            <UnorderedListOutlined onClick={this.sidebarShow} />
            <span>MyGoal</span>
            {/* <span onClick={this.checkTab}>
						{this.state.nowPage === 1 ? 'MyNote' : 'Satisfy'}
					</span> */}
            <PlusOutlined onClick={this.add} />
          </div>
          {/* page */}
          <div
            className={styles.pageBox}
            id="index-page"
            onClick={this.pageClick}
          >
            <SlideBox
              id="index"
              slideDistance={200}
              slideLeft={this.slideLeft}
              slideRight={this.slideRight}
              slideBottom={this.slideBottom}
            >
              <div
                id="index-page1"
                className={styles.page}
                style={{ left: `${-(this.state.nowPage * 100 - 100)}vw` }}
              >
                <HistoryShow></HistoryShow>
              </div>
              <div
                id="index-page2"
                className={styles.page}
                style={{ left: `${-(this.state.nowPage * 100 - 200)}vw` }}
              >
                <Task></Task>
              </div>
              <div
                id="index-page3"
                className={styles.page}
                style={{ left: `${-(this.state.nowPage * 100 - 300)}vw` }}
              >
                <Satisfy></Satisfy>
              </div>
            </SlideBox>
          </div>
          {/* 底栏 */}
          <div
            id="tabBar"
            style={{
              left: '0px',
            }}
            className={styles.tabBar}
          >
            <div onClick={() => this.checkTab(1)}>
              {this.state.nowPage == 1 ? (
                <ClockCircleFilled />
              ) : (
                <ClockCircleOutlined />
              )}
            </div>
            <div onClick={() => this.checkTab(2)}>
              {this.state.nowPage == 2 ? (
                <CheckSquareFilled />
              ) : (
                <CheckSquareOutlined />
              )}
            </div>
            <div onClick={() => this.checkTab(3)}>
              {this.state.nowPage == 3 ? <TrophyFilled /> : <TrophyOutlined />}
            </div>
          </div>
        </div>
      </AliveScope>
    );
  }
}

export default connect((state: any) => ({
  ...state.index,
}))(Index);
