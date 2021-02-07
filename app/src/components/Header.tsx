import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  header: {},
});

const Header = (): JSX.Element => {
  const classes = useStyles();

  return <div className={classes.header}></div>;
};

export default Header;
