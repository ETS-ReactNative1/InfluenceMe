import React from 'react'
import { Text, View, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import { PulseIndicator } from 'react-native-indicators'
import { Divider } from 'react-native-elements'
import { IN_PROGRESS, COMPLETED, PENDING } from '../../constants/index'
import { colors, base, dimensions } from '../../styles/base'
import { fetchJobStyle } from '../../screens/FetchJob/styles/fetchJob.styles'
import { IconButton } from '../buttons/IconButton'

export const FetchJobList = ({ fetch_jobs, goToFetchJob, deleteFetchJob, startFetchJob }) => {
    const FJList = (fj, index) => {
        const success = fj.influencers ? fj.influencers.success.length : 0
        return (
            <View key={index}>
                <View style={fetchJobStyle.listItem}>
                    <View style={fetchJobStyle.top}>
                        <Text style={{ ...base.title, marginBottom: 10, fontSize: 20, color: colors.SECONDARY }}>
                            {`# ${fj.details.hashtag}`}</Text>
                        <IconButton
                            name='chevron-right'
                            size={50}
                            color={colors.TERTIARY}
                            type='material-icons'
                            style={{ alignSelf: 'flex-end' }}
                            onPress={() => goToFetchJob(fj)}
                        />
                    </View>
                    <Divider />
                    <View style={fetchJobStyle.middle}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ ...base.text, fontSize: 12, padding: 0 }}>Title</Text>
                                <Text style={{ ...base.title, fontSize: 14 }}>{fj.details.title}</Text>
                            </View>
                            {fj.details.status == IN_PROGRESS &&
                                <PulseIndicator size={20} color={colors.GREEN} />}
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ ...base.text, fontSize: 12, padding: 0 }}>Date added</Text>
                                <Text style={{ ...base.title, fontSize: 14 }}>{fj.details.date_created}</Text>
                            </View>
                            {fj.details.status == COMPLETED &&
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...base.title, color: colors.SECONDARY, fontSize: 25, alignSelf: 'center', marginRight: 10 }}>{success}</Text>
                                    <IconButton
                                        name='account-multiple-check'
                                        size={40}
                                        color={colors.SECONDARY}
                                        type='material-community'
                                        onPress={() => goToFetchJob(fj)}
                                    />
                                </View>}
                        </View>
                    </View>
                    <Divider />
                    {fj.details.status != IN_PROGRESS && <View style={fetchJobStyle.bottom}>
                        <View />
                        {fj.details.status == PENDING && <IconButton
                            name='account-search-outline'
                            size={45}
                            color={colors.PRIMARY}
                            style={{ alignSelf: 'center' }}
                            type='material-community'
                            onPress={() => startFetchJob(fj)} />}
                        <IconButton
                            name='delete-outline'
                            size={40}
                            color={colors.TERTIARY}
                            type='material-community'
                            style={{ display: 'flex', alignSelf: 'flex-end' }}
                            onPress={() => deleteFetchJob(fj)}
                        />
                    </View>}
                </View>
            </View >
        )
    }

    return (

        <View style={{ marginBottom: dimensions.fullHeight * 0.6 }}>
            <ScrollView
                contentContainerStyle={base.scrollContainer}>
                {fetch_jobs.map((fj, index) => {
                    return FJList(fj, index)
                })}
            </ScrollView>
        </View>
    )

}

FetchJobList.propTypes = {
    fetch_jobs: PropTypes.array.isRequired,
    goToFetchJob: PropTypes.func,
}

FetchJobList.defaultProps = {
    goToFetchJob: null,
}
