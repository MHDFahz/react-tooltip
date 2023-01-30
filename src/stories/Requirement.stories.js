import { storiesOf } from "@storybook/react";
import React from "react";

import ToolTip from "../components/tooltip";

const stories = storiesOf("App Test", module);

stories.add("App", () => {
  return (
    <div>
      <ToolTip trigger={["hover", "click"]}>
        <div>Hiissi</div>
      </ToolTip>
    </div>
  );
});
