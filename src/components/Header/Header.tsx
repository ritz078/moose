import { TitleBar, Toolbar, SearchField } from "react-desktop/macOs";
import React, { memo } from "react";

export const Header: React.FC<{}> = memo(() => {
  const [query, setQuery] = React.useState('');

  console.log(query)

  return (
    <TitleBar inset>
      <Toolbar height={25} horizontalAlignment="right" >
        <SearchField
          placeholder="Search"
          defaultValue=""
          onChange={e => setQuery(e.target.value)}
        />
      </Toolbar>
    </TitleBar>
  );
})
