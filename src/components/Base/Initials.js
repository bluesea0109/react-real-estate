import ReactDOMServer from 'react-dom/server';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Image } from './';

const colors = [
  '#1abc9c',
  '#16a085',
  '#f1c40f',
  '#f39c12',
  '#2ecc71',
  '#27ae60',
  '#e67e22',
  '#d35400',
  '#3498db',
  '#2980b9',
  '#e74c3c',
  '#c0392b',
  '#9b59b6',
  '#8e44ad',
  '#bdc3c7',
  '#34495e',
  '#2c3e50',
  '#95a5a6',
  '#7f8c8d',
  '#ec87bf',
  '#d870ad',
  '#f69785',
  '#9ba37e',
  '#b49255',
  '#b49255',
  '#a94136',
];

export default class Initials extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    color: PropTypes.string,
    seed: PropTypes.number,
    charCount: PropTypes.number,
    textColor: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    fontSize: PropTypes.number,
    fontWeight: PropTypes.number,
    fontFamily: PropTypes.string,
    radius: PropTypes.number,
  };

  static defaultProps = {
    firstName: 'John',
    lastName: 'Doe',
    color: null,
    seed: 0,
    charCount: 1,
    textColor: '#ffffff',
    height: 100,
    width: 100,
    fontSize: 60,
    fontWeight: 400,
    fontFamily: 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
    radius: 0,
  };

  unicodeCharAt(string, index) {
    const first = string.charCodeAt(index);
    let second;

    if (first >= 0xd800 && first <= 0xdbff && string.length > index + 1) {
      second = string.charCodeAt(index + 1);

      if (second >= 0xdc00 && second <= 0xdfff) {
        return string.substring(index, index + 2);
      }
    }

    return string[index];
  }

  unicodeSlice(string, start, end) {
    let accumulator = '';
    let character;
    let stringIndex = 0;
    let unicodeIndex = 0;
    let length = string.length;

    while (stringIndex < length) {
      character = this.unicodeCharAt(string, stringIndex);

      if (unicodeIndex >= start && unicodeIndex < end) {
        accumulator += character;
      }

      stringIndex += character.length;
      unicodeIndex += 1;
    }

    return accumulator;
  }

  render() {
    const { width, height, textColor, fontFamily, fontSize, fontWeight, radius: borderRadius } = this.props;
    const firstInitial = this.unicodeSlice(this.props.firstName || 'John', 0, this.props.charCount || 1).toUpperCase();
    const lastInitial = this.unicodeSlice(this.props.lastName || 'Doe', 0, this.props.charCount || 1).toUpperCase();

    const backgroundColor = this.props.color !== null ? this.props.color : colors[Math.floor((firstInitial.charCodeAt(0) + this.props.seed) % colors.length)];

    const initials = firstInitial + lastInitial;

    const InitialSvg = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        pointerEvents="none"
        {...{
          width,
          height,
          style: {
            width,
            height,
            backgroundColor,
            borderRadius,
          },
        }}
      >
        <text
          y="50%"
          x="50%"
          dy="0.35em"
          pointerEvents="auto"
          fill={textColor}
          fontFamily={fontFamily}
          textAnchor="middle"
          style={{ fontSize, fontWeight }}
          children={initials}
        />
      </svg>
    );

    const svgHtml = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(ReactDOMServer.renderToStaticMarkup(<InitialSvg />))));

    return <Image size="mini" inline circular src={svgHtml} alt="" />;
  }
}
