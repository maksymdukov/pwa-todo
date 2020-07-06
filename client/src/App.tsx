import React from "react";

import { Layout } from "components/layout/layout";
import { Providers } from "providers";
import { Routes } from "routes";

import "sw/window-events";

function App() {
  return (
    <Providers>
      <Layout>
        <Routes />
      </Layout>
    </Providers>
  );
}

export default App;
