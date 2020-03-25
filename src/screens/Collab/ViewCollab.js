import * as React from 'react';
import { View, Text, YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

import { AppHeader } from '../../layouts/Header';
import { BackButton } from '../../components/buttons/BackButton';
import { TextButton } from '../../components/buttons/TextButton';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { collab } from './styles/collab.styles';
import CollabForm from '../../components/forms/CollabForm';


class ViewCollab extends React.Component {

    static navigationOptions = {
        headerShown: false
    }

    componentDidMount() {
        // const { user, current_project, getProjectFetchJobs, setProjectFetchJobsPending } = this.props

        // if (current_project.title) {
        //     setProjectFetchJobsPending()
        //     getProjectFetchJobs(user.id, current_project.id)
        //     this.setState({ project_value: { ...current_project } })
        // }

    }

    goToPublication = pub => {

    }

    handleChange = collab => {
        // let updatedProject = {
        //     ...this.state.project_value,
        //     ...project
        // }
        // this.setState({ project: updatedProject })
    }

    handleSubmit = () => {
        // const { user, navigation, updateProject } = this.props
        // let { project_value } = this.state
        // updateProject(user.id, project_value.id, project_value)
        // navigation.goBack()
    }



    render() {
        const { current_collab } = this.props
        return (
            <View>
                <AppHeader
                    gradient={true}
                    left={<BackButton onPress={() => this.props.navigation.goBack()} />}
                    right={<TextButton containerStyle={collab.saveBtn} onPress={this.handleSubmit} title="Save" />}
                />
                <View style={collab.viewContainer}>
                    <View>
                        <View style={collab.header}>
                            <Text style={collab.title}>Details</Text>
                        </View>
                        <View style={collab.detailsBox}>
                            <View style={collab.labelsCol}>
                                <Text style={collab.label}>Title</Text>
                                <Text style={collab.label}>Date created</Text>
                                {/* <Text style={collab.label}>Date Start</Text> */}
                                <Text style={collab.label}>Campaign</Text>
                                <Text style={collab.label}>Influencer</Text>
                                <Text style={collab.label}>Compensation</Text>
                                <Text style={collab.label}>Description</Text>
                            </View>
                            <CollabForm onChange={this.handleChange} collab={current_collab} />
                        </View>
                    </View>
                    {current_collab.details.active && <View style={collab.publicationsBox}>
                        <View style={collab.header}>
                            <Text style={collab.title}>Publications</Text>
                        </View>
                        <View style={collab.listView}><Text style={collab.noneMsg}>No publications yet</Text></View>
                    </View>}
                </View>
            </View>

        );
    }
}

const mapStateToProps = state => ({
    state: state,
    user: state.user.current_user,
    pending: state.collab.pending,
    error: state.collab.error,
    current_collab: state.collab.current_collab
});

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ViewCollab)
