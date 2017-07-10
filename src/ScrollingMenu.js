import React, {Component, PropTypes} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';

export default class ScrollingMenu extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    onSelect: PropTypes.func.isRequired,
    itemStyle: Text.propTypes.style,
    defaultIndex: PropTypes.number,
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
      contentWidth: null,
      containerWidth: null
    };
  }

  scrollTo(itemNum) {
    const {onSelect} = this.props;
    const {selected, widths, contentWidth, containerWidth} = this.state;
    window.requestAnimationFrame(() => {
      const t = widths.slice(0, itemNum).reduce((sum, val) => sum + val, 0) + widths[itemNum] / 2 - containerWidth / 2;
      this.scrollView.scrollTo({
        x: Math.max(Math.min(t, contentWidth - containerWidth), 0)
      });
      if (selected !== itemNum) {
        this.setState({selected: itemNum});
        onSelect(itemNum);
      }
    });
  }

  componentDidUpdate() {
    const {widths, selected} = this.state;
    const {items, defaultIndex} = this.props;
    const calculatedWidths = widths.filter((item, i) => (i in widths));
    if (!(selected in items) && defaultIndex in items && calculatedWidths.length === widths.length) {
      this.scrollTo(defaultIndex);
    }
  }

  render() {
    const {widths, selected} = this.state;
    const {items, itemStyle, containerStyle, selectedItemStyle} = this.props;
    const content = items.map((item, i) => (
      <TouchableOpacity key={i}
                        onPress={() => {
                          this.scrollTo(i);
                        }}>
        <Text style={selected === i ? selectedItemStyle : itemStyle}
              onLayout={({nativeEvent}) => {
                widths[i] = nativeEvent.layout.width;
                this.forceUpdate();
              }}>
          {item}
        </Text>
      </TouchableOpacity>
    ));
    return (
      <View style={containerStyle}
            onLayout={({nativeEvent}) => {
              this.setState({
                containerWidth: nativeEvent.layout.width
              });
            }}>
        <ScrollView horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    ref={r => {
                      this.scrollView = r;
                    }}
                    onContentSizeChange={contentWidth => {
                      this.setState({contentWidth});
                    }}>
          {content}
        </ScrollView>
      </View>
    );
  }
}
