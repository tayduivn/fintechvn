// @flow

import * as React from 'react';

import { Menu } from 'screens/modules/menu';
import { Content } from 'screens/modules/content';

class DashboardPage extends React.Component {

  componentDidMount(){
    document.title = "Trang chủ Bankcas";
  }

  render() {
    return (
      <div className="app-main">
        <Menu />
        <div className="AppContent">
          <Content />
        </div>

        <footer className="site-footer footer-newsletter">
	      </footer>
        <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" display="none">
          <symbol id="icon-anchor" viewBox="0 0 54.89 64">
            <title>icon-anchor</title>
            <path fill="none" stroke="#000" strokeMiterlimit="10" strokeWidth="2" d="M26.96 13v50"/>
            <path fill="none" stroke="#000" strokeLinejoin="bevel" strokeWidth="2" d="M13.96 50l-10-3-3 10M39.96 50l10-3 4 10"/>
            <path d="M49.71 47A24 24 0 0 1 27 63 24 24 0 0 1 4.21 47M17.96 17h18" fill="none" stroke="#000" strokeLinejoin="bevel" strokeWidth="2"/>
            <circle cx="26.96" cy="7" r="6" fill="none" stroke="#000" strokeMiterlimit="10" strokeWidth="2"/>
          </symbol>
          <symbol id="icon-close" viewBox="0 0 95.08 95.09">
            <title>icon-close</title>
            <path d="M58.31 47.47l34.58-34.58a7.63 7.63 0 0 0 0-10.69 7.63 7.63 0 0 0-10.69 0L47.62 36.78 13 2.19a7.63 7.63 0 0 0-10.69 0 7.63 7.63 0 0 0 0 10.69l34.6 34.6L2.33 82.07a7.29 7.29 0 0 0 0 10.69 7.63 7.63 0 0 0 10.69 0l34.6-34.6 34.6 34.6a7.27 7.27 0 0 0 10.68 0 7.63 7.63 0 0 0 0-10.69z" data-name="Layer 1"/>
          </symbol>
          <symbol id="icon-email" viewBox="0 0 100 68.89">
            <title>icon-email</title>
            <path d="M36.25 38.44L47.74 49.1a3.33 3.33 0 0 0 4.51 0l11.5-10.66 24.69 23.78H11.56zM93.33 11v46.6L68.68 33.85zM6.67 11l24.65 22.85L6.67 57.64zm5.1-4.37h76.46L50 42.12zM4.44 0A4.51 4.51 0 0 0 0 4.44v60a4.51 4.51 0 0 0 4.44 4.44h91.12a4.51 4.51 0 0 0 4.44-4.44v-60A4.51 4.51 0 0 0 95.56 0z" data-name="Layer 1"/>
          </symbol>
          <symbol id="icon-link" viewBox="0 0 100 58.84">
            <title>icon-link</title>
            <path d="M78.47 48H49.21a10.66 10.66 0 0 1-9-4.91h10.58A21.57 21.57 0 0 0 71.7 26.64h6.76a10.67 10.67 0 0 1 0 21.33zm-67.6-26.47a10.67 10.67 0 0 1 10.67-10.66H50.8A10.59 10.59 0 0 1 58.34 14a10.94 10.94 0 0 1 1.43 1.79H49.21a21.57 21.57 0 0 0-20.92 16.4h-6.76a10.67 10.67 0 0 1-10.66-10.66zm39.92 10.66H39.86a10.68 10.68 0 0 1 9.35-5.54h10.93a10.67 10.67 0 0 1-9.35 5.54zM100 37.31a21.53 21.53 0 0 0-21.53-21.53h-6.92A21.53 21.53 0 0 0 50.8 0H21.54a21.53 21.53 0 0 0 0 43.06h6.83v-.31A21.41 21.41 0 0 0 34 52.53a21.4 21.4 0 0 0 15.2 6.31h29.26A21.56 21.56 0 0 0 100 37.31z"/>
          </symbol>
          <symbol id="icon-logo-star" viewBox="0 0 362.62 388.52">
            <title>icon-logo-star</title>
            <path d="M156.58 239l-88.3 64.75c-10.59 7.06-18.84 11.77-29.43 11.77-21.19 0-38.85-18.84-38.85-40 0-17.69 14.13-30.64 27.08-36.52l103.6-44.74-103.6-45.92C13 142.46 0 129.51 0 111.85 0 90.66 18.84 73 40 73c10.6 0 17.66 3.53 28.25 11.77l88.3 64.75-11.74-104.78C141.28 20 157.76 0 181.31 0s40 18.84 36.5 43.56L206 149.52l88.3-64.75C304.93 76.53 313.17 73 323.77 73a39.2 39.2 0 0 1 38.85 38.85c0 18.84-12.95 30.61-27.08 36.5l-103.61 45.91L335.54 239c14.13 5.88 27.08 18.83 27.08 37.67 0 21.19-18.84 38.85-40 38.85-9.42 0-17.66-4.71-28.26-11.77L206 239l11.77 104.78c3.53 24.72-12.95 44.74-36.5 44.74s-40-18.84-36.5-43.56z"/>
          </symbol>
          <symbol id="icon-menu" viewBox="0 0 100 68.42">
            <title>icon-menu</title>
            <path d="M94.73 10.53H5.27c-7 0-7-10.53 0-10.53h89.46c6.88.14 6.88 10.38 0 10.53zm0 18.42H5.27c-7 0-7 10.53 0 10.53h89.46c6.86-.17 6.86-10.38 0-10.53zm0 28.94H5.27c-7 0-7 10.53 0 10.53h89.46c7.03 0 7.03-10.53 0-10.53z" data-name="Layer 1"/>
          </symbol>
          <symbol id="icon-nav-almanac" viewBox="0 0 64 64">
            <path fill="none" d="M7 1h46v62H7z"/>
            <path fill="none" vectorEffect="non-scaling-stroke" d="M15 63V2M20 15h28M20 21h28"/>
          </symbol>
          <symbol id="icon-nav-forums" viewBox="0 0 64 64">
            <path d="M10 15h44v2H10zM10 25h44v2H10zM10 35h44v2H10z"/>
            <path d="M17 61.174L32.37 48H64V4H0v44h17v13.174zM2 46V6h60v40H31.63L19 56.826V46H2z"/>
          </symbol>
          <symbol id="icon-nav-gallery" viewBox="0 0 64 64">
            <path d="M0 54h64V10H0v44zm2-2v-4.544l21.952-19.09 12.156 12.156 6.051-8.068L62 49.459V52H2zm60-40v34.826l-20.16-17.28-5.949 7.932-11.843-11.844L2 44.805V12h60z"/>
            <path d="M51 28c3.309 0 6-2.691 6-6s-2.691-6-6-6-6 2.691-6 6 2.691 6 6 6zm0-10c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4z"/>
          </symbol>
          <symbol id="icon-nav-guide" viewBox="0 0 64 56.9">
            <title>icon-nav-guide</title>
            <path d="M1 55.45l21-8 20 8 21-8v-46l-21 8-20-8-21 8v46zM22 1.45v46M42 9.45v46"/>
          </symbol>
          <symbol id="icon-nav-home" viewBox="0 0 64 64">
            <path d="M32 3L2 33h9v30h12V47h16v16h12V33h11z"/>
          </symbol>
          <symbol id="icon-nav-jobs" viewBox="0 0 64 64">
            <path d="M41 37.586L23.414 20l12-12-5.305-5.302-.688.486c-.025.018-2.537 1.769-5.671 1.769-2.244 0-4.277-.896-6.043-2.66L17 1.586-.414 19 12 31.414l10-10L39.586 39l-3 3L57 62.414 64.414 55 44 34.586l-3 3zM2.414 19L17.026 4.388c1.983 1.703 4.241 2.565 6.724 2.565 2.722 0 4.992-1.057 6.103-1.687L32.586 8 12 28.586 2.414 19zM57 59.586L39.414 42 44 37.414 61.586 55 57 59.586z"/>
          </symbol>
          <symbol id="icon-nav-newsletter" viewBox="0 0 64 64">
            <path d="M64 12H0v39h64V12zm-4.395 2L32 31.81 4.395 14h55.21zM2 49V14.835L32 34.19l30-19.355V49H2z"/>
          </symbol>
          <symbol id="icon-nav-shop" viewBox="0 0 64 64">
            <path d="M44 18h10v45H10V18h10z"/>
            <path d="M22 24V11c0-5.523 4.477-10 10-10s10 4.477 10 10v13"/>
          </symbol>
          <symbol id="icon-nav-snippets" viewBox="0 0 64 64">
            <path d="M0 64h64.414L0-.414V64zm2-9h6v-2H2v-6h4v-2H2v-6h6v-2H2v-6h4v-2H2v-6h6v-2H2V4.414L59.586 62H2v-7z"/>
            <path d="M13 27.586V55h27.414L13 27.586zm2 4.828L35.586 53H15V32.414zM64.375 46.375l-2.472-9.886L25-.414 17.586 7l36.903 36.903 9.886 2.472zm-2.75-2.75l-6.114-1.528L26.414 13 31 8.414l29.097 29.097 1.528 6.114zM25 2.414L29.586 7 25 11.586 20.414 7 25 2.414z"/>
          </symbol>
          <symbol id="icon-nav-video" viewBox="0 0 64 64">
            <path d="M46 30l17-10v32L46 42v10H1V20h45zM6 28h4M14 28h4"/>
            <path d="M7 36h18v10H7zM6 12h26l8 8"/>
          </symbol>
          <symbol id="icon-search" viewBox="0 0 100 100">
            <title>icon-search</title>
            <path d="M80.65 66.78a33.55 33.55 0 0 1-47.44-47.44 33.55 33.55 0 1 1 47.44 47.44zm6.73-54.16a43.06 43.06 0 0 0-65.32 55.71L2 88.39A6.8 6.8 0 0 0 11.61 98l20.06-20.06a43.06 43.06 0 0 0 55.71-65.32z"/>
          </symbol>
          <symbol id="icon-star" viewBox="0 0 100 95.52">
            <title>icon-star</title>
            <path d="M64.19 28.77a5.17 5.17 0 0 0 3.9 2.83s29.27-3 31.74 4.61-23 22.39-23 22.39a5.17 5.17 0 0 0-1.49 4.58s11.91 26.9 5.42 31.61S52.4 79.87 52.4 79.87a5.21 5.21 0 0 0-2.41-.6 5.14 5.14 0 0 0-2.41.6S25.68 99.5 19.2 94.79s5.42-31.61 5.42-31.61a5.18 5.18 0 0 0-1.49-4.58S-2.31 43.83.17 36.21s31.74-4.61 31.74-4.61a5.19 5.19 0 0 0 3.9-2.83S42 0 50 0s14.19 28.77 14.19 28.77z" data-name="Layer 1"/>
          </symbol>
          <symbol id="icon-tag" viewBox="0 0 100 99.98">
            <title>icon-tag</title>
            <path d="M42 42a10.07 10.07 0 1 1 0-14.24A10 10 0 0 1 42 42zm56 6.5l-43.74-44a7.19 7.19 0 0 0-5-2.25L8 0a7.55 7.55 0 0 0-8 7v1l2.5 41a7.11 7.11 0 0 0 2.25 4.75l43.49 44a7.2 7.2 0 0 0 5.24 2.25 6.81 6.81 0 0 0 5.25-2.25L97.72 59A7.47 7.47 0 0 0 98 48.5z"/>
          </symbol>
        </svg>
      </div>
    );
  }
};

export default DashboardPage;
