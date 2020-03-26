import React from 'react'
import classNames from 'classnames';

type Props = {
  visible: boolean
  left: number
  top: number
  menus: JSX.Element[]
  onBlur: () => void
  onClick?: (element: JSX.Element, index: number) => void,
}

const dropdownElement = React.createRef<HTMLDivElement>()

const Dropdown = (props: Props) => {
  React.useEffect(() => {
    if (dropdownElement.current) {
      dropdownElement.current.focus()
    }
  })
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
