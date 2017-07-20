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
    const itemCenter = layouts[itemNum].x + layouts[itemNum].width / 2 - containerWidth / 2
    const x = Math.max(Math.min(itemCenter, contentWidth - containerWidth), 0)
    this.scrollView.scrollTo({x})
  }

  componentDidUpdate (prevProps, prevState) {
    const {layouts, selected} = this.state
    const {items, defaultIndex} = this.props
    if (selected === null) {
      if (defaultIndex in items) {
        const calculatedLayouts = layouts.filter((item, i) => i in layouts)
        if (calculatedLayouts.length === layouts.length) this.select(defaultIndex)
      }
    } else if (prevState.layouts[selected] !== layouts[selected]) {
      this.scrollTo(selected)
    }
  }

  render () {
    const {layouts, selected} = this.state
    const {items, itemStyle, containerStyle, selectedItemStyle} = this.props
    const content = items.map((item, i) => (
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
          {content}
        </ScrollView>
      </View>
    )
  }
}

ScrollingMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  onSelect: PropTypes.func.isRequired,
  itemStyle: Text.propTypes.style,
  defaultIndex: PropTypes.number,
  containerStyle: View.propTypes.style,
  selectedItemStyle: Text.propTypes.style
}

ScrollingMenu.defaultProps = {
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
}
