import * as React from 'react';
import { View, Text, YellowBox } from 'react-native';
import { AppHeader } from '../../layouts/Header';
import { IconButton } from '../../components/buttons/IconButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserProjects } from '../../actions/project';
import { getProjectFetchJobs } from '../../actions/fetchJob';
import { COMPLETED } from '../../constants';
import { logOutUser } from '../../actions/user';
import { SET_PROJECTS_SUCCESS } from '../../constants/response/types';
import { activeProjects } from '../../reducers/projectReducer';
import { home } from './styles/home.styles';
import { colors, base } from '../../styles/base';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

class HomeScreen extends React.Component {

    static navigationOptions = {
        headerShown: false,
    }


    state = {
        recent_tags: []
    }

    componentDidMount() {
        const { user, getUserProjects } = this.props

        if (getUserProjects(user.id).type == SET_PROJECTS_SUCCESS) {
            this.getRecentHashtags()
        }

    }

    getRecentHashtags = () => {
        const { user, active_projects, getUserProjects, getProjectFetchJobs, completed_fetch_jobs } = this.props
        let tags = []
        getUserProjects(user.id)
        let project_id = active_projects[0].id // should be active_projects.length -1
        getProjectFetchJobs(user.id, project_id)

        console.log(completed_fetch_jobs)

        // completed_fetch_jobs.array.forEach(job => {
        //     tags = [...tags, job.related_tags]
        // });

        // this.setState({ recent_tags: tags })
    }

    render() {
        const { user, logOutUser, completed_fetch_jobs } = this.props
        // const { recent_tags } = this.state
        console.log(this.props.user)
        return (
            <View>
                <AppHeader
                    gradient={true}
                    right={<View style={home.iconContainer}><IconButton color={colors.WHITE}
                        name='logout'
                        size={30}
                        onPress={() => logOutUser()}
                    /></View>}
                />
                <View style={home.container}>
                    <View style={home.top}>
                        <Text style={home.title}>Based on your previous searches</Text>
                        <Text style={home.text}>Consider these hashtagtags</Text>
                        <View style={home.itemRow}>
                            {/* {completed_fetch_jobs.length > 0 && 
                            <TagList tags={recent_tags} />} */}
                        </View>
                    </View>
                    <View style={home.logInMsg}>
                        <Text style={home.largeTitle}>Recent posts by influencers....</Text>
                        <Text style={home.largeTitle}>{`Current user ${user.username}`}</Text>
                    </View>
                    <View style={home.logInMsg}>
                        <Text style={home.largeTitle}>Maybe recently openet projects....</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.current_user,
    active_projects: activeProjects(state),
    completed_fetch_jobs: state.fetch_job.fetch_jobs ? state.fetch_job.fetch_jobs.filter(fj => fj.details.status == COMPLETED) : [],
});


const mapDispatchToProps = dispatch => bindActionCreators({
    getProjectFetchJobs: getProjectFetchJobs,
    getUserProjects: getUserProjects,
    logOutUser: logOutUser
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
