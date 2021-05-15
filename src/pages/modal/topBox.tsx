import React from 'react';
import { connect } from 'dva';
import {
  HomeOutlined,
  HomeFilled,
  CarryOutOutlined,
  CarryOutFilled,
  SnippetsOutlined,
  SnippetsFilled,
  PlusOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  StarFilled
} from '@ant-design/icons';
import { ModelIndex } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';


interface IProps {
  str: string;
}
class TopBox extends React.Component<IProps & ModelIndex & {infoNote: string; nowNote: string; dispatch: any}> {
  // 方法
  // 下载全部数据
  saveFile = () => {
    this.props.dispatch({type: 'index/saveJson'});
  }
  // 导入全部数据
  importFile = () => {
    this.props.dispatch({type: 'index/importJson'});
    // const file: any = document.getElementById('file');
    // console.log(file.files[0]);
    // if(file.files[0]){
    //   let selectedFile = file.files[0];
    //   this.props.dispatch({
    //     type: 'index/importJson',
    //     payload: {
    //       selectedFile,
    //     }
    //   });
    // }
  }



  // 渲染
  renderBox = () => {
    let div = <div></div>;
    switch(this.props.str) {
      case 'refresh': 
        div = (
          <div className={commonStyle.topBox} id="refreshBox" style={{top: '-15vh'}}>
            <ReloadOutlined spin />
          </div>
        );
        break;
      case 'set':
        div = (
        <div 
          className={`${commonStyle.topBox} ${commonStyle.setBox}`} 
          id="setBox" 
        >
          {/* <input type="file" name="" id="file" onChange={this.importFile} style={{display: 'none'}}/>
          <VerticalAlignBottomOutlined onClick={this.saveFile}/>
          <label htmlFor="file">
            <VerticalAlignTopOutlined/>
          </label> */}
          <textarea 
            id="setInput"
            // readOnly
            placeholder="点击导出获取json文本或粘贴json文本导入(导入会覆盖原先的数据)"
            style={{
              width:'80%',
              height: '60%',
              borderRadius: '5px',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: 500,
              color: '#000',
              boxSizing: 'border-box',
              padding: '10px',
            }}
          />
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '90%',
            }}
          >
            <VerticalAlignBottomOutlined onClick={this.saveFile}/>
            <VerticalAlignTopOutlined onClick={this.importFile}/>
          </div>
        </div>
        );
        break;
    }
    return div;
  }
  render() {
    return this.renderBox();
  }
} 
export default connect((state: any) => ({
  ...state.index,
  ...state.info,
  nowNote: state.now.nowNote
}))(TopBox);

