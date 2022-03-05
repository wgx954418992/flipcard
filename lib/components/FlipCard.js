'use strict';

var React = require('react');

var ReactDom = require('react-dom');

var PropTypes = require('prop-types');

var Classnames = require('classnames');

var HelpersContains = require('../helpers/contains');

var HelpersInjectStyle = require('../helpers/injectStyle');

var createClass = require('create-react-class');

HelpersInjectStyle();

module.exports = createClass({
    displayName: 'ReactFlipCard',

    propTypes: {
        type: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        containerClassName: PropTypes.string,
        containerStyle: PropTypes.object,
        cardClassName: PropTypes.string,
        cardStyle: PropTypes.object,
        flipped: PropTypes.bool,
        disabled: PropTypes.bool,
        onFlip: PropTypes.func,
        onKeyDown: PropTypes.func,
        children: function children(props, propName, componentName) {
            var prop = props[propName];

            if (React.Children.count(prop) !== 2) {
                return new Error('`' + componentName + '` ' + 'should contain exactly two children. ' + 'The first child represents the front of the card. ' + 'The second child represents the back of the card.');
            }
        }
    },

    getDefaultProps: function getDefaultProps() {
        return {
            type: 'horizontal',
            flipped: false,
            disabled: false
        };
    },

    getInitialState: function getInitialState() {
        return {
            hasFocus: false,
            isFlipped: this.props.flipped
        };
    },

    componentDidMount: function componentDidMount() {
        this._hideFlippedSide();
    },

    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        var _this = this;

        // Make sure both sides are displayed for animation
        this._showBothSides();

        // Wait for display above to take effect
        setTimeout(function () {
            _this.setState({
                isFlipped: newProps.flipped
            });
        }, 0);
    },

    componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
        // If card is flipping to back via props, track element for focus
        if (!this.props.flipped && nextProps.flipped) {
            // The element that focus will return to when flipped back to front
            this.focusElement = document.activeElement;
            // Indicates that the back of card needs focus
            this.focusBack = true;
        }

        // If isFlipped has changed need to notify
        if (this.state.isFlipped !== nextState.isFlipped) {
            this.notifyFlip = true;
        }
    },

    componentDidUpdate: function componentDidUpdate() {
        // If card has flipped to front, and focus is still within the card
        // return focus to the element that triggered flipping to the back.
        if (!this.props.flipped && this.focusElement && (0, HelpersContains)((0, ReactDom.findDOMNode)(this), document.activeElement)) {
            this.focusElement.focus();
            this.focusElement = null;
        }
            // Direct focus to the back if needed
        /* eslint brace-style:0 */
        else if (this.focusBack) {
            this.refs.back.focus();
            this.focusBack = false;
        }

        // Notify card being flipped
        if (this.notifyFlip && typeof this.props.onFlip === 'function') {
            this.props.onFlip(this.state.isFlipped);
            this.notifyFlip = false;
        }

        // Hide whichever side of the card is down
        setTimeout(this._hideFlippedSide, 600);
    },

    handleFocus: function handleFocus() {
        if (this.props.disabled) return;

        this.setState({
            isFlipped: true
        });
    },

    handleBlur: function handleBlur() {
        if (this.props.disabled) return;

        this.setState({
            isFlipped: false
        });
    },

    handleKeyDown: function handleKeyDown(e) {
        if (typeof this.props.onKeyDown === 'function') {
            this.props.onKeyDown(e);
        }
    },

    render: function render() {
        const className = {
            'ReactFlipCard': true,
            'ReactFlipCard--vertical': this.props.type === 'vertical',
            'ReactFlipCard--horizontal': this.props.type !== 'vertical',
            'ReactFlipCard--flipped': this.state.isFlipped,
            'ReactFlipCard--enabled': !this.props.disabled
        };

        return React.createElement(
            'div',
            {
                className: Classnames(this.props.className, {
                    'ReactFlipCard': true,
                    'ReactFlipCard--vertical': this.props.type === 'vertical',
                    'ReactFlipCard--horizontal': this.props.type !== 'vertical',
                    'ReactFlipCard--flipped': this.state.isFlipped,
                    'ReactFlipCard--enabled': !this.props.disabled
                }),
                style: this.props.style,
                tabIndex: 0,
                onFocus: this.handleFocus,
                onBlur: this.handleBlur,
                onKeyDown: this.handleKeyDown
            },
            React.createElement(
                'div',
                {
                    className: Classnames(this.props.containerClassName, {
                        'ReactFlipCard__Flipper': true
                    }),
                    style: this.props.containerStyle,
                },
                React.createElement(
                    'div',
                    {
                        className: Classnames(this.props.cardClassName, {
                            'ReactFlipCard__Front': true
                        }),
                        style: this.props.cardStyle,
                        ref: 'front',
                        tabIndex: -1,
                        'aria-hidden': this.state.isFlipped
                    },
                    this.props.children[0]
                ),
                React.createElement(
                    'div',
                    {
                        className: Classnames(this.props.cardClassName, {
                            'ReactFlipCard__Back': true
                        }),
                        style: this.props.cardStyle,
                        ref: 'back',
                        tabIndex: -1,
                        'aria-hidden': !this.state.isFlipped
                    },
                    this.props.children[1]
                )
            )
        );
    },

    _showBothSides: function _showBothSides() {
        this.refs.front.style.display = '';
        this.refs.back.style.display = '';
    },

    _hideFlippedSide: function _hideFlippedSide() {
        // This prevents the flipped side from being tabbable
        if (this.props.disabled) {
            if (this.state.isFlipped) {
                this.refs.front.style.display = 'none';
            } else {
                this.refs.back.style.display = 'none';
            }
        }
    }
});
