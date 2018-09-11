import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Container, Grid, Header, Icon, Segment, Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification } from 'components';
import { actions as profileActions } from 'modules/profile';
import { validateForm } from 'utils/validate';

import Info from './Info';
import Password from './Password';

class Profile extends Component {
  componentWillMount(){
    document.title = "Profile user";
  }

  handelSuccess = (res) => {
    let { notification } = this.props;
    if (res.error !== null)
      notification.e('Messages', res.error.messagse)
    else notification.s('Messages', 'Update success');
  }

  handelError = (err) => {
    let { notification } = this.props;
    notification.e('Messages', err.toString());
  }

  handelSubmit = (data) => {
    let { profile, profileActions } = this.props;
    profileActions.updateUserById(data, profile.info.id)
      .then(res => { // console.log(res);
        this.handelSuccess(res);
      })
      .catch(e => this.handelError(e))
  }

  render() {
    let { t, profile } = this.props;
    const panes = [
      { menuItem: t('profile:changeInfo'), render: () => (
      <Tab.Pane>
        <Info t={ t }
          handelSubmit= { this.handelSubmit }
          validateForm={ validateForm }
          profile={ profile }/>
      </Tab.Pane>) },
      { menuItem: t('profile:changePass'), render: () => (
        <Tab.Pane>
          <Password
            handelSubmit= { this.handelSubmit }
            profile={ profile }
            validateForm={ validateForm }
            t={t} />
        </Tab.Pane>) },
    ];

    return (
      <Container style={{padding: '15px'}} fluid>
        <Grid columns={2}  divided>
          <Grid.Row >
            <Grid.Column width={5} >
              <Segment textAlign='center'>
                <Header as='h6' icon>
                  <Icon style={{margin: '10px 0'}} name='users' circular />
                </Header>
                
              </Segment>
            </Grid.Column>
            <Grid.Column width={11}>
              <Segment>
                <Tab panes={panes} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}


let mapStateToProps = (state) => {
  let { profile } = state;
  return { profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    profileActions : bindActionCreators(profileActions, dispatch)
  };
};

export default withNotification(translate('profile')(connect(mapStateToProps, mapDispatchToProps)(Profile)));
