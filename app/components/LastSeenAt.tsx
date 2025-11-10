export function getLastSeenAtString(lastSeenAt: number) {
    let now = new Date();
    let diff = now.getTime() - lastSeenAt;
    let second = 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;

    let yesterday = new Date(now.getTime() - day);
    yesterday.setHours(0);
    yesterday.setMinutes(0);
    yesterday.setSeconds(0);
    yesterday.setMilliseconds(0);

    let twoDaysAgo = new Date(now.getTime() - (day * 2));
    twoDaysAgo.setHours(0);
    twoDaysAgo.setMinutes(0);
    twoDaysAgo.setSeconds(0);
    twoDaysAgo.setMilliseconds(0);

    if (diff < second) {
        return 'now';
    } else if (diff < minute) {
        let seconds = Math.trunc(diff / second)
        if (seconds == 1) {
            return '1 second ago'
        } else {
            return seconds + ' seconds ago'
        }
    } else if (diff < hour) {
        let minutes = Math.trunc(diff / minute)
        if (minutes == 1) {
            return '1 minute ago'
        } else {
            return minutes + ' minutes ago'
        }
    } else if (lastSeenAt <= yesterday.getTime() && lastSeenAt > twoDaysAgo.getTime()) {
        return 'yesterday';
    } else if (lastSeenAt <= twoDaysAgo.getTime()) {
        return new Date(lastSeenAt).toLocaleDateString();
    }

    return new Date(lastSeenAt).toLocaleTimeString();
}