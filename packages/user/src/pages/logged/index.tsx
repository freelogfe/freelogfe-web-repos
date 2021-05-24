import * as React from "react";
import FBaseLayout from "@/layouts/FBaseLayout";

interface LoggedProps {

}

function FLogged({}: LoggedProps) {
  return (<FBaseLayout
    headerLeft={<div>logo</div>}
    headerRight={<div>userInfo</div>}
  >
    <div>content</div>
  </FBaseLayout>);
}

export default FLogged;
