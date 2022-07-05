import React, { useState } from "react";
import Navbar from "./Navbar";
import Web3 from "web3";
import { useEffect } from "react";
import useMetaMask from "../Hooks/useMetamask";

const App = () => {
  const { connect, disconnect, isActive, account, shouldDisable } = useMetaMask();
  return (
    <div>
      <Navbar connectWallet={connect} account={account} disconnect={disconnect} />
    </div>
  );
};

export default App;
