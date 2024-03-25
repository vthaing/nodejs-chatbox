import {animateScroll, scroller} from 'react-scroll';

export const scrollToBottom = (id: string) => {

    animateScroll.scrollToBottom(
        {
            containerId: id,
            duration: 0,
        }
    );

}


export const scrollToBottomAnimated = (id: string) => {

    animateScroll.scrollToBottom(
        {
            containerId: id,
            duration: 250,
        }
    );

}


export const scrollToMessage = (messageId: string) => {
    scroller.scrollTo('pinned-message-' + messageId, {
        duration: 250,
        containerId: 'messages',
        smooth: true
    })
}