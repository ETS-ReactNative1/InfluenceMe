import { INSTAGRAM_GET_MEDIA_BY_HASHTAG } from "../constants/insta_endpoints"
import { fetchInfluencer } from "./fetchInfluencer"
import { GET_MEDIA_BY_HASHTAG_PENDING, GET_MEDIA_BY_HASHTAG_ERROR, GET_MEDIA_BY_HASHTAG_SUCCESS, COMPLETED_GET_ALL_USERS } from "../constants/response/types"
import { GET_HASHTAG_MEDIA_ERROR, GET_HASHTAG_MEDIA_SUCCESS } from "../constants/response/messages"

export const fetchMedia = (fetch_job, pending, success, error) => {
    let response

    pending(GET_MEDIA_BY_HASHTAG_PENDING, fetch_job)

    fetch(INSTAGRAM_GET_MEDIA_BY_HASHTAG(fetch_job.details.hashtag))
        .then(result => {

            if (!result.ok || result.ok == null) {
                response = {
                    type: GET_MEDIA_BY_HASHTAG_ERROR,
                    message: 'error: no hashtag media'
                }
                error(response)
            }
            else {
                result.json().then(res => {
                    let edge_hashtag_to_media = { ...res.graphql.hashtag.edge_hashtag_to_media }
                    let related_tags = { ...res.graphql.hashtag.edge_hashtag_to_related_tags }

                    response = {
                        type: GET_MEDIA_BY_HASHTAG_SUCCESS,
                        media_ids: [...extractIds(edge_hashtag_to_media.edges, fetch_job.details.criteria)],
                        message: GET_HASHTAG_MEDIA_SUCCESS,
                        related_tags: extractTags(related_tags.edges),
                        has_next_page: edge_hashtag_to_media.page_info.has_next_page,
                    }

                    if (response.media_ids.length > 0) {
                        getInfluencers(response.media_ids, fetch_job, pending, success, error)
                    } else {
                        response = {
                            type: COMPLETED_GET_ALL_USERS,
                            message: GET_HASHTAG_MEDIA_ERROR,
                            has_next_page: edge_hashtag_to_media.page_info.has_next_page,
                        }
                    }

                    if (response.has_next_page) {
                        response = {
                            ...response,
                            end_cursor: edge_hashtag_to_media.page_info.end_cursor
                        }
                    }

                    success(response)
                })
            }

        }).catch(error => {
            response = {
                type: GET_MEDIA_BY_HASHTAG_ERROR,
                message: String(error)
            }
            error(response)
        })
}

export const getInfluencers = (ids, fetch_job, pending, success, error) => {
    let i = 0

    let ref = setInterval(() => {
        fetchInfluencer(ids[i], fetch_job, pending, success, error);
        ++i
        if (i == ids.length) clearInterval(ref);
    }, 6000);

}

export const extractIds = (edges, criteria) => {
    let media_ids = []

    if (edges.length > 0) {
        edges.forEach(edge => {
            console.log(criteria)
            if (media_ids.find(id => id == edge.node.owner.id) == null)
                media_ids.push(edge.node.owner.id)
        })
    }

    return media_ids
}

export const extractTags = edges => {

    let tags = []

    edges.forEach(node => {

        tags.push(node.node.name)
    })

    return tags
}

export const likesMin = active => {

    let likes_min = (active.followers_min * .2)

    return likes_min
}