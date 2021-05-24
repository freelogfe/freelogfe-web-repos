import * as React from "react";
import FLayout from "@/layouts/FLayout";

interface LoggedProps {

}

function Logged({}: LoggedProps) {
  return (<FLayout headerLeft={<div>logo</div>} headerRight={<div>userInfo</div>}>
    <div>content</div>
  </FLayout>);
}

export default Logged;
