import React from 'react';
import {Row, Col} from 'react-bootstrap'

import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon,
    PinterestShareButton,
    PinterestIcon,
    PocketShareButton,
    PocketIcon,
    RedditShareButton,
    RedditIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon
} from "react-share"

const SocialShareButtons = () => {
    const summaryText = "COVID Stats U.S. - Trusted COVID-19 Data"
    // const description = "Quickly compare COVID-19 metrics across the Unites States using official state reported data."

    // if (isBrowser()) { url = window.location.href; }
    let url = 'https://covidstatsus.com'

    return (
        <Row>
            <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
                <FacebookShareButton url={url} quote={summaryText}>
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
            </Col>
            <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
                <TwitterShareButton url={url} title={summaryText} via="tylermorganme">
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
            </Col>
            <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
                <RedditShareButton url={url} title={summaryText}>
                    <RedditIcon size={32} round />
                </RedditShareButton>
            </Col>
            <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
                <PocketShareButton url={url} title={summaryText}>
                    <PocketIcon size={32} round />
                </PocketShareButton>
            </Col>
            <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
                <PinterestShareButton url={url} description={summaryText}>
                    <PinterestIcon size={32} round />
                </PinterestShareButton>
            </Col>
            <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
                <EmailShareButton url={url} subject={summaryText} body="I thought you might be intersted in looking at this data.">
                    <EmailIcon size={32} round />
                </EmailShareButton>
            </Col>
            <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
                <WhatsappShareButton url={url} title={summaryText}>
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
            </Col>
            <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
                <LinkedinShareButton url={url} summary={summaryText} source="COVID Stats U.S.">
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
            </Col>
        </Row>
    )
}

export default SocialShareButtons