import "../styles/globals.css";
import dynamic from "next/dynamic";
import { WalletBalanceProvider } from "../context/useWalletBalance";
import { ModalProvider } from "react-simple-hook-modal";

function MyApp({ Component, pageProps }) {
  const WalletConnectionProvider = dynamic(
    () => import("../context/WalletConnectionProvider"),
    {
      ssr: false,
    }
  );

  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  );
}

export default MyApp;
