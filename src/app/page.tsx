'use client';

import { CustomConnectButton } from '@/components/CustomConnectButton';
import { APYStats } from '@/components/APYStats';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    let animationStarted = false;
    
    // Initialize number animations after component mounts - only once
    const initNumberAnimations = () => {
      if (animationStarted || typeof window === 'undefined' || !(window as any).jQuery) return;
      
      animationStarted = true;
      const $ = (window as any).jQuery;
      $('.animate-number').each(function(this: any) {
        const $this = $(this);
        const countTo = $this.attr('data-value');
        const countFrom = 0;
        const duration = 2000; // Reduced from 3000ms for faster animation

        $({ countNum: countFrom }).animate({
          countNum: countTo
        }, {
          duration: duration,
          easing: 'linear',
          step: function(this: any) {
            $this.text(commaSeparateNumber(Math.floor(this.countNum)));
          },
          complete: function(this: any) {
            $this.text(commaSeparateNumber(this.countNum));
          }
        });
      });
    };

    const commaSeparateNumber = (val: number) => {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Wait for jQuery to load
    setTimeout(initNumberAnimations, 1000);
  }, []);

  return (
    <>
      <header>
        <div className="container">
          <div className="header-container d-flex justify-content-between align-items-center">
            <Link href="/" className="logo">
              <img src="/images/logo.svg" alt="StarYield" />
            </Link>
            <ul className="main-menu clearfix">
              <li><Link href="/staking" className="link">Stake</Link></li>
              <li><Link href="/apy" className="link">APY</Link></li>
              <li><a href="#" className="link">Guide</a></li>
              <li><a href="#" className="link">Roadmap</a></li>
              <li><a href="#" className="link">Documentation</a></li>
              <li className="menu-enter">
                <Link href="/dashboard" className="btn btn-blue">Enter App</Link>
              </li>
            </ul>
            <ul className="header-buttons clearfix">
              <li><CustomConnectButton /></li>
              <li className="enter-app">
                <Link href="/dashboard" className="btn btn-blue">Enter App</Link>
              </li>
              <li className="menu-toggle">
                <a href="javascript:void(0);" id="menu-toggle" className="btn btn-skyblue">
                  <i className="fas fa-bars"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className="main-wrapper">
        <div className="container">
          <div className="inner-wrapper d-flex align-items-center justify-content-center">
            <div className="main-caption text-center">
              <h1>Navigate the Financial Cosmos <br/>with StarYield Staking</h1>
              <p>Journey through the financial galaxy with StarYield&apos;s premier staking experience. Unlock the potential of your digital assets as you traverse through a universe of rewards. With StarYield, your crypto ventures beyond the ordinary, charting a course through the stars of DeFi space. Secure.</p>
              <div className="button-set text-center">
                <Link href="/staking" className="btn btn-skyblue normal">Begin Staking</Link>
                <a href="#" className="btn btn-green normal" style={{marginLeft: '10px'}}>read Document</a>
              </div>
            </div>
            <div className="arb-stats">
              <ul className="clearfix">
                <APYStats />
                <li>
                  <h4>Total value locked</h4>
                  <h3>$—</h3>
                </li>
                <li>
                  <h4>Total stakers</h4>
                  <h3>—</h3>
                </li>
                <li>
                  <h4>Total payouts</h4>
                  <h3>$—</h3>
                </li>
              </ul>
            </div>
            <div className="arb-socials">
              <ul className="clearfix">
                <li><a href="#" target="_blank" className="btn btn-social"><i className="fab fa-twitter"></i> Twitter</a></li>
                <li><a href="#" target="_blank" className="btn btn-social"><i className="fas fa-paper-plane"></i> Telegram</a></li>
                <li><a href="#" target="_blank" className="btn btn-social"><i className="fab fa-discord"></i> Discord</a></li>
              </ul>
            </div>

            <div className="blue-globe">
              <video autoPlay loop muted>
                <source src="/images/blue-globe.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="ai">
              <video autoPlay loop muted>
                <source src="/images/ai.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="ship">
              <video autoPlay loop muted>
                <source src="/images/ship.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="white-globe">
              <img src="/images/white-globe.png" className="fluid-img" alt="Globe" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}