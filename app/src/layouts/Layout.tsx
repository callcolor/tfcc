import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import { AppContext } from '../App';
import Footer from '../components/Footer';
import Header from '../components/Header';

const useStyles = createUseStyles({
  layout: {
    '& button': {
      backgroundColor: ({ colors }) => colors.button,
      color: ({ colors }) => colors.buttonText,
    },
    '& button .icon': {
      fill: ({ colors }: any) => colors.buttonText,
    },
    backgroundColor: ({ colors }) => colors.background,
    minHeight: '100vh',
  },
});

function Layout(props: {
  children: JSX.Element | JSX.Element[] | string | null | undefined;
}): JSX.Element {
  const { storage } = useContext(AppContext);
  const classes = useStyles({ ...storage });

  return (
    <div className={classes.layout}>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
}

export default Layout;
