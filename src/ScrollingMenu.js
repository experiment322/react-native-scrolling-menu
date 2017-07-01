import React, {Component, PropTypes} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';

export default class ScrollingMenu extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    onSelect: PropTypes.func.isRequired,
    itemStyle: Text.propTypes.style,
    containerStyle: View.propTypes.style,
    selectedItemStyle: Text.propTypes.style
  };

  static defaultProps = {
    itemStyle: {
      color: 'black',
      height: '100%',
      opacity: 0.5,
      paddingHorizontal: 20
    },
    containerStyle: {
      width: '100%',
      height: 64,
      backgroundColor: 'white'
    },
    selectedItemStyle: {
      color: 'black',
      height: '100%',
      opacity: 1,
      paddingHorizontal: 20
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      widths: new Array(props.items.length),
      selected: null,
      contentWidth: 0,
      containerWidth: 0,
      containerHeight: 0
    };
  }

  scrollTo(itemNum) {
    window.requestAnimationFrame(() => {
      const {onSelect} = this.props;
      const {widths, containerWidth, contentWidth} = this.state;

      const t = widths.slice(0, itemNum).reduce((sum, val) => sum + val, 0) + widths[itemNum] / 2 - containerWidth / 2;
      const x = Math.max(Math.min(t, contentWidth - containerWidth), 0);

      this.setState({selected: itemNum});
      this.scrollView.scrollTo({x});
      onSelect(itemNum);
    });
  }

  render() {
    const {widths, selected, containerHeight: lineHeight} = this.state;
    const {items, itemStyle, containerStyle, selectedItemStyle} = this.props;
    const content = items.map((item, i) => (
      <TouchableOpacity key={i} onPress={() => this.scrollTo(i)}>
        <Text style={[{lineHeight}, itemStyle, selected === i && selectedItemStyle]}
              onLayout={({nativeEvent: {layout: {width}}}) => {
                widths[i] = width;
                this.setState({widths});
              }}>
          {item}
        </Text>
      </TouchableOpacity>
    ));
    return (
      <View style={containerStyle}
            onLayout={({nativeEvent: {layout: {width, height}}}) => this.setState({
              containerWidth: width,
              containerHeight: height
            })}>
        <ScrollView ref={r => this.scrollView = r}
                    horizontal={true}
                    onContentSizeChange={contentWidth => this.setState({contentWidth})}
                    showsHorizontalScrollIndicator={false}>
          {content}
        </ScrollView>
      </View>
    );
  }
}
