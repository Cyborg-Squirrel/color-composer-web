import { ClientStatus } from "~/api/clients/clients_api";

export function getLastSeenAtString(lastSeenAt: number) {
    let now = new Date();
    let diff = now.getTime() - lastSeenAt;
    let second = 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;

    let today = new Date(now.getTime());
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    let yesterday = new Date(now.getTime() - day);
    yesterday.setHours(0);
    yesterday.setMinutes(0);
    yesterday.setSeconds(0);
    yesterday.setMilliseconds(0);

    if (lastSeenAt > today.getTime()) {
        if (diff < minute) {
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
        }

        return new Date(lastSeenAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
    } else if (lastSeenAt >= yesterday.getTime()) {
        return 'yesterday';
    }

    return new Date(lastSeenAt).toLocaleDateString();
}

export function getClientStatusText(status: ClientStatus) {
    /// Split setup incomplete into two words
    if (status === ClientStatus.SetupIncomplete) {
        return 'Setup incomplete';
    } else {
        return status.toString();
    }
}

export function getStripStatusText(activeEffects: number) {
    return activeEffects > 0 ? 'Active': 'Inactive';
}

export function getStripStatusColor(activeEffects: number) {
    if (activeEffects > 0) {
        return 'var(--mantine-color-green-8)';
    } else {
        return 'light-dark(var(--mantine-color-text), var(--mantine-color-dimmed))';
    }
}

export function getClientStatusColor(status: ClientStatus) {
    switch (status) {
        case ClientStatus.SetupIncomplete:
            return 'light-dark(var(--mantine-color-yellow-8), var(--mantine-color-yellow-6))';
        case ClientStatus.Idle:
        case ClientStatus.Active:
            return 'var(--mantine-color-green-8)';
        case ClientStatus.Offline:
            return 'light-dark(var(--mantine-color-text), var(--mantine-color-dimmed))';
        case ClientStatus.Error:
            return 'var(--mantine-color-red-8)';
        default:
            return 'var(--mantine-color-red-8)';
    }
}
