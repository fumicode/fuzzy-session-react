import { FC } from "react";

import styled from "styled-components";
import PanelSystem from "./00_Framework/Panel/02_PanelSystem";

const App: FC = styled((props: { className: string }) => {
  return <PanelSystem main="hogehoge" />;
})`
  .e-calendar-columns {
    display: flex;
    flex-direction: row;

    > .e-column {
    }
  }
`;

export default App;
