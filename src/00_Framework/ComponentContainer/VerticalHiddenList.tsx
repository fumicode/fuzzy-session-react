import { FC } from "react";
import styled from "styled-components";
import ViewModel from "../00_ViewModel";

interface VerticalHiddenListViewModel extends ViewModel<string[]> {
  className?: string;
  main: string[];
}

const VerticalHiddenList: FC<VerticalHiddenListViewModel> = styled(
  ({ className, main: items }: VerticalHiddenListViewModel) => {
    return (
      <div className={className}>
        <div className="e-container">
          <ul className="e-list">
            {items.map((item, index) => (
              <li className="e-item" key={index}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="e-info">計{items.length}件</div>
      </div>
    );
  }
)`
  display: inline-flex;
  flex-direction: row;

  height: 1em;

  vertical-align: middle;
  &:hover {
    overflow-y: visible;

    > .e-container {
      top: -30px;
      overflow-y: visible;
    }
  }
  > .e-container {
    position: relative;
    top: -0.5em;
    height: 2em;
    overflow-y: hidden;
    transition: top 0.3s;

    > .e-list {
      display: flex;
      flex-direction: column;
      list-style: none;
      margin: 0;
      padding: 0;

      > .e-item {
        font-size: 0.5rem;
        background: white;
        padding: 0 0.2em;
      }
    }
  }

  > .e-info {
    padding: 2px;
    background: #eee;
    border-radius: 2px;
    font-size: 0.7rem;
    color: #666;
  }
`;
export default VerticalHiddenList;
