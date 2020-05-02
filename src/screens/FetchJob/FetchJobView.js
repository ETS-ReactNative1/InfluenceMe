import * as React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { AppHeader } from '../../layouts/Header'
import { setCurrentInfluencer, clearInfluencerState } from '../../actions/influencer'
import { connect } from 'react-redux'
import { InfluencerListFjView } from '../../components/list/InfluencerListFjView'
import { getAllInfluencers } from '../../actions/influencer'
import { TextButton } from '../../components/buttons/TextButton'
import { updateFetchJob, setCurrentFetchJob } from '../../actions/fetchJob'
import { fetchMedia } from '../../web/fetchMedia'
import { Bar } from 'react-native-progress'
import { COMPLETED, PENDING, IN_PROGRESS, MEDIA_FETCH, USER_FETCH } from '../../constants'
import { fetchPending, fetchResponse, clearRunningFetchJob } from '../../actions/fetch'
import { fetchNextPage } from '../../web/fetchNextPage'
import { COMPLETED_GET_USERS, COMPLETED_FETCH, GET_MEDIA_SUCCESS, GET_USER_ERROR, GET_USER_SUCCESS } from '../../constants/response/types'
import { fetchJobStyle } from './styles/fetchJob.styles'
import { BackButton } from '../../components/buttons/BackButton'
import FetchJobForm from '../../components/forms/FetchJobForm'
import { base, dimensions, colors } from '../../styles/base'
import { Gradient } from '../../styles/Gradient'
import { LoadingScreen } from '../../components/loading/LoadingScreen'
import { SaveButton } from '../../components/buttons/SaveButton'
import { formatNumber } from '../../actions/base'
import { fetchInfluencer } from '../../web/fetchInfluencer'

class FetchJobView extends React.Component {
    state = {
        currentJob: {
            details: {
                criteria: { followerMin: 0, followerMax: 0 },
                status: "", stage: "",
                id: ""
            },
            influencers: { success: [], pending: [], fail: [] }
        }
    }


    static navigationOptions = {
        headerShown: false
    }

    componentDidMount() {
        const { fetch_job, getAllInfluencers, running_fetch, clearRunningFetchJob } = this.props
        let job

        if (running_fetch.details.id && fetch_job.current_fetch_job.details.id == running_fetch.details.id) {
            job = { ...this.state.currentJob, ...running_fetch }
        } else {
            job = { ...this.state.currentJob, ...fetch_job.current_fetch_job }
        }

        this.setState({ currentJob: { ...job } })

        if (job.details.status == COMPLETED && job.influencers.success.length > 0) {
            getAllInfluencers(fetch_job.current_fetch_job)
        }
    }

    componentDidUpdate(prev) {
        const { currentJob } = this.state
        const { clearRunningFetchJob, running_fetch, updateFetchJob, fetchPending, fetchResponse } = this.props


        // if (running_fetch.pending == false &&
        //     running_fetch.response !== null &&
        //     running_fetch.response.type == COMPLETED_FETCH &&
        //     currentJob.details.status == PENDING) {
        //     clearRunningFetchJob()
        // }

        if (currentJob.details.status == COMPLETED && currentJob.influencers.success.length > 0) {
            getAllInfluencers(currentJob)
        }

        if (prev.running_fetch.details.status !== running_fetch.details.status) {
            updateFetchJob(running_fetch)
        }

        if (running_fetch.response !== null) {
            if (running_fetch.details.status == IN_PROGRESS) {
                if (running_fetch.influencers.success.length >= Number(running_fetch.details.no_profiles) && running_fetch.response.type !== COMPLETED_FETCH) {
                    fetchResponse({
                        type: COMPLETED_FETCH
                    })

                } else {
                    if (running_fetch.response.type == COMPLETED_GET_USERS && running_fetch.has_next_page &&
                        running_fetch.progress.total == running_fetch.progress.done) {

                        let ref = setInterval(() => {
                            fetchNextPage(running_fetch, fetchPending, fetchResponse)
                            clearInterval(ref)
                        }, 5000)

                    } else if (running_fetch.response.type == GET_MEDIA_SUCCESS ||
                        running_fetch.response.type == GET_USER_ERROR ||
                        running_fetch.response.type == GET_USER_SUCCESS) {
                        let ref = setInterval(() => {
                            fetchInfluencer(running_fetch.influencers.pending[running_fetch.influencers.pending.length - 1], running_fetch,
                                fetchPending, fetchResponse)
                            clearInterval(ref)
                        }, 8000)
                    }
                }
            }
        }
    }

    startFetchJob = () => {
        const { running_fetch, fetch_job, fetchPending, fetchResponse } = this.props
        let running = {
            ...running_fetch, details: { ...fetch_job.current_fetch_job.details }
        }
        fetchMedia(running, fetchPending, fetchResponse)
    }

    handleChange = updatedFetchJob => {
        const { currentJob } = this.state
        this.setState({
            currentJob: {
                ...currentJob,
                details: { ...updatedFetchJob }
            }
        })
    }

    handleSubmit = () => {
        const { currentJob } = this.state
        const { updateFetchJob } = this.props
        updateFetchJob(currentJob)
        Alert.alert("Search updated")
    }

    goToInfluencer = influ => {
        const { navigation, setCurrentInfluencer } = this.props
        setCurrentInfluencer(influ)
        navigation.goBack()
        navigation.navigate('ViewInfluencer')
    }

    getProgressPercent = () => {
        const { running_fetch } = this.props
        return (running_fetch.influencers.success.length /
            Number(running_fetch.details.no_profiles) * 100).toFixed() || 0
    }

    render() {
        const { currentJob } = this.state
        const { influencer, navigation, running_fetch, fetch_job } = this.props

        const job = running_fetch.details.id == currentJob.details.id ? running_fetch : currentJob
        const criteria = { ...job.details.criteria }
        const successLen = job.influencers.success.length || 0

        console.log(job)
        // show number of influencers fetched
        return (
            <View>
                <AppHeader
                    gradient={true}
                    left={<BackButton onPress={() => navigation.goBack()} />}
                    right={<SaveButton onPress={this.handleSubmit} />}
                />
                <View style={base.container}>
                    <FetchJobForm goBack={navigation.goBack} fetchJob={job.details}
                        handleChange={this.handleChange} />
                    {job.details.status !== PENDING && <View style={fetchJobStyle.followerBox}>
                        <Text style={base.title}>Follower Range</Text>
                        <View style={fetchJobStyle.followerView}>
                            <Text style={base.text}>
                                {`${formatNumber(criteria.followerMin)}  -  ${formatNumber(criteria.followerMax)}`}
                            </Text>
                        </View>
                    </View>}
                    <View style={fetchJobStyle.statusBox}>
                        <Text style={base.title}>Status</Text>
                        <View style={fetchJobStyle.statusView}>
                            {job.details.status == IN_PROGRESS &&
                                <View style={fetchJobStyle.progress}>
                                    <View style={fetchJobStyle.progressView}>
                                        <Gradient style={{ borderRadius: 10 }}>
                                            <Bar indeterminate={true} color={colors.SCREEN}
                                                width={dimensions.fullWidth * 0.9} height={25}
                                                style={fetchJobStyle.progressBar} />
                                        </Gradient>
                                        <View style={fetchJobStyle.percentView}>
                                            <Text style={base.title}>{this.getProgressPercent()} %</Text>
                                        </View>
                                    </View>
                                    {job.stage == MEDIA_FETCH && <Text style={base.text}>Searching through hashtag publications...</Text>}
                                    {job.stage == USER_FETCH && <Text style={base.text}>Found profile...checking criteria</Text>}
                                    {job.stage == USER_FETCH && job.response !== null && job.response.type == GET_USER_ERROR && <Text style={base.text}>No match</Text>}
                                    {job.stage == USER_FETCH && job.response !== null && job.response.type == GET_USER_SUCCESS && <Text style={base.text}>Matching profile</Text>}
                                </View>}
                            {job.details.status !== IN_PROGRESS &&
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}><Text style={base.text}>{job.details.status}</Text>
                                    {job.details.status == COMPLETED &&
                                        <Text style={base.text}>{`Found ${successLen} ${successLen == 1 ? `profile` : `profiles`}`}</Text>}</View>}
                        </View>
                    </View>
                    {currentJob.details.status == COMPLETED && successLen > 0 &&
                        <View style={base.itemViewListContainer}>
                            <View style={base.itemViewListNav}>
                                <Text style={base.title}>Influencers</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('AllInfluencers')}>
                                    <Text style={base.title}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            {influencer.error != null &&
                                <View style={base.centerItems}>
                                    <Text style={base.text}>{influencer.error.message}</Text>
                                </View>}
                            {influencer.pending && <LoadingScreen />}
                            {influencer.pending == false && successLen > 0 && job.influencers.success &&
                                <InfluencerListFjView goToInfluencer={this.goToInfluencer} influencers={influencer.all_influencers} />}
                        </View>}
                    {running_fetch.details.id && running_fetch.details.id !== job.details.id && running_fetch.pending &&
                        < View style={base.centerItems}>
                            <Text style={base.title}>Wait, another search is in progress</Text>
                        </View>}
                    {job.details.status == PENDING && !running_fetch.pending &&
                        < View style={base.centerItems}>
                            <TextButton title="Start" containerStyle={fetchJobStyle.startBtn}
                                buttonText={base.defaultTxt} onPress={() => this.startFetchJob()} />
                        </View>}
                </View >
            </View >
        )
    }
}


const mapStateToProps = state => ({
    user: state.user,
    fetch_job: state.fetch_job,
    influencer: state.influencer,
    running_fetch: state.running_fetch
})

const mapDispatchToProps = {
    getAllInfluencers,
    setCurrentInfluencer,
    fetchPending,
    fetchResponse,
    clearInfluencerState,
    setCurrentFetchJob,
    updateFetchJob,
    clearRunningFetchJob
}

export default connect(mapStateToProps, mapDispatchToProps)(FetchJobView)
