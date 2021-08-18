import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header: React.FC<{className?: string}> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          variant="body1"
          color="inherit"
          to="/app"
          component={RouterLink}
        >
          Настройки
        </Link>
        <Link
            variant="body1"
            color="inherit"
            to="/app/employees"
            component={RouterLink}
        >
          Пользователи
        </Link>
        <Typography
          variant="body1"
          color="textPrimary"
        >
          Создание пользователя
        </Typography>
      </Breadcrumbs>
      <Typography
        variant="h3"
        color="textPrimary"
      >
        Создание пользователя
      </Typography>
    </div>
  );
}

export default Header;
