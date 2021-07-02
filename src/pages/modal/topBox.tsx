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
  StarFilled,
} from '@ant-design/icons';
import { ModelIndex } from '../../utils/interface';
import commonStyle from '@/common-styles/common.less';

interface IProps {
  // str: string;
}
class TopBox extends React.Component<
  IProps & ModelIndex & { infoNote: string; nowNote: string; dispatch: any }
> {
  // 渲染
  renderBox = () => {
    let div = <div></div>;
    div = (
      <div
        className={commonStyle.topBox}
        id="refreshBox"
        style={{ top: '-15vh' }}
      >
        <ReloadOutlined spin />
      </div>
    );
    return div;
  };
  render() {
    return this.renderBox();
  }
}
export default connect((state: any) => ({
  ...state.index,
}))(TopBox);
