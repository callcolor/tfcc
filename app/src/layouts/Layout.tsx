import React from 'react';
import { createUseStyles } from 'react-jss';
import Footer from '../components/Footer';
import Header from '../components/Header';

const useStyles = createUseStyles({
  layout: {
    backgroundColor: 'black',
    minHeight: '100vh',
  },
});

function Layout(props: {
  children: JSX.Element | JSX.Element[] | string | null | undefined;
}): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
}

export default Layout;
