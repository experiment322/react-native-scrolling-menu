import React, {PureComponent, PropTypes} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';

export default class ScrollingMenu extends PureComponent {
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
    this.selectedDefaultItem = false;
  }

  select(itemNum) {
    const {onSelect} = this.props;
    window.requestAnimationFrame(() => {
      this.setState({selected: itemNum});
      onSelect(itemNum);
    });
  }

  scrollTo(itemNum) {
    const {widths, contentWidth, containerWidth} = this.state;
    window.requestAnimationFrame(() => {
      const widthBefore = widths.slice(0, itemNum).reduce((sum, val) => sum + val, 0);
      const itemCenter = widthBefore + widths[itemNum] / 2 - containerWidth / 2;
      const x = Math.max(Math.min(itemCenter, contentWidth - containerWidth), 0);
      this.scrollView.scrollTo({x, animated: true});
    });
  }

  componentDidUpdate() {
    const {widths, selected} = this.state;
    const {items, defaultIndex} = this.props;
    if (selected === null) {
      const calculatedWidths = widths.filter((item, i) => (i in widths));
      if (calculatedWidths.length === widths.length && defaultIndex in items && !this.selectedDefaultItem) {
        this.selectedDefaultItem = true;
        this.select(defaultIndex);
      }
    } else {
      this.scrollTo(selected);
    }
  }

  render() {
    const {widths, selected} = this.state;
    const {items, itemStyle, containerStyle, selectedItemStyle} = this.props;
    const content = items.map((item, i) => (
      <TouchableOpacity key={i}
                        disabled={selected === i}
                        onPress={() => {
                          this.select(i);
                        }}>
        <Text style={selected === i ? selectedItemStyle : itemStyle}
              onLayout={({nativeEvent}) => {
                const newWidths = widths.slice(0);
                newWidths[i] = nativeEvent.layout.width;
                this.setState({widths: newWidths});
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
