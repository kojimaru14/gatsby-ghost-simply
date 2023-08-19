import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { Layout } from '../../components/common'
import { MetaData } from '../../components/common/meta'
import ArticleBody from '../../components/article/ArticleBody'
import ArticleRelated from '../../components/article/ArticleRelated'
import ArticleHeader from '../../components/article/ArticleHeader'
import { resolveUrl } from '../../utils/relativeUrl'

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/
const PostNotImage = ({ data, location, pageContext }) => {
    const post = data.currentPost
    const prevPost = data.previousPost
    const nextPost = data.nextPost
    const relatedPosts = data.relatedPosts.edges
    const tags = post.tags.map(item => item.name)
    post.url = resolveUrl(pageContext.collectionPath, post.url)
    if (prevPost) {
        prevPost.url = resolveUrl(pageContext.collectionPath, prevPost.url)
    }
    if (nextPost) {
        nextPost.url = resolveUrl(pageContext.collectionPath, nextPost.url)
    }

    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="article"
            />
            <Helmet>
                <style type="text/css">{`${post.codeinjection_styles}`}</style>
            </Helmet>
            <Layout footer={true} bodyClass="is-article" isPost={true}>

                <article className="post mb-10 pt-8 lg:pt-10 relative">
                    <ArticleHeader post={post} />
                    <ArticleBody post={post} nextPost={nextPost} prevPost={prevPost} />
                </article>
                {(!tags.includes(`#podcast`) && !tags.includes(`#portfolio`)) && <ArticleRelated relatedPosts={relatedPosts} />}
            </Layout>
        </>
    )
}

PostNotImage.propTypes = {
    data: PropTypes.shape({
        currentPost: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            primary_tag: PropTypes.object,
            feature_image: PropTypes.string,
            id: PropTypes.string.isRequired,
            custom_excerpt: PropTypes.string,
            tags: PropTypes.array,
            url: PropTypes.string.isRequired,
        }).isRequired,
        nextPost: PropTypes.shape({
            url: PropTypes.string,
            title: PropTypes.string,
            feature_image: PropTypes.string,
            excerpt: PropTypes.string,
        }),
        previousPost: PropTypes.shape({
            url: PropTypes.string,
            title: PropTypes.string,
            feature_image: PropTypes.string,
            excerpt: PropTypes.string,
        }),
        relatedPosts: PropTypes.shape({
            edges: PropTypes.array.isRequired,
        }).isRequired,
        //allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.object.isRequired,
}

export default PostNotImage

export const postQuery = graphql`
    query($slug: String!, $next: String, $prev: String, $primary_tag: String) {
        currentPost: ghostPost(slug: { eq: $slug }) {
            localFeatureImage {
                childImageSharp {
                gatsbyImageData(
                    transformOptions: {
                        fit: COVER, cropFocus: ATTENTION
                    }
                    width: 2000
                    placeholder: BLURRED
                    formats: [AUTO, WEBP]
                    )
                }
            }
            authors {
                localProfileImage {
                    childImageSharp {
                        gatsbyImageData(
                            transformOptions: {
                                fit: COVER, cropFocus: ATTENTION
                            }
                        width: 36
                        height: 36
                        placeholder: BLURRED
                        formats: [AUTO, WEBP]
                        )
                    }
                }
            }
            ...GhostPostFields
        }
        nextPost: ghostPost(slug: { eq: $next }) {
            url
            title
            feature_image
            localFeatureImage {
            childImageSharp {
            gatsbyImageData(
                transformOptions: {
                    fit: COVER, cropFocus: ENTROPY
                    }
                aspectRatio: 1.84
                placeholder: BLURRED
                formats: [AUTO, WEBP]
                )
            }
        }
            excerpt
        }
        previousPost: ghostPost(slug: { eq: $prev }) {
            url
            title
            feature_image
            localFeatureImage {
            childImageSharp {
            gatsbyImageData(
                transformOptions: {
                    fit: COVER, cropFocus: ENTROPY
                    }
                aspectRatio: 1.84
                placeholder: BLURRED
                formats: [AUTO, WEBP]
                )
            }
        }
            excerpt
        }
        relatedPosts: allGhostPost(
            filter: {
                slug: {ne: $slug}, primary_tag: {slug: {eq: $primary_tag}}, tags: {elemMatch: {name: {nin: ["#portfolio","#podcast","#dummy-kusi-doc"]}}}
                },
            sort: {published_at: DESC}
            limit: 6,
        ) {
            edges {
                node {
                    url
                    title
                    feature_image
                    localFeatureImage {
                        childImageSharp {
                        gatsbyImageData(transformOptions: {
                                fit: COVER, cropFocus: ATTENTION
                            }
                            width: 720

                            placeholder: BLURRED
                            formats: [AUTO, WEBP]
                            )
                        }
                    }
                    excerpt
                    html
                    reading_time
                    created_at_pretty: created_at(formatString: "DD MMMM, YYYY")
                    published_at_pretty: published_at(formatString: "DD MMMM, YYYY")
                    updated_at_pretty: updated_at(formatString: "DD MMMM, YYYY")
                    published_at
                    updated_at
                    internal {
                        type
                    }
                }
            }
        }
    }
`
