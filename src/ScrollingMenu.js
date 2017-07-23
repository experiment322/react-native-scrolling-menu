import React, { PureComponent } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

export default class ScrollingMenu extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      layouts: new Array(props.items.length),
      selected: null,
      contentWidth: null,
      containerWidth: null
    }
  }

  select (itemNum) {
    const {onSelect} = this.props
    window.requestAnimationFrame(() => { onSelect(itemNum) })
    this.setState({selected: itemNum})
    this.scrollTo(itemNum)
  }

  scrollTo (itemNum) {
    const {layouts, contentWidth, containerWidth} = this.state
    const offset = layouts[itemNum].x + layouts[itemNum].width / 2 - containerWidth / 2
    this.scrollView.scrollTo({x: Math.max(0, Math.min(offset, contentWidth - containerWidth))})
  }

  componentDidUpdate (prevProps, prevState) {
    const {defaultIndex} = this.props
    const {layouts, selected, contentWidth, containerWidth} = this.state
    if (selected === null) {
      if (defaultIndex in layouts && containerWidth && contentWidth) {
        this.select(defaultIndex)
      }
    } else if (prevState.layouts[selected] !== layouts[selected]) {
      this.scrollTo(selected)
    }
  }

  renderItems () {
    const {layouts, selected} = this.state
    const {items, itemStyle, selectedItemStyle} = this.props
    return items.map((item, i) => (
      <TouchableOpacity
        key={i}
        disabled={selected === i}
        onPress={() => { this.select(i) }}
        onLayout={({nativeEvent: {layout: itemLayout}}) => {
          this.setState({layouts: Object.assign(layouts.slice(0), {[i]: itemLayout})})
        }}
      >
        <Text style={selected === i ? selectedItemStyle : itemStyle}>
          {item}
        </Text>
      </TouchableOpacity>
    ))
  }

  render () {
    const {containerStyle} = this.props
    return (
      <View
        style={containerStyle}
        onLayout={({nativeEvent: {layout: {width: containerWidth}}}) => { this.setState({containerWidth}) }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={r => { this.scrollView = r }}
          onContentSizeChange={contentWidth => { this.setState({contentWidth}) }}
        >
          {this.renderItems()}
        </ScrollView>
      </View>
    )
  }
}

ScrollingMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  onSelect: PropTypes.func.isRequired,
  itemStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.object]),
  defaultIndex: PropTypes.number,
  containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.object]),
  selectedItemStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.object])
}

ScrollingMenu.defaultProps = {
  itemStyle: {
    color: 'black',
    height: '100%',
    opacity: 0.5,
    paddingHorizontal: 16
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
    paddingHorizontal: 16
  }
}
