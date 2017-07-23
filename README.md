# React Native Scrolling Menu
> A horizontal scrolling menu/picker for React Native.

This is a fork. Click [here](https://github.com/ccm-innovation/react-native-scrolling-menu) for the original version.
![Demo GIF](http://i.imgur.com/w0Xa4Ry.gif)

## Installation
`npm install --save experiment322/react-native-scrolling-menu`

## Usage
```JavaScript
import React from 'react';
import ScrollingMenu from 'react-native-scrolling-menu';

const items = ['Menu Item 1','Menu Item 2','Menu Item 3','Menu Item 4','Menu Item 5'];

class Example extends React.Component {
    render() {
        return (
          <ScrollingMenu items={items} onSelect={(index) => {console.log(items[index]);}}/>
        );
    } 
}
```

## Props
|Key |Type |Description |
|--- |--- |--- |
|`items`*|array of string/number|An array of items for the menu/picker|
|`onSelect`*|function(index)|The function to be called with the index of the selected item|
|`itemStyle`|text style|The style to be applied to every item|
|`defaultIndex`|number|The index of the default selected item. Triggers onSelect|
|`containerStyle`|view style|The style to be applied to the scroll container|
|`selectedItemStyle`|text style|The style to be applied to the selected item|
