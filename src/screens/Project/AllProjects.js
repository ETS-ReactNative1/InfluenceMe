import * as React from 'react'
import { View, Text } from 'react-native'
import { AppHeader } from '../../layouts/Header'
import { ProjectList } from '../../components/list/ProjectList'
import { Input, Icon } from 'react-native-elements'
import { removeProject, setCurrentProject, getUserProjects } from '../../actions/project'
import { connect } from 'react-redux'
import { activeProjects, archivedProjects } from '../../reducers/projectReducer'
import { project_style } from './styles/project.styles'
import { colors, base, dimensions } from '../../styles/base'
import { LoadingScreen } from '../../components/loading/LoadingScreen'
import { TabView } from '../../components/tabview/TabView'

class AllProjects extends React.Component {

    static navigationOptions = {
        headerShown: false,
    }

    state = {
        index: 0,
        searched: [],
        isSearch: false,
        active: [],
        archived: []
    }

    componentDidMount() {
        let { user, getUserProjects } = this.props
        getUserProjects(user.current_user.id)
    }

    goToProject = proj => {
        let { setCurrentProject } = this.props
        this.props.navigation.navigate('ProjectView')
        setCurrentProject(proj)
    }

    deleteProject = project => {
        let { removeProject } = this.props
        removeProject(project)
    }

    searchProject = text => {
        const { project } = this.props
        let filtered_projects = [...project.all_projects.filter(proj => proj.title.toLowerCase().includes(text.toLowerCase()))]
        this.setState({ searched: filtered_projects, isSearch: true })
    }

    setTab = index => {
        this.setState({ index })
    }

    render() {
        const { index, searched, isSearch } = this.state
        const { project } = this.props

        return (
            <View>
                <AppHeader
                    gradient={true}
                    left={<View style={base.searchTxt}><Text style={base.title}>Search</Text></View>}
                    center={<View style={base.searchView}>
                        <Input
                            onChangeText={text => this.searchProject(text)}
                            inputStyle={base.inputStyle}
                            inputContainerStyle={base.searchInput} />
                    </View>} />
                <View style={base.container}>
                    <TabView titles={['Active', 'Archived']} onPress={this.setTab} color={colors.TERTIARY} size={dimensions.fullWidth * .4} index={index} />
                    {project.pending && <LoadingScreen size='large' />}
                    {!project.pending && !project.error &&
                        index == 0 ?
                        <View>
                            <ProjectList
                                goToProject={this.goToProject}
                                deleteProject={this.deleteProject}
                                projects={isSearch ? [...searched.filter(proj => proj.active == true)] :
                                    activeProjects(project)} />
                        </View> :
                        <View>
                            <ProjectList
                                goToProject={this.goToProject}
                                deleteProject={this.deleteProject}
                                projects={isSearch ? [...searched.filter(proj => proj.active == false)] :
                                    archivedProjects(project)} />
                        </View>}

                    {project.error &&
                        <View style={base.centerItems}>
                            <Text style={base.noneMessage}>Start your first campaign</Text>
                        </View>}
                    <Icon name='plus' type='material-community' size={50} color={colors.TERTIARY}
                        onPress={() => this.props.navigation.navigate('AddProject')} />
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    project: state.project,
    running_fetch: state.running_fetch
})

const mapDispatchToProps = {
    setCurrentProject,
    getUserProjects,
    removeProject
}

export default connect(mapStateToProps, mapDispatchToProps)(AllProjects)
