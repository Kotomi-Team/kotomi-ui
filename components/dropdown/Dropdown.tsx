import React, { useRef, useEffect } from 'react'
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

const Dropdown = (props: Props) => {
  const dropdownElement = useRef<HTMLDivElement>(null)
  const scrollTo = React.useRef<number>(0)
  useEffect(() => {
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

  useEffect(() => {
    if (dropdownElement.current) {
      dropdownElement.current.focus()
    }
  }, [props.visible])
  return (
    <>
      <div
        ref={dropdownElement}
        className={classNames(
          'asp-dropdown',
          'asp-dropdown-placement-bottomLeft',
          props.visible === true ? '' : 'asp-dropdown-hidden',
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
          'asp-dropdown-menu',
          'asp-dropdown-menu-light',
          'asp-dropdown-menu-root',
          'asp-dropdown-menu-vertical',
        )}>
          {(props.menus).map((element: JSX.Element, index: number) => {
            return (
              <li
                key={index}
                className="asp-dropdown-menu-item"
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
