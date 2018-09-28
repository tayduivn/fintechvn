// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import NotificationSystem from 'react-notification-system';

const contextDesc = {
  trigger : PropTypes.func,
  clear   : PropTypes.func,
  s       : PropTypes.func,
  i       : PropTypes.func,
  w       : PropTypes.func,
  e       : PropTypes.func
};

class NotifycationProvider extends React.Component{
  static childContextTypes = contextDesc;

  _nsElement = null;
  
  _trigger = (obj): any => {
    if (this._nsElement !== null) {
      return this._nsElement.addNotification(obj)
    }
  }

  _clear = () => {
    if (this._nsElement !== null) {
      return this._nsElement.clearNotifications();
    }
  }

  _success = (title, message) => {
    this._trigger({
      title,
      message,
      level: 'success',
      position: 'tr'
    });
  }

  _info = (title, message) => {
    return this._trigger({
      title,
      message,
      level: 'info',
      position: 'tr'
    });
  }

  _warn = (title, message): any => {
    return this._trigger({
      title,
      message,
      level: 'warning',
      position: 'tr'
    });
  }

  _error = (title, message) => {
    return this._trigger({
      title,
      message,
      level: 'error',
      position: 'tr'
    });
  }

  getChildContext() {
    return {
      trigger : this._trigger,
      clear   : this._clear,
      s       : this._success,
      i       : this._info,
      w       : this._warn,
      e       : this._error
    };
  }

  render() {
    return (
      <div>
        <NotificationSystem ref={ (ns) => { this._nsElement = ns; } } />
        { this.props.children }
      </div>
    );
  }
}

const withNotification = (C) => {

  class ChildComponent extends React.Component {
    static contextTypes = contextDesc;

    render() {
      let { trigger, clear, s, i, w, e } = this.context;
      let notification = {
        trigger,
        clear,
        s, i, w, e
      };
      return <C {...this.props} notification={ notification } />;
    }
  };

  return ChildComponent;
};

export { withNotification, NotifycationProvider };
