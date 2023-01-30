"use strict";

var React = require("react");
var reactDom = require("react-dom");
function _extends() {
  _extends = Object.assign
    ? Object.assign.bind()
    : function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
  return _extends.apply(this, arguments);
}
function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z =
  "#tooltip{word-wrap:normal;-webkit-animation:fade var(--animationDuration) cubic-bezier(.55,.085,.68,.53) both;animation:fade var(--animationDuration) cubic-bezier(.55,.085,.68,.53) both;display:none;font-size:var(--fontSize);font-style:normal;font-weight:400;left:50px;letter-spacing:normal;line-height:1.42857143;opacity:0;position:absolute;text-align:left;text-align:start;text-shadow:none;text-transform:none;top:50px;transition:opacity .5s ease-in-out;white-space:normal;word-break:normal;word-spacing:normal;z-index:1000000000}#tooltip.right{margin-left:5px}#tooltip.right .tooltip-arrow{border-right-color:var(--backgroundColor);border-width:5px 5px 5px 0;left:auto;margin-left:-5px;top:50%}#tooltip.left{margin-left:-5px}#tooltip.left .tooltip-arrow{border-left-color:var(--backgroundColor);border-width:5px 0 5px 5px;left:auto;margin-top:-5px;right:-5px;top:50%}#tooltip.top{margin-top:-5px}#tooltip.top .tooltip-arrow{border-top-color:var(--backgroundColor);border-width:5px 5px 0;bottom:-5px;left:50%;margin-left:-5px;top:auto}#tooltip.bottom{margin-top:5px}#tooltip.bottom .tooltip-arrow{border-bottom-color:var(--backgroundColor);border-width:0 5px 5px;left:50%;margin-left:-5px;top:0}#tooltip .tooltip-arrow{border:5px solid transparent;border-left-width:0;height:0;left:0;margin-top:-5px;position:absolute;top:50%;width:0}#tooltip .tooltip-inner{background-color:var(--backgroundColor);border-radius:4px;color:var(--color);max-width:200px;padding:3px 8px;text-align:center}#tooltip .tooltip-inner .tooltip-list{font-size:var(--fontSize);list-style-type:disc;max-width:200px;overflow:auto;padding:3px 8px;text-align:left;text-transform:capitalize}#tooltip .tooltip-inner .tooltip-image{border-radius:5px;height:auto;max-width:200px;overflow:hidden}#tooltip.on{display:block}#tooltip.off{display:none}@-webkit-keyframes fade{0%{opacity:0}80%{opacity:.6}to{opacity:1}}@keyframes fade{0%{opacity:0}80%{opacity:.6}to{opacity:1}}";
styleInject(css_248z);
var PropTypes = require("prop-types");

/**
 * @typedef {Object} ToolTipProps
 * @property {Position} position - The position of the tooltip, relative to its parent element.
 * @property {boolean} show - A flag indicating whether the tooltip is visible.
 * @property {Trigger[]} trigger - The event that triggers the tooltip to show.
 * @property {ToolTipContent} content - The content of the tooltip.
 * @property {number} delay - The delay in milliseconds before the tooltip is shown or hidden.
 * @property {ToolTipStyle} style - The style for the tooltip element.
 * @property {boolean} forceCenter - A flag indicating whether the tooltip should be centered even if it would otherwise be obscured.
 * @property {boolean} autoClose - A flag indicating whether the tooltip should automatically close after a certain amount of time or not.
 *
 * @typedef {Object} ToolTipRef
 * @property {(hoverRect: ClientRect) => void} showDynamicToolTip - A function that dynamically positions the tooltip after showing it.
 * @property {function} killDynamicToolTip - A function that hides the tooltip
 * @property {function} getNode - A function that help to access Dom TolTip Element
 *
 * A tooltip component that can be positioned relative to its parent element.
 * @param {ToolTipProps} props - The component's props.
 * @param {ToolTipRef} ref - A reference to the component's DOM node.
 * @author Fahis <fahis.skazi@gmail.com>
 * @version 1.0.8
 */
const ToolTip = /*#__PURE__*/ React.forwardRef((props, ref) => {
  const [show, setShow] = React.useState(false);
  const [rect, setRect] = React.useState({});
  const [state, setState] = React.useState({
    x: 0,
    y: 0,
    type: "none",
    arrow: null,
  });
  const mount = React.useRef(false);
  const showTimeoutRef = React.useRef(null);
  const hideTimeoutRef = React.useRef(null);
  React.useDebugValue(mount.current, (value) =>
    value ? "Tooltip is mounted" : "Tooltip is unmounted"
  );
  React.useDebugValue(show, (value) =>
    value ? "Tooltip is visible" : "Tooltip is hidden"
  );
  React.useDebugValue(rect, (value) => `rect: ${JSON.stringify(value)}`);
  React.useDebugValue(state, (value) => `state: ${JSON.stringify(value)}`);
  React.useDebugValue(
    showTimeoutRef.current,
    (value) => `showTimeoutRef: ${value}`
  );
  React.useDebugValue(
    hideTimeoutRef.current,
    (value) => `hideTimeoutRef: ${value}`
  );
  const visibile = React.useRef(false);
  React.useEffect(() => {
    mount.current = true;
    return () => {
      mount.current = false;
    };
  }, []);
  const pastShow = React.useCallback((hoverRect) => {
    // position the tooltip after showing it
    let ttNode = toolTip.current;
    if (ttNode != null) {
      let x = 0,
        y = 0,
        arrow = null;
      const docWidth = document.documentElement.clientWidth,
        docHeight = document.documentElement.clientHeight;
      let rx = hoverRect.x + hoverRect.width,
        // most right x
        lx = hoverRect.x,
        // most left x
        ty = hoverRect.y,
        // most top y
        by = hoverRect.y + hoverRect.height; // most bottom y

      // tool tip rectange
      let ttRect = ttNode.getBoundingClientRect();
      let newState = {};
      switch (props.position) {
        case "right":
          newState.type = "right";
          break;
        case "below":
          newState.type = "bottom";
          break;
        case "left":
          newState.type = "left";
          break;
        case "above":
          newState.type = "top";
          break;
        default:
          var bRight = rx + ttRect.width <= window.scrollX + docWidth;
          var bLeft = lx - ttRect.width >= 0;
          var bAbove = ty - ttRect.height >= 0;
          var bBelow = by + ttRect.height <= window.scrollY + docHeight;
          if (bRight) {
            newState.type = "right";
          } else if (bBelow) {
            newState.type = "bottom";
          } else if (bLeft) {
            newState.type = "left";
          } else if (bAbove) {
            newState.type = "top";
          }
      }

      //Calculating the x and y coordinates

      if (newState.type === "right") {
        x = rx;
        if (props.forceCenter) {
          arrow = null;
          y = ty + (hoverRect.height - ttRect.height) / 2;
        } else {
          y = ty + (hoverRect.height - ttRect.height);
          arrow = hoverRect.height / 2;
          if (ttRect.height < hoverRect.height) {
            arrow = null;
            y = ty + (hoverRect.height - ttRect.height) / 2;
          }
          if (y < 0 || hoverRect.height - ttRect.height < 0) {
            y = ty;
          }
        }
      } else if (newState.type === "bottom") {
        y = by;
        if (props.forceCenter) {
          arrow = null;
          x = lx + (hoverRect.width - ttRect.width) / 2;
        } else {
          x = lx + (hoverRect.width - ttRect.width);
          arrow = hoverRect.width / 2;
          if (ttRect.width < hoverRect.width) {
            arrow = null;
            x = lx + (hoverRect.width - ttRect.width) / 2;
          }
          if (x < 0 || hoverRect.width - ttRect.width < 0) {
            x = lx;
          }
        }
      } else if (newState.type === "left") {
        x = lx - ttRect.width;
        if (props.forceCenter) {
          arrow = null;
          y = ty + (hoverRect.height - ttRect.height) / 2;
        } else {
          y = ty + (hoverRect.height - ttRect.height);
          arrow = hoverRect.height / 2;
          if (ttRect.height < hoverRect.height) {
            arrow = null;
            y = ty + (hoverRect.height - ttRect.height) / 2;
          }
          if (y < 0 || hoverRect.height - ttRect.height < 0) {
            y = ty;
          }
        }
      } else if (newState.type === "top") {
        y = ty - ttRect.height;
        if (props.forceCenter) {
          arrow = null;
          x = lx + (hoverRect.width - ttRect.width) / 2;
        } else {
          x = lx + (hoverRect.width - ttRect.width);
          arrow = hoverRect.width / 2;
          if (ttRect.width < hoverRect.width) {
            arrow = null;
            x = lx + (hoverRect.width - ttRect.width) / 2;
          }
          if (x < 0 || hoverRect.width - ttRect.width < 0) {
            x = lx;
          }
        }
      }
      newState = {
        ...newState,
        x: x,
        y: y,
        arrow: arrow,
      };
      setState(newState);
    }
  }, []);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClearTooltip(0);
      }
    };
    const handleScroll = () => {
      if (show) {
        handleClearTooltip(0);
      }
    };
    if (show) {
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", handleScroll);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(hideTimeoutRef.current);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(hideTimeoutRef.current);
    };
  }, [show]);
  React.useLayoutEffect(() => {
    if (!props.show) return;
    if (rect?.x) {
      pastShow(rect);
    }
  }, [props.show, rect]);
  let visibility = visibile.current == true ? "on" : "off";
  let style = {
    left: state.x + window.scrollX + "px",
    top: state.y + window.scrollY + "px",
    "--backgroundColor": props.style.backgroundColor ?? "#000",
    "--color": props.style.color ?? "#fff",
    "--fontSize": props.style.fontSize ?? "14px",
    "--animationDuration": props.style.animationDuration ?? "0.3s",
  };
  let arrowStyle =
    state.type === "top" || state.type === "bottom"
      ? {
          left: state.arrow,
        }
      : {
          top: state.arrow,
        };
  let classNames = {};
  if (state.type != null && state.type != "none") {
    classNames[state.type] = true;
  }
  classNames[visibility] = true;
  const toolTip = React.useRef();
  const handleShowTooltip = React.useCallback(
    (evt) => {
      let el = evt.currentTarget;
      if (el != null) {
        let rect = el.getBoundingClientRect();
        if (props.show) {
          clearTimeout(hideTimeoutRef.current);
          const timeout = setTimeout(() => {
            visibile.current = true;
            reactDom.unstable_batchedUpdates(() => {
              setShow(true);
              setRect(rect);
            });
          }, props.delay);
          showTimeoutRef.current = timeout;
        }
      }
    },
    [props.show, props.delay]
  );
  const handleClearTooltip = React.useCallback(
    (forceChangedelay) => {
      clearTimeout(showTimeoutRef.current);
      const timeout = setTimeout(() => {
        setShow(false);
        visibile.current = false;
      }, forceChangedelay ?? props.delay);
      hideTimeoutRef.current = timeout;
    },
    [props.delay]
  );
  React.useImperativeHandle(
    ref,
    () => {
      return {
        showDynamicToolTip: (hoverRect) => {
          handleShowTooltip(hoverRect);
        },
        killDynamicToolTip() {
          handleClearTooltip();
        },
        getNode: () => toolTip.current,
      };
    },
    []
  );
  const childRef = React.useRef(null);
  React.useEffect(() => {
    let hideTimeout;
    const handleOutsideClick = (e) => {
      if (
        childRef?.current &&
        !childRef.current.contains(e.target) &&
        (props.trigger.includes("click") || props.trigger.includes("touch"))
      ) {
        handleClearTooltip();
      }
    };
    if (props.trigger.includes("click") || props.trigger.includes("touch")) {
      document.addEventListener("click", handleOutsideClick);
      if (props.autoClose) {
        hideTimeout = setTimeout(() => {
          handleClearTooltip();
        }, 2000);
      }
    } else {
      document.removeEventListener("click", handleOutsideClick);
      clearTimeout(hideTimeout);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      clearTimeout(hideTimeout);
    };
  }, [props.trigger, childRef]);
  let content;
  if (typeof props.content === "string") {
    content = props.content;
  } else if (
    typeof props.content === "object" &&
    props.content.type === "image"
  ) {
    content = /*#__PURE__*/ React.createElement("img", {
      src: props.content.src,
      alt: props.content.alt ?? "tooltip image",
      onLoad: () => pastShow(rect),
      className: "tooltip-image",
    });
  } else if (
    typeof props.content === "object" &&
    props.content.type === "list"
  ) {
    content = /*#__PURE__*/ React.createElement(
      "ul",
      {
        className: "tooltip-list",
      },
      props.content.items.map((item) =>
        /*#__PURE__*/ React.createElement(
          "li",
          {
            key: item,
          },
          item
        )
      )
    );
  } else {
    content = props.content;
  }
  const addPropsAndEventHandlers = (child, props) => {
    return {
      ...child.props,
      ...(props.show && {
        "aria-describedby": "tooltip",
        "data-testid": "tooltip-trigger",
      }),
      ref: props.trigger.includes("click") ? childRef : child.ref,
      ...addEventHandlers(child, props),
    };
  };
  const addEventHandlers = (child, props) => {
    return {
      onMouseEnter: (...params) => {
        if (props.trigger.includes("hover")) {
          handleShowTooltip(...params);
        }
        child.props?.onMouseEnter?.(...params);
      },
      onMouseLeave: (...params) => {
        if (props.trigger.includes("hover")) {
          handleClearTooltip(...params);
        }
        child.props?.onMouseLeave?.(...params);
      },
      onClick: (...params) => {
        if (props.trigger.includes("click")) {
          handleShowTooltip(...params);
        }
        child.props?.onClick?.(...params);
      },
      onTouchStart: (...params) => {
        if (props.trigger.includes("touch")) {
          handleShowTooltip(...params);
        }
        child.props?.onTouchStart?.(...params);
      },
      // onTouchEnd: (...params) => {
      //   if (props.trigger === 'touch') {
      //     handleClearTooltip(...params)
      //   }
      //   child.props?.onTouchEnd?.(...params)
      // },
    };
  };

  return /*#__PURE__*/ React.createElement(
    React.Fragment,
    null,
    React.Children.map(props.children, (child, index) => {
      if (index === 0 && /*#__PURE__*/ React.isValidElement(child)) {
        if (child.type !== React.Fragment) {
          return /*#__PURE__*/ React.cloneElement(
            child,
            addPropsAndEventHandlers(child, props)
          );
        } else {
          return /*#__PURE__*/ React.createElement(
            "div",
            _extends(
              {},
              show && {
                "aria-describedby": "tooltip",
                "data-testid": "tooltip-trigger",
              },
              addEventHandlers(child, props)
            ),
            /*#__PURE__*/ React.cloneElement(child, {
              ...child.props,
            })
          );
        }
      }
      return child;
    }),
    mount.current &&
      show &&
      props.show &&
      /*#__PURE__*/ reactDom.createPortal(
        /*#__PURE__*/ React.createElement(
          "div",
          {
            id: "tooltip",
            className: Object.keys(classNames).join(" "),
            style: style,
            ref: toolTip,
            "aria-hidden": !show,
            role: "tooltip",
            tabIndex: 0,
            "data-testid": "tooltip",
            "aria-label":
              props.content === "string" ? props.content : "tooltip",
          },
          /*#__PURE__*/ React.createElement("div", {
            className: "tooltip-arrow",
            style: arrowStyle,
          }),
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "tooltip-inner",
            },
            content
          )
        ),
        document.body
      )
  );
});
ToolTip.propTypes = {
  position: PropTypes.oneOf(["right", "below", "left", "above", "auto"]),
  trigger: PropTypes.arrayOf(PropTypes.oneOf(["hover", "click", "touch"])),
  show: PropTypes.bool,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      type: PropTypes.oneOf(["image", "list"]).isRequired,
      src: PropTypes.string,
      alt: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.string),
    }),
    PropTypes.element,
  ]).isRequired,
  delay: PropTypes.number,
  style: PropTypes.object,
  forceCenter: PropTypes.bool,
  autoClose: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
ToolTip.defaultProps = {
  show: true,
  content: "Tooltip 🚀",
  trigger: ["hover"],
  position: "auto",
  delay: 100,
  style: {
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "14px",
    animationDuration: "0.3s",
  },
  forceCenter: false,
  autoClose: true,
};
ToolTip.displayName = "ToolTip";
export default ToolTip;
