import { AlertState } from 'components/Alert';
import SpotifyConnection, { UserProfile } from './spotify';

const errorMessages = {
    access_denied: 'Access to Spotify was denied.',
    invalid_token: 'Authorization with Spotify failed.',
} as Record<string, string>;

export function handleAuthError(errorCode: unknown, handleAlertChange: (state: AlertState) => void) {
    handleAlertChange({
        severity: 'error',
        message:
            typeof errorCode === 'string' && errorCode in errorMessages
                ? errorMessages[errorCode]
                : `An error occured. (Code: ${errorCode})`,
    });
}

export async function handleAuthSuccess(
    connection: SpotifyConnection,
    handleAlertChange: (state: AlertState) => void,
    handleConnectionState: (connection: SpotifyConnection | null) => void,
    handleUserProfileData: (profile: UserProfile) => void,
    handleAccessTokenChange: (newAccessToken: string) => void
) {
    let userProfile: UserProfile;

    try {
        userProfile = await connection.verify(handleAccessTokenChange);
    } catch (errorCode) {
        handleConnectionState(null);
        if (errorCode === 400) {
            handleAuthError('invalid_token', handleAlertChange);
        } else {
            handleAuthError(
                typeof errorCode === 'number' ? `HTTP response ${errorCode}` : errorCode,
                handleAlertChange
            );
        }
        return;
    }

    handleConnectionState(connection);
    handleUserProfileData(userProfile);
    handleAlertChange({
        severity: 'success',
        message: `Successfully connected to ${userProfile.display_name}'s Spotify profile.`,
    });
}
