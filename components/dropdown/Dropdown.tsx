import React from 'react'
import classNames from 'classnames';
import * as lodash from 'lodash'

type Props = {
  visible: boolean
  left: number
  top: number
  menus: JSX.Element[]
  onBlur: () => void
  onClick?: (element: JSX.Element, index: number) => void,
  getPopupContainer?: (dom: Element) => Element;
  onScroll?: (space: number) => void
}

const dropdownElement = React.createRef<HTMLDivElement>()

const Dropdown = (props: Props) => {
  const scrollTo = React.useRef<number>(0)
  React.useEffect(() => {
    if (dropdownElement.current) {
      dropdownElement.current.focus()
    }

    if (props.getPopupContainer) {
      const dom = props.getPopupContainer(dropdownElement.current!)
      dom.addEventListener('scroll', () => {
        if (props.onScroll) {
          props.onScroll(- (dom.scrollTop - scrollTo.current))
        }
        scrollTo.current = lodash.cloneDeep(dom.scrollTop)
      })
    }

  }, [])
  return (
    <>
      <div
        ref={dropdownElement}
        className={classNames(
          'ant-dropdown',
          'ant-dropdown-placement-bottomLeft',
          props.visible === true ? '' : 'ant-dropdown-hidden',
        )}
        tabIndex={-1}
        style={{
          left: props.left,
          top: props.top,
          position: 'fixed',
        }}

        onBlur={() => {
          if (props.onBlur) {
            props.onBlur()
          }
        }}
      >
        <ul className={classNames(
          'ant-dropdown-menu',
          'ant-dropdown-menu-light',
          'ant-dropdown-menu-root',
          'ant-dropdown-menu-vertical',
        )}>
          {(props.menus).map((element: JSX.Element, index: number) => {
            return (
              <li
                key={index}
                className="ant-dropdown-menu-item"
                onClick={() => {
                  if (props.onClick) {
                    props.onClick(element, index)
                  }
                }}
                role="menuitem"
              >
                {element}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

Dropdown.defaultProps = {
  menus: [],
}

export default Dropdown;
