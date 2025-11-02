'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { memo } from 'react';

interface CustomConnectButtonProps {
  className?: string;
}

const CustomConnectButtonComponent = ({ className = "btn btn-green" }: CustomConnectButtonProps) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className={className}
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="btn btn-red"
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  type="button"
                  className={className}
                >
                  {account.displayName}
                  {account.displayBalance
                    ? ` • ${account.displayBalance}`
                    : ''}
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export const CustomConnectButton = memo(CustomConnectButtonComponent);